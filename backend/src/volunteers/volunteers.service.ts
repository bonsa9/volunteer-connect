import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Volunteer } from './volunteer.entity';

@Injectable()
export class VolunteersService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
  ) {}

  findAll() {
    return this.volunteerRepository.find({ relations: ['signups', 'contributions'] });
  }
}
