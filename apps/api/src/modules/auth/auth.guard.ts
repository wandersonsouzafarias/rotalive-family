import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { UserRepository } from '../users/repositories/user.repository';
import { SupabaseService } from './supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: AuthenticatedUser;
    }>();

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação não fornecido');
    }

    const token = authHeader.slice(7);

    try {
      const supabaseUser = await this.supabaseService.getUserFromToken(token);
      const user = await this.userRepository.findBySupabaseId(supabaseUser.id);

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      request.user = {
        id: user.id,
        supabaseId: user.supabaseId,
        email: user.email,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
