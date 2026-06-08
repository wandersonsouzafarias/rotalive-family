import { ApiProperty } from '@nestjs/swagger';

export class CreateFamilyDto {
  @ApiProperty({ example: 'Família Silva' })
  name!: string;
}

export class UpdateFamilyDto {
  @ApiProperty({ example: 'Família Silva Santos' })
  name!: string;
}

export class InviteMemberDto {
  @ApiProperty({ example: 'membro@email.com' })
  email!: string;
}
