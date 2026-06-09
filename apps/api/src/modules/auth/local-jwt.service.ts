import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export interface LocalJwtPayload {
  sub: string;
  email: string;
  provider: 'local';
}

export interface LocalAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class LocalJwtService {
  private readonly logger = new Logger(LocalJwtService.name);
  private readonly jwtSecret: string;
  private readonly accessExpiresIn = '7d';
  private readonly refreshExpiresIn = '30d';
  private readonly expiresInSeconds = 7 * 24 * 60 * 60;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecret =
      this.configService.get<string>('JWT_SECRET') ??
      'rotalive-dev-secret-change-before-production';

    if (this.jwtSecret.includes('change-before-production')) {
      this.logger.warn('⚠️  JWT_SECRET padrão em uso — defina JWT_SECRET em apps/api/.env');
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  signTokens(user: User): LocalAuthTokens {
    const payload: LocalJwtPayload = {
      sub: user.id,
      email: user.email,
      provider: 'local',
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.accessExpiresIn,
    });

    const refreshToken = jwt.sign({ ...payload, type: 'refresh' }, this.jwtSecret, {
      expiresIn: this.refreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.expiresInSeconds,
    };
  }

  verifyAccessToken(token: string): LocalJwtPayload {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as LocalJwtPayload & { type?: string };

      if (payload.type === 'refresh') {
        throw new UnauthorizedException('Token de acesso inválido');
      }

      if (payload.provider !== 'local' || !payload.sub) {
        throw new UnauthorizedException('Token inválido');
      }

      return payload;
    } catch (error) {
      this.logger.debug(`JWT inválido: ${error instanceof Error ? error.message : 'unknown'}`);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
