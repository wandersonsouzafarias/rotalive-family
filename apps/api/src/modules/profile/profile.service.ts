import { Injectable, NotFoundException } from '@nestjs/common';
import { UserProfile } from '@rotalive/shared';

import { UpdateUserData, UserRepository } from '../users/repositories/user.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('Perfil não encontrado');
    return this.mapToProfile(user);
  }

  async updateProfile(userId: string, data: UpdateUserData): Promise<UserProfile> {
    const user = await this.userRepository.update(userId, data);
    return this.mapToProfile(user);
  }

  private mapToProfile(user: {
    id: string;
    email: string;
    name: string | null;
    photoUrl: string | null;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): UserProfile {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
