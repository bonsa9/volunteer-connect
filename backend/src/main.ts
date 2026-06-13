import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { Campaign } from './campaigns/campaign.entity';
import { Opportunity } from './opportunities/opportunity.entity';
import { Organization } from './organizations/organization.entity';
import { Volunteer } from './volunteers/volunteer.entity';
import { User, Role } from './users/user.entity';
import * as bcrypt from 'bcrypt';

async function seedData(dataSource: DataSource) {
  const volunteerRepo = dataSource.getRepository(Volunteer);
  const organizationRepo = dataSource.getRepository(Organization);
  const campaignRepo = dataSource.getRepository(Campaign);
  const opportunityRepo = dataSource.getRepository(Opportunity);
  const userRepo = dataSource.getRepository(User);

  // 1. Seed Admin User
  const adminExists = await userRepo.findOne({ where: { email: 'admin@example.com' } });
  if (!adminExists) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash('password123', salt);
    await userRepo.save({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: Role.ADMIN,
    });
  }

  // 2. Seed Volunteer Users
  const volunteersToSeed = [
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
  ];

  for (const vData of volunteersToSeed) {
    let user = await userRepo.findOne({ where: { email: vData.email } });
    if (!user) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash('password123', salt);
      user = await userRepo.save({
        name: vData.name,
        email: vData.email,
        passwordHash,
        role: Role.VOLUNTEER,
      });
    }

    let volunteer = await volunteerRepo.findOne({ where: { email: vData.email } });
    if (!volunteer) {
      await volunteerRepo.save({
        id: user.id,
        name: vData.name,
        email: vData.email,
        phone: vData.phone,
        skills: vData.skills,
        points: vData.points,
        level: vData.level,
      });
    } else if (volunteer.id !== user.id) {
      // Align ID: delete and recreate with correct ID
      await volunteerRepo.remove(volunteer);
      await volunteerRepo.save({
        id: user.id,
        name: vData.name,
        email: vData.email,
        phone: vData.phone,
        skills: vData.skills,
        points: vData.points,
        level: vData.level,
      });
    }
  }

  const organizationCount = await organizationRepo.count();
  if (organizationCount === 0) {
    const salt = await bcrypt.genSalt();
    const orgUser = await userRepo.save({
      name: 'Ethiopia Care Network',
      email: 'contact@ethiopiacare.org',
      passwordHash: await bcrypt.hash('password123', salt),
      role: Role.ORGANIZATION,
    });

    const org = await organizationRepo.save({
      id: orgUser.id,
      name: 'Ethiopia Care Network',
      email: 'contact@ethiopiacare.org',
      website: 'https://ethiopiacare.org',
      description: 'Local NGO coordinating volunteer projects across regions.',
      status: 'verified',
      type: 'non-profit',
      region: 'Addis Ababa',
      phone: '+251911000000',
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

  const config = new DocumentBuilder()
    .setTitle('Volunteer Connect API')
    .setDescription('The Volunteer Connect backend API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

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
    if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.method !== 'GET') {
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
