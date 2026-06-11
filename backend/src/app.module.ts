import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from './volunteers/volunteer.entity';
import { Organization } from './organizations/organization.entity';
import { Campaign } from './campaigns/campaign.entity';
import { Opportunity } from './opportunities/opportunity.entity';
import { Signup } from './signups/signup.entity';
import { Contribution } from './contributions/contribution.entity';
import { DistributionReport } from './distribution-reports/distribution-report.entity';
import { VolunteersModule } from './volunteers/volunteers.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { SignupsModule } from './signups/signups.module';
import { ContributionsModule } from './contributions/contributions.module';
import { DistributionReportsModule } from './distribution-reports/distribution-reports.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [
        Volunteer,
        Organization,
        Campaign,
        Opportunity,
        Signup,
        Contribution,
        DistributionReport,
      ],
      synchronize: true,
    }),
    VolunteersModule,
    OrganizationsModule,
    CampaignsModule,
    OpportunitiesModule,
    SignupsModule,
    ContributionsModule,
    DistributionReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
