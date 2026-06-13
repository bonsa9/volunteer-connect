import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity } from './opportunity.entity';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunityRepository: Repository<Opportunity>,
  ) {}

  async findAll(opts?: { page?: string; limit?: string; campaignId?: string; isActive?: string }) {
    const qb = this.opportunityRepository
      .createQueryBuilder('opportunity')
      .leftJoinAndSelect('opportunity.campaign', 'campaign')
      .leftJoinAndSelect('opportunity.signups', 'signups');

    if (opts?.campaignId) {
      qb.andWhere('opportunity.campaignId = :campaignId', { campaignId: opts.campaignId });
    }

    if (opts?.isActive !== undefined) {
      const isActive = opts.isActive === 'true';
      qb.andWhere('opportunity.isActive = :isActive', { isActive });
    }

    const page = Math.max(1, parseInt(opts?.page as any) || 1);
    const limit = Math.min(100, parseInt(opts?.limit as any) || 20);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  findOne(id: string) {
    return this.opportunityRepository.findOne({ where: { id }, relations: ['campaign', 'signups'] });
  }

  create(body: any) {
    const { campaignId, ...rest } = body;
    const opportunity = this.opportunityRepository.create({
      ...rest,
      campaign: campaignId ? { id: campaignId } : undefined,
    } as any);
    return this.opportunityRepository.save(opportunity);
  }

  async update(id: string, body: any) {
    const existing = await this.opportunityRepository.findOneBy({ id });
    if (!existing) return null;

    const { campaignId, ...rest } = body;
    const updateData: any = { ...rest };
    if (campaignId !== undefined) {
      updateData.campaign = campaignId ? { id: campaignId } : null;
    }

    const merged = this.opportunityRepository.merge(existing, updateData);
    return this.opportunityRepository.save(merged);
  }

  async remove(id: string) {
    const res = await this.opportunityRepository.delete(id);
    return { affected: res.affected };
  }
}
