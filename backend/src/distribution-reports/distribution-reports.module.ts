import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributionReport } from './distribution-report.entity';
import { DistributionReportsService } from './distribution-reports.service';
import { DistributionReportsController } from './distribution-reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DistributionReport])],
  providers: [DistributionReportsService],
  controllers: [DistributionReportsController],
  exports: [DistributionReportsService],
})
export class DistributionReportsModule {}
