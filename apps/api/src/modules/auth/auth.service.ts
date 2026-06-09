import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthTokens, AuthUser } from '@rotalive/shared';

import { UserRepository } from '../users/repositories/user.repository';
import { AuthResult, SupabaseService } from './supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly userRepository: UserRepository,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
    phone?: string | null,
  ): Promise<AuthTokens & { user: AuthUser }> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    let authResult: AuthResult;
    try {
      authResult = await this.supabaseService.signUp(email, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar conta';
      throw new BadRequestException(message);
    }

    const user = await this.userRepository.create({
      supabaseId: authResult.user.id,
      email,
      name,
      phone: phone ?? null,
    });

    return {
      accessToken: authResult.accessToken,
      refreshToken: authResult.refreshToken,
      expiresIn: authResult.expiresIn,
      user: this.mapToAuthUser(user),
    };
  }

  async login(email: string, password: string): Promise<AuthTokens & { user: AuthUser }> {
    let authResult: AuthResult;
    try {
      authResult = await this.supabaseService.signIn(email, password);
    } catch {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    let user = await this.userRepository.findBySupabaseId(authResult.user.id);

    if (!user) {
      user = await this.userRepository.create({
        supabaseId: authResult.user.id,
        email: authResult.user.email ?? email,
        name: null,
      });
    }

    return {
      accessToken: authResult.accessToken,
      refreshToken: authResult.refreshToken,
      expiresIn: authResult.expiresIn,
      user: this.mapToAuthUser(user),
    };
  }

  async logout(accessToken: string): Promise<void> {
    try {
      await this.supabaseService.signOut(accessToken);
    } catch {
      // Session may already be invalid — logout is idempotent
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // LGPD: não revelar se o e-mail existe
      return;
    }

    try {
      await this.supabaseService.resetPassword(email);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao enviar e-mail de recuperação';
      throw new BadRequestException(message);
    }
  }

  async resetPassword(accessToken: string, password: string): Promise<void> {
    try {
      await this.supabaseService.updatePassword(accessToken, password);
    } catch {
      throw new BadRequestException('Token inválido ou expirado');
    }
  }

  async getMe(supabaseId: string): Promise<AuthUser> {
    const user = await this.userRepository.findBySupabaseId(supabaseId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return this.mapToAuthUser(user);
  }

  async syncSession(accessToken: string): Promise<AuthTokens & { user: AuthUser }> {
    let supabaseUser;
    try {
      supabaseUser = await this.supabaseService.getUserFromToken(accessToken);
    } catch {
      throw new UnauthorizedException('Sessão inválida ou expirada');
    }

    const metadata = supabaseUser.user_metadata as Record<string, string> | undefined;
    const name = metadata?.full_name ?? metadata?.name ?? null;
    const photoUrl = metadata?.avatar_url ?? metadata?.picture ?? null;

    let user = await this.userRepository.findBySupabaseId(supabaseUser.id);

    if (!user) {
      user = await this.userRepository.create({
        supabaseId: supabaseUser.id,
        email: supabaseUser.email ?? '',
        name,
      });
    }

    if (photoUrl && !user.photoUrl) {
      user = await this.userRepository.update(user.id, { photoUrl });
    }

    return {
      accessToken,
      refreshToken: '',
      expiresIn: 3600,
      user: this.mapToAuthUser(user),
    };
  }

  private mapToAuthUser(user: {
    id: string;
    email: string;
    name: string | null;
    photoUrl: string | null;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl,
        phone: user.phone,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  }
}
