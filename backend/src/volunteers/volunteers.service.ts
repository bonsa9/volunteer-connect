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

  async findAll(opts?: { search?: string; page?: string; limit?: string; sort?: string; skill?: string; minLevel?: string }) {
    const qb = this.volunteerRepository
      .createQueryBuilder('volunteer')
      .leftJoinAndSelect('volunteer.signups', 'signups')
      .leftJoinAndSelect('volunteer.contributions', 'contributions');

    if (opts?.search) {
      qb.where('volunteer.name LIKE :q OR volunteer.email LIKE :q', { q: `%${opts.search}%` });
    }

    if (opts?.skill) {
      const skill = opts.skill.toLowerCase();
      qb.andWhere("lower(volunteer.skills) LIKE :skill", { skill: `%${skill}%` });
    }

    if (opts?.minLevel) {
      const min = parseInt(opts.minLevel as any) || 1;
      qb.andWhere('volunteer.level >= :min', { min });
    }

    // Sorting: allow 'points', 'level', 'name' optionally prefixed with - for desc
    if (opts?.sort) {
      const s = opts.sort;
      let dir: 'ASC' | 'DESC' = 'ASC';
      let field = s;
      if (s.startsWith('-')) {
        dir = 'DESC';
        field = s.slice(1);
      }
      const allowed = ['points', 'level', 'name'];
      if (allowed.includes(field)) qb.orderBy(`volunteer.${field}`, dir);
    } else {
      qb.orderBy('volunteer.name', 'ASC');
    }

    const page = Math.max(1, parseInt(opts?.page as any) || 1);
    const limit = Math.min(100, parseInt(opts?.limit as any) || 20);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  findOne(id: string) {
    return this.volunteerRepository.findOne({ where: { id }, relations: ['signups', 'contributions'] });
  }

  create(body: Partial<Volunteer>) {
    const v = this.volunteerRepository.create(body as Volunteer);
    return this.volunteerRepository.save(v);
  }

  async update(id: string, body: Partial<Volunteer>) {
    const existing = await this.volunteerRepository.findOneBy({ id });
    if (!existing) return null;
    const merged = this.volunteerRepository.merge(existing, body as Volunteer);
    return this.volunteerRepository.save(merged);
  }

  async remove(id: string) {
    const res = await this.volunteerRepository.delete(id);
    return { affected: res.affected };
  }
}
