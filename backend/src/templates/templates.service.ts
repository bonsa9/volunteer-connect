import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './template.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  findAll() {
    return this.templateRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const template = await this.templateRepository.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async create(data: Partial<Template>) {
    // For MVP, we mock extracting variables
    const newTemplate = this.templateRepository.create({
      ...data,
      totalVariables: Math.floor(Math.random() * 20),
      requiredVariables: Math.floor(Math.random() * 10),
    });
    return this.templateRepository.save(newTemplate);
  }

  async remove(id: string) {
    const res = await this.templateRepository.delete(id);
    return { affected: res.affected };
  }
}
