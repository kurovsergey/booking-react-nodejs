import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { WorkingSeatsService } from './seats.service';
import { CreateWorkingSeatDto, UpdateWorkingSeatDto } from './dto/seats.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('seats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkingSeatsController {
  constructor(private readonly seatsService: WorkingSeatsService) {}

  @Post()
  create(@Body() dto: CreateWorkingSeatDto, @Req() req: any) {
    return this.seatsService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.seatsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const seat = await this.seatsService.findOne(id);
    if (req.user.role !== 'admin' && seat.createdById !== req.user.id) {
      throw new ForbiddenException('You do not own this working seat');
    }
    return seat;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateWorkingSeatDto, @Req() req: any) {
    const seat = await this.seatsService.findOne(id);
    if (req.user.role !== 'admin' && seat.createdById !== req.user.id) {
      throw new ForbiddenException('You can only update your own working seat');
    }
    return this.seatsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const seat = await this.seatsService.findOne(id);
    if (req.user.role !== 'admin' && seat.createdById !== req.user.id) {
      throw new ForbiddenException('You can only delete your own working seat');
    }
    return this.seatsService.remove(id);
  }
}
