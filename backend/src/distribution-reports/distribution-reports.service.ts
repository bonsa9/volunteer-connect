import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributionReport } from './distribution-report.entity';

@Injectable()
export class DistributionReportsService {
  constructor(
    @InjectRepository(DistributionReport)
    private readonly reportRepository: Repository<DistributionReport>,
  ) {}

  async findAll(opts?: { page?: string; limit?: string; campaignId?: string }) {
    const qb = this.reportRepository
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.campaign', 'campaign');

    if (opts?.campaignId) {
      qb.andWhere('report.campaignId = :campaignId', { campaignId: opts.campaignId });
    }

    const page = Math.max(1, parseInt(opts?.page as any) || 1);
    const limit = Math.min(100, parseInt(opts?.limit as any) || 20);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  findOne(id: string) {
    return this.reportRepository.findOne({ where: { id }, relations: ['campaign'] });
  }

  create(body: Partial<DistributionReport>) {
    const report = this.reportRepository.create(body as DistributionReport);
    return this.reportRepository.save(report);
  }

  async update(id: string, body: Partial<DistributionReport>) {
    const existing = await this.reportRepository.findOneBy({ id });
    if (!existing) return null;
    const merged = this.reportRepository.merge(existing, body as DistributionReport);
    return this.reportRepository.save(merged);
  }

  async remove(id: string) {
    const res = await this.reportRepository.delete(id);
    return { affected: res.affected };
  }
}
