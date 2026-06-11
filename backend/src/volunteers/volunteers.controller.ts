import { Controller, Get, Query, Param, Post, Body, Put, NotFoundException, Delete, ValidationPipe } from '@nestjs/common';
import { VolunteersService } from './volunteers.service';
import { CreateVolunteerDto, UpdateVolunteerDto } from './volunteers.dto';

@Controller('api/volunteers')
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Get()
  findAll(
    @Query()
    query: { search?: string; page?: string; limit?: string; sort?: string; skill?: string; minLevel?: string },
  ) {
    return this.volunteersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const v = await this.volunteersService.findOne(id);
    if (!v) throw new NotFoundException();
    return v;
  }

  @Post()
  create(@Body(new ValidationPipe()) body: CreateVolunteerDto) {
    return this.volunteersService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) body: UpdateVolunteerDto) {
    const updated = await this.volunteersService.update(id, body);
    if (!updated) throw new NotFoundException();
    return updated;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.volunteersService.remove(id);
  }
}
