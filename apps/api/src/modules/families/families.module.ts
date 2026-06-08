import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../users/repositories/user.repository';
import { FamiliesController } from './families.controller';
import { FamiliesService } from './families.service';
import { FamilyRepository } from './repositories/family.repository';

@Module({
  imports: [AuthModule],
  controllers: [FamiliesController],
  providers: [FamiliesService, FamilyRepository, UserRepository],
  exports: [FamiliesService],
})
export class FamiliesModule {}
