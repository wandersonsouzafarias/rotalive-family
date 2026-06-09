import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../users/repositories/user.repository';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService, UserRepository],
  exports: [ProfileService],
})
export class ProfileModule {}
