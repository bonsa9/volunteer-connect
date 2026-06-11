import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Campaign } from '../campaigns/campaign.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Campaign, campaign => campaign.organization)
  campaigns: Campaign[];
}
