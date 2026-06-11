import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from './opportunity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity])],
})
export class OpportunitiesModule {}
