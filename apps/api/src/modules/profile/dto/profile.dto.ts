import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'João Silva' })
  name?: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg', nullable: true })
  photoUrl?: string | null;

  @ApiPropertyOptional({ example: '+5511999999999', nullable: true })
  phone?: string | null;
}
