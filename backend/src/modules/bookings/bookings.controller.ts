import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/bookings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() dto: CreateBookingDto, @Req() req: any) {
    return this.bookingsService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Req() req: any) {
    if (req.user.role === 'admin') {
      return this.bookingsService.findAll();
    }
    return this.bookingsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const booking = await this.bookingsService.findOne(id);
    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
      throw new ForbiddenException('You do not own this booking');
    }
    return booking;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBookingDto, @Req() req: any) {
    const booking = await this.bookingsService.findOne(id);
    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
      throw new ForbiddenException('You can only update your own booking');
    }
    return this.bookingsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const booking = await this.bookingsService.findOne(id);
    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
      throw new ForbiddenException('You can only delete your own booking');
    }
    return this.bookingsService.remove(id);
  }
}
