import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { Opportunity } from '../opportunities/opportunity.entity';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'simple-json', nullable: true })
  location?: { latitude: number; longitude: number; placeName?: string };

  @Column({ type: 'date', nullable: true })
  startDate?: string;

  @Column({ type: 'date', nullable: true })
  endDate?: string;

  @ManyToOne(() => Organization, organization => organization.campaigns)
  organization: Organization;

  @OneToMany(() => Opportunity, opportunity => opportunity.campaign)
  opportunities: Opportunity[];
}
