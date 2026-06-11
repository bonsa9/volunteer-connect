import { Controller, Get, Query, Param, Post, Body, Put, NotFoundException, Delete, ValidationPipe } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto } from './campaigns.dto';

@Controller('api/campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  findAll(
    @Query()
    query: { page?: string; limit?: string; organizationId?: string },
  ) {
    return this.campaignsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const campaign = await this.campaignsService.findOne(id);
    if (!campaign) throw new NotFoundException();
    return campaign;
  }

  @Post()
  create(@Body(new ValidationPipe()) body: CreateCampaignDto) {
    return this.campaignsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) body: UpdateCampaignDto) {
    const updated = await this.campaignsService.update(id, body);
    if (!updated) throw new NotFoundException();
    return updated;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }
}
