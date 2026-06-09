import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';

import { isSupabasePlaceholder } from './auth-errors';

export interface AuthResult {
  user: SupabaseUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private client?: SupabaseClient;
  private adminClient?: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const url = this.configService.get<string>('SUPABASE_URL', '');
    const anonKey = this.configService.get<string>('SUPABASE_ANON_KEY', '');
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY', '');
    const authProvider = this.configService.get<string>('AUTH_PROVIDER', 'auto').toLowerCase();

    if (authProvider === 'local') {
      this.logger.debug('SupabaseService em standby (AUTH_PROVIDER=local)');
      return;
    }

    if (isSupabasePlaceholder(url, anonKey)) {
      this.logger.debug('SupabaseService em standby — credenciais placeholder detectadas');
      return;
    }

    this.client = createClient(url, anonKey);
    this.adminClient = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  private ensureClient(): SupabaseClient {
    if (!this.client) {
      throw new Error(
        'Supabase não configurado. Defina AUTH_PROVIDER=local ou configure SUPABASE_URL em apps/api/.env',
      );
    }
    return this.client;
  }

  private ensureAdminClient(): SupabaseClient {
    if (!this.adminClient) {
      throw new Error('Supabase admin não configurado');
    }
    return this.adminClient;
  }

  async signUp(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await this.ensureClient().auth.signUp({ email, password });

    if (error) throw error;
    if (!data.user || !data.session) {
      throw new Error('Falha ao criar conta. Verifique se o e-mail de confirmação foi enviado.');
    }

    return {
      user: data.user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in ?? 3600,
    };
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await this.ensureClient().auth.signInWithPassword({ email, password });

    if (error) throw error;
    if (!data.user || !data.session) {
      throw new Error('Credenciais inválidas');
    }

    return {
      user: data.user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in ?? 3600,
    };
  }

  async signOut(accessToken: string): Promise<void> {
    const user = await this.getUserFromToken(accessToken);
    const { error } = await this.ensureAdminClient().auth.admin.signOut(user.id, 'global');
    if (error) throw error;
  }

  async resetPassword(email: string): Promise<void> {
    const redirectTo = `${this.configService.get('CORS_ORIGIN', 'http://localhost:3000')}/reset-password`;
    const { error } = await this.ensureClient().auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  }

  async updatePassword(accessToken: string, password: string): Promise<void> {
    const { error: sessionError } = await this.ensureClient().auth.setSession({
      access_token: accessToken,
      refresh_token: '',
    });
    if (sessionError) throw sessionError;

    const { error } = await this.ensureClient().auth.updateUser({ password });
    if (error) throw error;
  }

  async getUserFromToken(accessToken: string): Promise<SupabaseUser> {
    const { data, error } = await this.ensureClient().auth.getUser(accessToken);
    if (error || !data.user) throw error ?? new Error('Token inválido');
    return data.user;
  }
}
