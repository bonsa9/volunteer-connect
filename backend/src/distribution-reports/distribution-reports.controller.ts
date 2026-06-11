import { Controller, Get, Query, Param, Post, Body, Put, NotFoundException, Delete, ValidationPipe } from '@nestjs/common';
import { DistributionReportsService } from './distribution-reports.service';
import { CreateDistributionReportDto, UpdateDistributionReportDto } from './distribution-reports.dto';

@Controller('api/distribution-reports')
export class DistributionReportsController {
  constructor(private readonly distributionReportsService: DistributionReportsService) {}

  @Get()
  findAll(
    @Query()
    query: { page?: string; limit?: string; campaignId?: string },
  ) {
    return this.distributionReportsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const report = await this.distributionReportsService.findOne(id);
    if (!report) throw new NotFoundException();
    return report;
  }

  @Post()
  create(@Body(new ValidationPipe()) body: CreateDistributionReportDto) {
    return this.distributionReportsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) body: UpdateDistributionReportDto) {
    const updated = await this.distributionReportsService.update(id, body);
    if (!updated) throw new NotFoundException();
    return updated;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.distributionReportsService.remove(id);
  }
}
