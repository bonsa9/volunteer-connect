import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { Campaign } from './campaigns/campaign.entity';
import { Opportunity } from './opportunities/opportunity.entity';
import { Organization } from './organizations/organization.entity';
import { Volunteer } from './volunteers/volunteer.entity';

async function seedData(dataSource: DataSource) {
  const volunteerRepo = dataSource.getRepository(Volunteer);
  const organizationRepo = dataSource.getRepository(Organization);
  const campaignRepo = dataSource.getRepository(Campaign);
  const opportunityRepo = dataSource.getRepository(Opportunity);

  const volunteerCount = await volunteerRepo.count();
  if (volunteerCount === 0) {
    await volunteerRepo.save([
      {
        name: 'Merit Alem',
        email: 'merit@example.com',
        phone: '+251911123456',
        skills: ['Community Outreach', 'Translation'],
        points: 1240,
        level: 7,
      },
      {
        name: 'Samuel Tesfaye',
        email: 'samuel@example.com',
        phone: '+251911654321',
        skills: ['Logistics', 'First Aid'],
        points: 980,
        level: 5,
      },
      {
        name: 'Ruth Bekele',
        email: 'ruth@example.com',
        phone: '+251922112233',
        skills: ['Teaching', 'Health Education'],
        points: 1120,
        level: 6,
      },
    ]);
  }

  const organizationCount = await organizationRepo.count();
  if (organizationCount === 0) {
    const org = await organizationRepo.save({
      name: 'Ethiopia Care Network',
      website: 'https://ethiopiacare.org',
      description: 'Local NGO coordinating volunteer projects across regions.',
    });

    const campaign = await campaignRepo.save({
      title: 'Addis Community Cleanup',
      description: 'Join neighborhood teams to remove waste and restore public spaces.',
      location: { latitude: 9.0355, longitude: 38.7613, placeName: 'Addis Ababa' },
      startDate: '2026-06-22',
      endDate: '2026-06-28',
      organization: org,
    });

    await opportunityRepo.save([
      {
        title: 'Riverbank Cleanup Team',
        description: 'Collect litter and sort recyclables along the river.',
        skills: ['Cleanup', 'Teamwork'],
        startsAt: new Date('2026-06-22T09:00:00'),
        endsAt: new Date('2026-06-22T15:00:00'),
        isActive: true,
        campaign,
      },
      {
        title: 'Youth Outreach Organizer',
        description: 'Coordinate volunteer shifts and community notification.',
        skills: ['Organization', 'Communication'],
        startsAt: new Date('2026-06-23T10:00:00'),
        endsAt: new Date('2026-06-23T17:00:00'),
        isActive: true,
        campaign,
      },
    ]);
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  const staticDist = join(__dirname, '..', '..', 'frontend', 'dist');
  app.useStaticAssets(staticDist, { index: false });

  if (process.env.NODE_ENV !== 'production') {
    app.use((req: any, res: any, next: any) => {
      if (req.path === '/') {
        return res.redirect('http://localhost:5175/');
      }
      return next();
    });
  }

  app.use((req: any, res: any, next: any) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(join(staticDist, 'index.html'));
  });

  const dataSource = app.get(DataSource);
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  await seedData(dataSource);

  await app.listen(3000);
}
bootstrap();
