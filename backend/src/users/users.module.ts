import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Volunteer } from '../volunteers/volunteer.entity';
import { Organization } from '../organizations/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Volunteer, Organization])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
