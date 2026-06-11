import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './campaign.entity';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async findAll(opts?: { page?: string; limit?: string; organizationId?: string }) {
    const qb = this.campaignRepository
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.organization', 'organization')
      .leftJoinAndSelect('campaign.opportunities', 'opportunities');

    if (opts?.organizationId) {
      qb.andWhere('campaign.organizationId = :orgId', { orgId: opts.organizationId });
    }

    const page = Math.max(1, parseInt(opts?.page as any) || 1);
    const limit = Math.min(100, parseInt(opts?.limit as any) || 20);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  findOne(id: string) {
    return this.campaignRepository.findOne({ where: { id }, relations: ['organization', 'opportunities'] });
  }

  create(body: Partial<Campaign>) {
    const campaign = this.campaignRepository.create(body as Campaign);
    return this.campaignRepository.save(campaign);
  }

  async update(id: string, body: Partial<Campaign>) {
    const existing = await this.campaignRepository.findOneBy({ id });
    if (!existing) return null;
    const merged = this.campaignRepository.merge(existing, body as Campaign);
    return this.campaignRepository.save(merged);
  }

  async remove(id: string) {
    const res = await this.campaignRepository.delete(id);
    return { affected: res.affected };
  }
}
