import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { createFamilySchema, inviteMemberSchema, updateFamilySchema } from '@rotalive/shared';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { CreateFamilyDto, InviteMemberDto, UpdateFamilyDto } from './dto/family.dto';
import { FamiliesService } from './families.service';

@ApiTags('families')
@Controller('families')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova família' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createFamilySchema)) dto: CreateFamilyDto,
  ) {
    return this.familiesService.create(user.id, dto.name);
  }

  @Get()
  @ApiOperation({ summary: 'Listar famílias do usuário' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.familiesService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter família por ID' })
  @ApiParam({ name: 'id', description: 'ID da família' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.familiesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar família' })
  @ApiParam({ name: 'id', description: 'ID da família' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(updateFamilySchema)) dto: UpdateFamilyDto,
  ) {
    return this.familiesService.update(id, user.id, dto.name);
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Convidar membro para a família' })
  @ApiParam({ name: 'id', description: 'ID da família' })
  async invite(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(inviteMemberSchema)) dto: InviteMemberDto,
  ) {
    return this.familiesService.inviteMember(id, user.id, dto.email);
  }

  @Get(':id/dashboard')
  @ApiOperation({ summary: 'Dashboard — lista de membros da família' })
  @ApiParam({ name: 'id', description: 'ID da família' })
  async dashboard(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.familiesService.getDashboard(id, user.id);
  }
}
