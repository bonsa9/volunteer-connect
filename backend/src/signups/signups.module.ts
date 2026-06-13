import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Signup } from './signup.entity';
import { Volunteer } from '../volunteers/volunteer.entity';
import { SignupsService } from './signups.service';
import { SignupsController } from './signups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Signup, Volunteer])],
  providers: [SignupsService],
  controllers: [SignupsController],
  exports: [SignupsService],
})
export class SignupsModule {}
