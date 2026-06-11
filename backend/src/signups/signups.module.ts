import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Signup } from './signup.entity';
import { SignupsService } from './signups.service';
import { SignupsController } from './signups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Signup])],
  providers: [SignupsService],
  controllers: [SignupsController],
  exports: [SignupsService],
})
export class SignupsModule {}
