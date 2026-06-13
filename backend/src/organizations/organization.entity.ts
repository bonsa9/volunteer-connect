import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Campaign } from '../campaigns/campaign.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  contactPerson?: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  region?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ default: 'pending' })
  status: string; // 'pending' | 'verified' | 'rejected' | 'suspended'

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Campaign, campaign => campaign.organization)
  campaigns: Campaign[];
}
