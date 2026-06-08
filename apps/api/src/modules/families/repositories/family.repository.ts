import { Injectable } from '@nestjs/common';
import { Family, FamilyMember, FamilyMemberRole, FamilyMemberStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';

export type FamilyWithMembers = Family & {
  members: (FamilyMember & {
    user: {
      id: string;
      name: string | null;
      email: string;
      photoUrl: string | null;
      phone: string | null;
    };
  })[];
};

export interface CreateFamilyData {
  name: string;
  ownerId: string;
}

export interface UpdateFamilyData {
  name: string;
}

@Injectable()
export class FamilyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFamilyData): Promise<Family> {
    return this.prisma.$transaction(async (tx) => {
      const family = await tx.family.create({
        data: {
          name: data.name,
          ownerId: data.ownerId,
        },
      });

      await tx.familyMember.create({
        data: {
          familyId: family.id,
          userId: data.ownerId,
          role: FamilyMemberRole.OWNER,
          status: FamilyMemberStatus.ACTIVE,
          joinedAt: new Date(),
        },
      });

      return family;
    });
  }

  async findById(id: string): Promise<Family | null> {
    return this.prisma.family.findUnique({ where: { id } });
  }

  async findByIdWithMembers(id: string): Promise<FamilyWithMembers | null> {
    return this.prisma.family.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                photoUrl: true,
                phone: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<FamilyWithMembers[]> {
    const memberships = await this.prisma.familyMember.findMany({
      where: {
        userId,
        status: FamilyMemberStatus.ACTIVE,
      },
      include: {
        family: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    photoUrl: true,
                    phone: true,
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    return memberships.map((m) => m.family);
  }

  async update(id: string, data: UpdateFamilyData): Promise<Family> {
    return this.prisma.family.update({ where: { id }, data });
  }

  async isMember(familyId: string, userId: string): Promise<FamilyMember | null> {
    return this.prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId, userId } },
    });
  }

  async isOwnerOrAdmin(familyId: string, userId: string): Promise<boolean> {
    const member = await this.isMember(familyId, userId);
    return (
      member?.status === FamilyMemberStatus.ACTIVE &&
      (member.role === FamilyMemberRole.OWNER || member.role === FamilyMemberRole.ADMIN)
    );
  }

  async addMember(data: {
    familyId: string;
    userId: string;
    role?: FamilyMemberRole;
    status?: FamilyMemberStatus;
  }): Promise<FamilyMember> {
    return this.prisma.familyMember.create({
      data: {
        familyId: data.familyId,
        userId: data.userId,
        role: data.role ?? FamilyMemberRole.MEMBER,
        status: data.status ?? FamilyMemberStatus.PENDING,
        joinedAt: data.status === FamilyMemberStatus.ACTIVE ? new Date() : null,
      },
    });
  }

  async createInvitation(data: {
    familyId: string;
    email: string;
    invitedBy: string;
    expiresAt: Date;
  }): Promise<Prisma.FamilyInvitationGetPayload<object>> {
    return this.prisma.familyInvitation.create({ data });
  }

  async findInvitation(familyId: string, email: string) {
    return this.prisma.familyInvitation.findUnique({
      where: { familyId_email: { familyId, email } },
    });
  }
}
