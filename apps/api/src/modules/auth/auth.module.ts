import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserRepository } from '../users/repositories/user.repository';

import { AuthConfigService } from './auth-config.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LocalJwtService } from './local-jwt.service';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthConfigService,
    AuthService,
    LocalJwtService,
    SupabaseService,
    AuthGuard,
    UserRepository,
  ],
  exports: [
    AuthService,
    AuthGuard,
    AuthConfigService,
    LocalJwtService,
    SupabaseService,
    UserRepository,
  ],
})
export class AuthModule {}
