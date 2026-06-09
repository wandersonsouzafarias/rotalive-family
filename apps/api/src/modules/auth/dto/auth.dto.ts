import { ApiProperty } from '@nestjs/swagger';
import { AuthUser } from '@rotalive/shared';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@email.com' })
  email!: string;

  @ApiProperty({ example: 'Senha@123' })
  password!: string;

  @ApiProperty({ example: 'João Silva' })
  name!: string;

  @ApiProperty({ example: '+5511999999999' })
  phone!: string;
}

export class LoginDto {
  @ApiProperty({ example: 'usuario@email.com' })
  email!: string;

  @ApiProperty({ example: 'Senha@123' })
  password!: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'usuario@email.com' })
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  token!: string;

  @ApiProperty({ example: 'NovaSenha@123' })
  password!: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  expiresIn!: number;

  @ApiProperty()
  user!: AuthUser;
}

export class MessageResponseDto {
  @ApiProperty()
  message!: string;
}
