import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FamilyInvitation, FamilyMemberStatus, InvitationStatus } from '@prisma/client';
import { FamilyWithMembers as SharedFamilyWithMembers } from '@rotalive/shared';

import { UserRepository } from '../users/repositories/user.repository';

import { FamilyRepository, FamilyWithMembers } from './repositories/family.repository';

@Injectable()
export class FamiliesService {
  constructor(
    private readonly familyRepository: FamilyRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(userId: string, name: string): Promise<SharedFamilyWithMembers> {
    const family = await this.familyRepository.create({ name, ownerId: userId });
    const withMembers = await this.familyRepository.findByIdWithMembers(family.id);
    return this.mapToFamilyWithMembers(withMembers!);
  }

  async findAllByUser(userId: string): Promise<SharedFamilyWithMembers[]> {
    const families = await this.familyRepository.findByUserId(userId);
    return families.map((f) => this.mapToFamilyWithMembers(f));
  }

  async findOne(familyId: string, userId: string): Promise<SharedFamilyWithMembers> {
    await this.ensureMember(familyId, userId);
    const family = await this.familyRepository.findByIdWithMembers(familyId);
    if (!family) throw new NotFoundException('Família não encontrada');
    return this.mapToFamilyWithMembers(family);
  }

  async update(familyId: string, userId: string, name: string): Promise<SharedFamilyWithMembers> {
    await this.ensureOwnerOrAdmin(familyId, userId);
    await this.familyRepository.update(familyId, { name });
    const family = await this.familyRepository.findByIdWithMembers(familyId);
    return this.mapToFamilyWithMembers(family!);
  }

  async inviteMember(familyId: string, userId: string, email: string): Promise<FamilyInvitation> {
    await this.ensureOwnerOrAdmin(familyId, userId);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const existingMember = await this.familyRepository.isMember(familyId, existingUser.id);
      if (existingMember && existingMember.status === FamilyMemberStatus.ACTIVE) {
        throw new ConflictException('Usuário já é membro desta família');
      }

      if (!existingMember) {
        await this.familyRepository.addMember({
          familyId,
          userId: existingUser.id,
          status: FamilyMemberStatus.PENDING,
        });
      }
    }

    const existingInvitation = await this.familyRepository.findInvitation(familyId, email);
    if (existingInvitation && existingInvitation.status === InvitationStatus.PENDING) {
      throw new ConflictException('Convite já enviado para este e-mail');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.familyRepository.createInvitation({
      familyId,
      email,
      invitedBy: userId,
      expiresAt,
    });
  }

  async getDashboard(familyId: string, userId: string): Promise<SharedFamilyWithMembers> {
    return this.findOne(familyId, userId);
  }

  private async ensureMember(familyId: string, userId: string): Promise<void> {
    const member = await this.familyRepository.isMember(familyId, userId);
    if (!member || member.status !== FamilyMemberStatus.ACTIVE) {
      throw new ForbiddenException('Você não tem acesso a esta família');
    }
  }

  private async ensureOwnerOrAdmin(familyId: string, userId: string): Promise<void> {
    const isAllowed = await this.familyRepository.isOwnerOrAdmin(familyId, userId);
    if (!isAllowed) {
      throw new ForbiddenException('Apenas o responsável ou administrador pode realizar esta ação');
    }
  }

  private mapToFamilyWithMembers(family: FamilyWithMembers): SharedFamilyWithMembers {
    return {
      id: family.id,
      name: family.name,
      ownerId: family.ownerId,
      createdAt: family.createdAt.toISOString(),
      updatedAt: family.updatedAt.toISOString(),
      members: family.members.map((m) => ({
        id: m.id,
        familyId: m.familyId,
        userId: m.userId,
        role: m.role as SharedFamilyWithMembers['members'][0]['role'],
        status: m.status as SharedFamilyWithMembers['members'][0]['status'],
        joinedAt: m.joinedAt?.toISOString() ?? null,
        user: {
          id: m.user.id,
          name: m.user.name,
          email: m.user.email,
          photoUrl: m.user.photoUrl,
          phone: m.user.phone,
        },
      })),
    };
  }
}
