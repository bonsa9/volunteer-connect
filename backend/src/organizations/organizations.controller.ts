import { Controller, Get, Query, Param, Post, Body, Put, NotFoundException, Delete, ValidationPipe } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './organizations.dto';

@Controller('api/organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  findAll(
    @Query()
    query: { search?: string; page?: string; limit?: string },
  ) {
    return this.organizationsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const org = await this.organizationsService.findOne(id);
    if (!org) throw new NotFoundException();
    return org;
  }

  @Post()
  create(@Body(new ValidationPipe()) body: CreateOrganizationDto) {
    return this.organizationsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) body: UpdateOrganizationDto) {
    const updated = await this.organizationsService.update(id, body);
    if (!updated) throw new NotFoundException();
    return updated;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}
