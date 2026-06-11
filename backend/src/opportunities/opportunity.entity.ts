import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Campaign } from '../campaigns/campaign.entity';
import { Signup } from '../signups/signup.entity';

@Entity()
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'simple-array', nullable: true })
  skills?: string[];

  @Column({ type: 'datetime', nullable: true })
  startsAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  endsAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Campaign, campaign => campaign.opportunities)
  campaign: Campaign;

  @OneToMany(() => Signup, signup => signup.opportunity)
  signups: Signup[];
}
