import { Controller, Get, Query, Param, Post, Body, Put, NotFoundException, Delete, ValidationPipe } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto, UpdateOpportunityDto } from './opportunities.dto';

@Controller('api/opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get()
  findAll(
    @Query()
    query: { page?: string; limit?: string; campaignId?: string; isActive?: string },
  ) {
    return this.opportunitiesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const opportunity = await this.opportunitiesService.findOne(id);
    if (!opportunity) throw new NotFoundException();
    return opportunity;
  }

  @Post()
  create(@Body(new ValidationPipe()) body: CreateOpportunityDto) {
    return this.opportunitiesService.create(body as any);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) body: UpdateOpportunityDto) {
    const updated = await this.opportunitiesService.update(id, body as any);
    if (!updated) throw new NotFoundException();
    return updated;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.opportunitiesService.remove(id);
  }
}
