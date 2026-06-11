import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Signup } from './signup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Signup])],
})
export class SignupsModule {}
