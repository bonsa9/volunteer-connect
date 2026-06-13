import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity';
import { Volunteer } from '../volunteers/volunteer.entity';
import { Organization } from '../organizations/organization.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Volunteer)
    private volunteerRepository: Repository<Volunteer>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user || undefined;
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    const savedUser = await this.usersRepository.save(newUser);

    if (savedUser.role === Role.VOLUNTEER) {
      const volunteer = this.volunteerRepository.create({
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        skills: [],
        points: 0,
        level: 1,
      });
      await this.volunteerRepository.save(volunteer);
    } else if (savedUser.role === Role.ORGANIZATION) {
      const organization = this.organizationRepository.create({
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        status: 'pending',
        type: 'non-profit', // Default
        region: '',
        phone: '',
      });
      await this.organizationRepository.save(organization);
    }

    return savedUser;
  }
}
