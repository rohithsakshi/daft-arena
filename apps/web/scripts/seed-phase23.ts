import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../src/lib/mongodb';
import { UserModel } from '../src/modules/iam/models/User';
import { OrganizationModel } from '../src/modules/iam/models/Organization';
import { OrganizationMembershipModel } from '../src/modules/iam/models/OrganizationMembership';
import { TournamentModel } from '../src/modules/tournaments/models/Tournament';
import { VenueModel } from '../src/modules/tournaments/models/Venue';
import { TournamentEventModel } from '../src/modules/tournaments/models/Event';
import { TournamentStatus, EventType, Gender, AgeCategory, DrawType, QualificationType, SeedType } from '../src/modules/core/enums';

async function seedPhase23() {
  console.log('Connecting to DB...');
  await connectDB();
  console.log('Connected.');

  console.log('--- Seeding Users ---');
  
  // 1. Tournament Admin
  const adminEmail = 'rayaan3535@gmail.com';
  let adminUser = await UserModel.findOne({ email: adminEmail });
  if (!adminUser) {
    adminUser = await UserModel.create({
      email: adminEmail,
      name: 'Rayaan Admin',
      hashedPassword: await bcrypt.hash('kalai', 10),
      systemRole: 'TOURNAMENT_ADMIN',
      authProvider: 'LOCAL',
      emailVerified: true,
      onboardingCompleted: true
    });
    console.log('Created Tournament Admin:', adminEmail);
  } else {
    console.log('Tournament Admin already exists:', adminEmail);
  }

  // 2. Player
  const playerEmail = 'mojomojo2k@gmail.com';
  let playerUser = await UserModel.findOne({ email: playerEmail });
  if (!playerUser) {
    playerUser = await UserModel.create({
      email: playerEmail,
      name: 'Mojomojo Player',
      hashedPassword: await bcrypt.hash('rohith2002@', 10),
      systemRole: 'PLAYER',
      authProvider: 'LOCAL',
      emailVerified: true,
      onboardingCompleted: true,
      sports: ['Badminton']
    });
    console.log('Created Player:', playerEmail);
  } else {
    console.log('Player already exists:', playerEmail);
  }

  // 3. Sponsor
  const sponsorEmail = 'pakki3535@gmail.com';
  let sponsorUser = await UserModel.findOne({ email: sponsorEmail });
  if (!sponsorUser) {
    sponsorUser = await UserModel.create({
      email: sponsorEmail,
      name: 'Pakki Sponsor',
      hashedPassword: await bcrypt.hash('pakki3535', 10),
      systemRole: 'SPONSOR',
      authProvider: 'LOCAL',
      emailVerified: true,
      onboardingCompleted: true
    });
    console.log('Created Sponsor:', sponsorEmail);
  } else {
    console.log('Sponsor already exists:', sponsorEmail);
  }

  console.log('--- Seeding Organization ---');
  
  // 4. Pollachi Sports Club
  let org = await OrganizationModel.findOne({ name: 'Pollachi Sports Club' });
  if (!org) {
    org = await OrganizationModel.create({
      name: 'Pollachi Sports Club',
      description: 'Test Organization for DAFT Arena',
    });
    console.log('Created Organization:', org.name);
  } else {
    console.log('Organization already exists:', org.name);
  }

  // Make Admin owner of the club
  const existingMembership = await OrganizationMembershipModel.findOne({
    userId: adminUser._id as any,
    organizationId: org._id as any
  });
  if (!existingMembership) {
    await OrganizationMembershipModel.create({
      userId: adminUser._id as any,
      organizationId: org._id as any,
      roleId: (new mongoose.Types.ObjectId()) as any // Mock Role ID for now since we just need membership
    });
    console.log('Assigned Admin to Organization');
  }

  console.log('--- Seeding Tournament ---');
  
  const mockSportId = new mongoose.Types.ObjectId();
  const mockRulePackageId = new mongoose.Types.ObjectId();

  // Create Venue
  let venue = await VenueModel.findOne({ name: 'Pollachi Stadium' });
  if (!venue) {
    venue = await VenueModel.create({
      name: 'Pollachi Stadium',
      address: {
        street: 'Main Road',
        city: 'Pollachi',
        state: 'Tamil Nadu',
        country: 'India',
        zipCode: '642001'
      },
      timezone: 'Asia/Kolkata'
    });
    console.log('Created Venue:', venue.name);
  }

  // 5. Badminton Pollachi Test Match
  const tName = 'Badminton Pollachi Test Match';
  let tournament = await TournamentModel.findOne({ name: tName });
  
  if (!tournament) {
    tournament = await TournamentModel.create({
      name: tName,
      slug: 'badminton-pollachi-test-match',
      description: 'Official test match for DAFT Arena Phase 23',
      organizationId: org._id as any,
      organizerName: adminUser.name,
      sportId: mockSportId,
      rulePackageId: mockRulePackageId,
      venueIds: [venue._id as any],
      visibility: 'Public',
      status: TournamentStatus.RegistrationOpen,
      registrationWindow: {
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000) // +10 days
      },
      tournamentDates: {
        startDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000), // +15 days
        endDate: new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000) // +20 days
      },
      timezone: 'Asia/Kolkata',
      currency: 'INR'
    });
    console.log('Created Tournament:', tournament.name);
  } else {
    tournament.status = TournamentStatus.RegistrationOpen;
    await tournament.save();
    console.log('Tournament already exists, updated status to Open');
  }

  // Create Categories (Events)
  const categories = [
    { name: 'Men Singles', eventType: EventType.Singles, gender: Gender.Male },
    { name: 'Women Singles', eventType: EventType.Singles, gender: Gender.Female },
    { name: 'Men Doubles', eventType: EventType.Doubles, gender: Gender.Male },
    { name: 'Women Doubles', eventType: EventType.Doubles, gender: Gender.Female },
    { name: 'Mixed Doubles', eventType: EventType.MixedDoubles, gender: Gender.Mixed }
  ];

  const ageCategories = [
    { name: 'Open', ageCategory: AgeCategory.Senior },
    { name: 'Under 15', ageCategory: AgeCategory.U15 },
    { name: 'Under 19', ageCategory: AgeCategory.U19 },
    { name: 'Veterans', ageCategory: AgeCategory.Veteran40 }
  ];

  for (const cat of categories) {
    for (const age of ageCategories) {
      const eventName = `${age.name} - ${cat.name}`;
      const existingEvent = await TournamentEventModel.findOne({ tournamentId: tournament._id as any, name: eventName });
      
      if (!existingEvent) {
        await TournamentEventModel.create({
          tournamentId: tournament._id as any,
          sportId: mockSportId,
          rulePackageId: mockRulePackageId,
          name: eventName,
          eventType: cat.eventType,
          gender: cat.gender,
          ageCategory: age.ageCategory,
          minEntries: 0,
          maxEntries: 32,
          drawType: DrawType.Knockout,
          qualificationType: QualificationType.Direct,
          seedType: SeedType.Random
        });
        console.log('Created Event:', eventName);
      }
    }
  }

  console.log('--- Phase 23 Seeding Complete ---');
  process.exit(0);
}

seedPhase23().catch(console.error);
