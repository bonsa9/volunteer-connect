import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Opportunity } from '../opportunities/opportunity.entity';
import { Volunteer } from '../volunteers/volunteer.entity';

@Entity()
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Volunteer, volunteer => volunteer.contributions)
  volunteer: Volunteer;

  @ManyToOne(() => Opportunity)
  opportunity: Opportunity;

  @Column({ type: 'int' })
  hours: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  recordedAt: Date;
}
