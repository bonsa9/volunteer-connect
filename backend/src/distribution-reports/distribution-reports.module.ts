import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributionReport } from './distribution-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DistributionReport])],
})
export class DistributionReportsModule {}
