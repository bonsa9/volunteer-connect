import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from './contribution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contribution])],
})
export class ContributionsModule {}
