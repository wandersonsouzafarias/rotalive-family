import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserRepository } from '../users/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, SupabaseService, AuthGuard, UserRepository],
  exports: [AuthService, AuthGuard, SupabaseService],
})
export class AuthModule {}
