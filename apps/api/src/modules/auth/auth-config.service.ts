import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { isSupabasePlaceholder } from './auth-errors';

export type AuthProviderMode = 'local' | 'supabase';

@Injectable()
export class AuthConfigService implements OnModuleInit {
  private readonly logger = new Logger(AuthConfigService.name);
  readonly provider: AuthProviderMode;

  constructor(private readonly configService: ConfigService) {
    this.provider = this.resolveProvider();
  }

  onModuleInit(): void {
    if (this.isLocal()) {
      this.logger.log('🔐 Autenticação LOCAL ativa (PostgreSQL + JWT)');
      this.logger.log('   Cadastro e login funcionam sem Supabase');
    } else {
      this.logger.log('🔐 Autenticação SUPABASE ativa');
    }
  }

  isLocal(): boolean {
    return this.provider === 'local';
  }

  isSupabase(): boolean {
    return this.provider === 'supabase';
  }

  private resolveProvider(): AuthProviderMode {
    const explicit = this.configService.get<string>('AUTH_PROVIDER', 'auto').toLowerCase();

    if (explicit === 'local') return 'local';
    if (explicit === 'supabase') return 'supabase';

    const url = this.configService.get<string>('SUPABASE_URL', '');
    const anonKey = this.configService.get<string>('SUPABASE_ANON_KEY', '');

    if (isSupabasePlaceholder(url, anonKey)) {
      return 'local';
    }

    return 'supabase';
  }
}
