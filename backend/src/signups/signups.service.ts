import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Signup } from './signup.entity';

@Injectable()
export class SignupsService {
  constructor(
    @InjectRepository(Signup)
    private readonly signupRepository: Repository<Signup>,
  ) {}

  async findAll(opts?: { page?: string; limit?: string; volunteerId?: string; opportunityId?: string; confirmed?: string }) {
    const qb = this.signupRepository
      .createQueryBuilder('signup')
      .leftJoinAndSelect('signup.volunteer', 'volunteer')
      .leftJoinAndSelect('signup.opportunity', 'opportunity');

    if (opts?.volunteerId) {
      qb.andWhere('signup.volunteerId = :volunteerId', { volunteerId: opts.volunteerId });
    }

    if (opts?.opportunityId) {
      qb.andWhere('signup.opportunityId = :opportunityId', { opportunityId: opts.opportunityId });
    }

    if (opts?.confirmed !== undefined) {
      const confirmed = opts.confirmed === 'true';
      qb.andWhere('signup.confirmed = :confirmed', { confirmed });
    }

    const page = Math.max(1, parseInt(opts?.page as any) || 1);
    const limit = Math.min(100, parseInt(opts?.limit as any) || 20);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  findOne(id: string) {
    return this.signupRepository.findOne({ where: { id }, relations: ['volunteer', 'opportunity'] });
  }

  create(body: Partial<Signup>) {
    const signup = this.signupRepository.create(body as Signup);
    return this.signupRepository.save(signup);
  }

  async update(id: string, body: Partial<Signup>) {
    const existing = await this.signupRepository.findOneBy({ id });
    if (!existing) return null;
    const merged = this.signupRepository.merge(existing, body as Signup);
    return this.signupRepository.save(merged);
  }

  async remove(id: string) {
    const res = await this.signupRepository.delete(id);
    return { affected: res.affected };
  }
}
