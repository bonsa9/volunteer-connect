import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from './contribution.entity';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionRepository: Repository<Contribution>,
  ) {}

  async findAll(opts?: { page?: string; limit?: string; volunteerId?: string; opportunityId?: string }) {
    const qb = this.contributionRepository
      .createQueryBuilder('contribution')
      .leftJoinAndSelect('contribution.volunteer', 'volunteer')
      .leftJoinAndSelect('contribution.opportunity', 'opportunity');

    if (opts?.volunteerId) {
      qb.andWhere('contribution.volunteerId = :volunteerId', { volunteerId: opts.volunteerId });
    }

    if (opts?.opportunityId) {
      qb.andWhere('contribution.opportunityId = :opportunityId', { opportunityId: opts.opportunityId });
    }

    const page = Math.max(1, parseInt(opts?.page as any) || 1);
    const limit = Math.min(100, parseInt(opts?.limit as any) || 20);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  findOne(id: string) {
    return this.contributionRepository.findOne({ where: { id }, relations: ['volunteer', 'opportunity'] });
  }

  create(body: Partial<Contribution>) {
    const contribution = this.contributionRepository.create(body as Contribution);
    return this.contributionRepository.save(contribution);
  }

  async update(id: string, body: Partial<Contribution>) {
    const existing = await this.contributionRepository.findOneBy({ id });
    if (!existing) return null;
    const merged = this.contributionRepository.merge(existing, body as Contribution);
    return this.contributionRepository.save(merged);
  }

  async remove(id: string) {
    const res = await this.contributionRepository.delete(id);
    return { affected: res.affected };
  }
}
