import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Opportunity } from '../opportunities/opportunity.entity';
import { Volunteer } from '../volunteers/volunteer.entity';

@Entity()
export class Signup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Volunteer, volunteer => volunteer.signups)
  volunteer: Volunteer;

  @ManyToOne(() => Opportunity, opportunity => opportunity.signups)
  opportunity: Opportunity;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ default: false })
  attended: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  hoursLogged: number;
}
