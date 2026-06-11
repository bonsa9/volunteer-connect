import { AppDataSource } from './data-source';
import { Volunteer } from './volunteers/volunteer.entity';
import { Organization } from './organizations/organization.entity';
import { Campaign } from './campaigns/campaign.entity';
import { Opportunity } from './opportunities/opportunity.entity';

async function seed() {
  await AppDataSource.initialize();

  const volunteerRepo = AppDataSource.getRepository(Volunteer);
  const organizationRepo = AppDataSource.getRepository(Organization);
  const campaignRepo = AppDataSource.getRepository(Campaign);
  const opportunityRepo = AppDataSource.getRepository(Opportunity);

  const existingVolunteers = await volunteerRepo.count();
  if (existingVolunteers === 0) {
    const volunteers = volunteerRepo.create([
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

    await volunteerRepo.save(volunteers);
  }

  const existingOrganizations = await organizationRepo.count();
  if (existingOrganizations === 0) {
    const org = organizationRepo.create({
      name: 'Ethiopia Care Network',
      website: 'https://ethiopiacare.org',
      description: 'Local NGO coordinating volunteer projects across regions.',
    });
    await organizationRepo.save(org);

    const campaign = campaignRepo.create({
      title: 'Addis Community Cleanup',
      description: 'Join neighborhood teams to remove waste and restore public spaces.',
      location: { latitude: 9.0355, longitude: 38.7613, placeName: 'Addis Ababa' },
      startDate: '2026-06-22',
      endDate: '2026-06-28',
      organization: org,
    });
    await campaignRepo.save(campaign);

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

  console.log('Seed complete.');
  await AppDataSource.destroy();
}

seed().catch(error => {
  console.error('Seed failed', error);
  process.exit(1);
});
