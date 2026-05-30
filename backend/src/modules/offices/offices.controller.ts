import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { CreateOfficeDto, UpdateOfficeDto } from './dto/offices.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('offices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Post()
  create(@Body() dto: CreateOfficeDto, @Req() req: any) {
    return this.officesService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.officesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const office = await this.officesService.findOne(id);
    if (req.user.role !== 'admin' && office.createdById !== req.user.id) {
      throw new ForbiddenException('You do not own this office');
    }
    return office;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOfficeDto, @Req() req: any) {
    const office = await this.officesService.findOne(id);
    if (req.user.role !== 'admin' && office.createdById !== req.user.id) {
      throw new ForbiddenException('You can only update your own office');
    }
    return this.officesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const office = await this.officesService.findOne(id);
    if (req.user.role !== 'admin' && office.createdById !== req.user.id) {
      throw new ForbiddenException('You can only delete your own office');
    }
    return this.officesService.remove(id);
  }
}
