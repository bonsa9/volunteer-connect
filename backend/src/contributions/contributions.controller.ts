import { Controller, Get, Query, Param, Post, Body, Put, NotFoundException, Delete, ValidationPipe } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { CreateContributionDto, UpdateContributionDto } from './contributions.dto';

@Controller('api/contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Get()
  findAll(
    @Query()
    query: { page?: string; limit?: string; volunteerId?: string; opportunityId?: string },
  ) {
    return this.contributionsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const contribution = await this.contributionsService.findOne(id);
    if (!contribution) throw new NotFoundException();
    return contribution;
  }

  @Post()
  create(@Body(new ValidationPipe()) body: CreateContributionDto) {
    return this.contributionsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) body: UpdateContributionDto) {
    const updated = await this.contributionsService.update(id, body);
    if (!updated) throw new NotFoundException();
    return updated;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contributionsService.remove(id);
  }
}
