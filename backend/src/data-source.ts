import { DataSource } from 'typeorm';
import { Volunteer } from './volunteers/volunteer.entity';
import { Organization } from './organizations/organization.entity';
import { Campaign } from './campaigns/campaign.entity';
import { Opportunity } from './opportunities/opportunity.entity';
import { Signup } from './signups/signup.entity';
import { Contribution } from './contributions/contribution.entity';
import { DistributionReport } from './distribution-reports/distribution-report.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  entities: [
    Volunteer,
    Organization,
    Campaign,
    Opportunity,
    Signup,
    Contribution,
    DistributionReport,
  ],
});
