import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Campaign } from '../campaigns/campaign.entity';

@Entity()
export class DistributionReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Campaign)
  campaign: Campaign;

  @Column({ type: 'simple-json', nullable: true })
  distributionData?: Record<string, unknown>;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  generatedAt: Date;
}
