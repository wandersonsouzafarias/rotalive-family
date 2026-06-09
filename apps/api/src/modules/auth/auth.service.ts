import { randomUUID } from 'crypto';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthTokens, AuthUser } from '@rotalive/shared';

import { UserRepository } from '../users/repositories/user.repository';

import { AuthConfigService } from './auth-config.service';
import { mapAuthErrorMessage } from './auth-errors';
import { LocalJwtService } from './local-jwt.service';
import { AuthResult, SupabaseService } from './supabase.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authConfig: AuthConfigService,
    private readonly supabaseService: SupabaseService,
    private readonly localJwtService: LocalJwtService,
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

    if (this.authConfig.isLocal()) {
      return this.registerLocal(email, password, name, phone);
    }

    return this.registerSupabase(email, password, name, phone);
  }

  async login(email: string, password: string): Promise<AuthTokens & { user: AuthUser }> {
    if (this.authConfig.isLocal()) {
      return this.loginLocal(email, password);
    }

    return this.loginSupabase(email, password);
  }

  async logout(accessToken: string): Promise<void> {
    if (this.authConfig.isLocal()) {
      this.logger.debug('Logout local — sessão encerrada no cliente');
      return;
    }

    try {
      await this.supabaseService.signOut(accessToken);
    } catch {
      // idempotent
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return;

    if (this.authConfig.isLocal()) {
      throw new BadRequestException(
        'Recuperação de senha por e-mail requer Supabase (AUTH_PROVIDER=supabase)',
      );
    }

    try {
      await this.supabaseService.resetPassword(email);
    } catch (error) {
      throw new BadRequestException(mapAuthErrorMessage(error));
    }
  }

  async resetPassword(accessToken: string, password: string): Promise<void> {
    if (this.authConfig.isLocal()) {
      throw new BadRequestException(
        'Redefinição de senha requer Supabase (AUTH_PROVIDER=supabase)',
      );
    }

    try {
      await this.supabaseService.updatePassword(accessToken, password);
    } catch {
      throw new BadRequestException('Token inválido ou expirado');
    }
  }

  async getMe(userId: string): Promise<AuthUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return this.mapToAuthUser(user);
  }

  async syncSession(accessToken: string): Promise<AuthTokens & { user: AuthUser }> {
    if (this.authConfig.isLocal()) {
      throw new BadRequestException(
        'Login com Google requer Supabase configurado (AUTH_PROVIDER=supabase)',
      );
    }

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

  private async registerLocal(
    email: string,
    password: string,
    name: string,
    phone?: string | null,
  ): Promise<AuthTokens & { user: AuthUser }> {
    this.logger.log(`Cadastro local: ${email}`);

    const passwordHash = await this.localJwtService.hashPassword(password);
    const id = randomUUID();

    const user = await this.userRepository.create({
      id,
      supabaseId: id,
      email,
      name,
      phone: phone ?? null,
      passwordHash,
    });

    const tokens = this.localJwtService.signTokens(user);
    this.logger.log(`Cadastro local concluído: ${user.id}`);

    return { ...tokens, user: this.mapToAuthUser(user) };
  }

  private async registerSupabase(
    email: string,
    password: string,
    name: string,
    phone?: string | null,
  ): Promise<AuthTokens & { user: AuthUser }> {
    let authResult: AuthResult;
    try {
      authResult = await this.supabaseService.signUp(email, password);
    } catch (error) {
      this.logger.error(`Falha Supabase signUp: ${error instanceof Error ? error.message : error}`);
      throw new BadRequestException(mapAuthErrorMessage(error));
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

  private async loginLocal(
    email: string,
    password: string,
  ): Promise<AuthTokens & { user: AuthUser }> {
    this.logger.log(`Login local: ${email}`);

    const user = await this.userRepository.findByEmail(email);

    if (!user?.passwordHash) {
      this.logger.warn(`Login falhou — usuário não encontrado ou sem senha local: ${email}`);
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const valid = await this.localJwtService.comparePassword(password, user.passwordHash);
    if (!valid) {
      this.logger.warn(`Login falhou — senha incorreta: ${email}`);
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const tokens = this.localJwtService.signTokens(user);
    this.logger.log(`Login local OK: ${user.id}`);

    return { ...tokens, user: this.mapToAuthUser(user) };
  }

  private async loginSupabase(
    email: string,
    password: string,
  ): Promise<AuthTokens & { user: AuthUser }> {
    let authResult: AuthResult;
    try {
      authResult = await this.supabaseService.signIn(email, password);
    } catch (error) {
      const message = mapAuthErrorMessage(error);
      this.logger.error(`Falha Supabase signIn: ${message}`);
      if (message.includes('Supabase') || message.includes('autenticação indisponível')) {
        throw new BadRequestException(message);
      }
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
