import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Signup } from './signup.entity';
import { Volunteer } from '../volunteers/volunteer.entity';

@Injectable()
export class SignupsService {
  constructor(
    @InjectRepository(Signup)
    private readonly signupRepository: Repository<Signup>,
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
  ) {}

  async findAll(opts?: { page?: string; limit?: string; volunteerId?: string; opportunityId?: string; confirmed?: string }) {
    const qb = this.signupRepository
      .createQueryBuilder('signup')
      .leftJoinAndSelect('signup.volunteer', 'volunteer')
      .leftJoinAndSelect('signup.opportunity', 'opportunity')
      .leftJoinAndSelect('opportunity.campaign', 'campaign');

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

  async create(body: any) {
    const volunteerId = body.volunteerId;
    const opportunityId = body.opportunityId;

    if (!volunteerId || !opportunityId) {
      throw new BadRequestException('volunteerId and opportunityId are required');
    }

    // Check for duplicate signup
    const existing = await this.signupRepository.findOne({
      where: {
        volunteer: { id: volunteerId },
        opportunity: { id: opportunityId },
      },
    });

    if (existing) {
      throw new BadRequestException('You have already signed up for this opportunity');
    }

    const signup = this.signupRepository.create({
      volunteer: { id: volunteerId },
      opportunity: { id: opportunityId },
      confirmed: body.confirmed ?? false,
    });

    return this.signupRepository.save(signup);
  }

  async update(id: string, body: any) {
    const existing = await this.signupRepository.findOneBy({ id });
    if (!existing) return null;

    const updateData: any = {};
    if (body.confirmed !== undefined) {
      updateData.confirmed = body.confirmed;
    }
    if (body.volunteerId) {
      updateData.volunteer = { id: body.volunteerId };
    }
    if (body.opportunityId) {
      updateData.opportunity = { id: body.opportunityId };
    }

    const merged = this.signupRepository.merge(existing, updateData);
    return this.signupRepository.save(merged);
  }

  async remove(id: string) {
    const res = await this.signupRepository.delete(id);
    return { affected: res.affected };
  }

  async markAttendance(id: string, attended: boolean, hoursLogged: number) {
    const signup = await this.signupRepository.findOne({
      where: { id },
      relations: ['volunteer'],
    });

    if (!signup) throw new BadRequestException('Signup not found');
    if (signup.attended) throw new BadRequestException('Attendance already marked');

    signup.attended = attended;
    if (attended) {
      signup.hoursLogged = hoursLogged;
      const volunteer = signup.volunteer;
      if (volunteer) {
        // XP System: 10 points per hour + 50 points per attended shift
        const pointsEarned = (hoursLogged * 10) + 50;
        volunteer.points += pointsEarned;
        volunteer.totalHours = Number(volunteer.totalHours) + Number(hoursLogged);
        
        // Level up system: Every 500 points = 1 level
        volunteer.level = Math.floor(volunteer.points / 500) + 1;
        
        await this.volunteerRepository.save(volunteer);
      }
    }

    return this.signupRepository.save(signup);
  }

  async getCertificateData(id: string) {
    const signup = await this.signupRepository.findOne({
      where: { id },
      relations: ['volunteer', 'opportunity', 'opportunity.campaign', 'opportunity.campaign.organization'],
    });

    if (!signup) throw new BadRequestException('Signup not found');
    if (!signup.attended) throw new BadRequestException('Volunteer must have attended to receive a certificate');

    return {
      volunteerName: signup.volunteer.name,
      opportunityTitle: signup.opportunity.title,
      campaignTitle: signup.opportunity.campaign.title,
      organizationName: signup.opportunity.campaign.organization.name,
      hoursLogged: signup.hoursLogged,
      date: signup.opportunity.startsAt,
      certificateId: `VC-CERT-${signup.id.substring(0, 8).toUpperCase()}`,
      issuedAt: new Date(),
    };
  }
}
