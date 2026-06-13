import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async findAll(opts?: { search?: string; page?: string; limit?: string }) {
    const qb = this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.campaigns', 'campaigns');

    if (opts?.search) {
      qb.where('organization.name LIKE :q OR organization.email LIKE :q', { q: `%${opts.search}%` });
    }

    const page = Math.max(1, parseInt(opts?.page as any) || 1);
    const limit = Math.min(100, parseInt(opts?.limit as any) || 20);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  findOne(id: string) {
    return this.organizationRepository.findOne({ where: { id }, relations: ['campaigns'] });
  }

  create(body: Partial<Organization>) {
    const org = this.organizationRepository.create(body as Organization);
    return this.organizationRepository.save(org);
  }

  async update(id: string, body: Partial<Organization>) {
    const existing = await this.organizationRepository.findOneBy({ id });
    if (!existing) return null;
    const merged = this.organizationRepository.merge(existing, body as Organization);
    return this.organizationRepository.save(merged);
  }

  async remove(id: string) {
    const res = await this.organizationRepository.delete(id);
    return { affected: res.affected };
  }
}
