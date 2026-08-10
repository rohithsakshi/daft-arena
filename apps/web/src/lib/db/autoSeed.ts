import bcrypt from 'bcryptjs';
import { UserModel } from '@/modules/iam/models/User';
import { OrganizationModel } from '@/modules/iam/models/Organization';
import { OrganizationMembershipModel } from '@/modules/iam/models/OrganizationMembership';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';
import { VenueModel } from '@/modules/tournaments/models/Venue';
import { TournamentEventModel } from '@/modules/tournaments/models/Event';
import { TournamentStatus, EventType, Gender, AgeCategory, DrawType, QualificationType, SeedType } from '@/modules/core/enums';
import mongoose from 'mongoose';

export async function ensureInitialSeed() {
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount > 0) {
      return; // Already seeded
    }

    console.log('🌱 Empty database detected. Auto-seeding initial users and tournaments...');

    // 1. Super Admin
    const superAdminPassword = await bcrypt.hash('daftlabs', 10);
    await UserModel.create({
      name: 'DAFT Labs Super Admin',
      email: 'daftlabs.reply@gmail.com',
      hashedPassword: superAdminPassword,
      systemRole: 'SUPERADMIN',
      onboardingCompleted: true,
      emailVerified: true,
      authProvider: 'LOCAL',
    });

    // 2. Main Admin, Player & Sponsor
    const adminUser = await UserModel.create({
      name: 'Rayaan Admin',
      email: 'rayaan3535@gmail.com',
      hashedPassword: await bcrypt.hash('kalai', 10),
      systemRole: 'TOURNAMENT_ADMIN',
      onboardingCompleted: true,
      emailVerified: true,
      authProvider: 'LOCAL',
    });

    await UserModel.create({
      name: 'Mojomojo Player',
      email: 'mojomojo2k@gmail.com',
      hashedPassword: await bcrypt.hash('rohith2002@', 10),
      systemRole: 'PLAYER',
      onboardingCompleted: true,
      emailVerified: true,
      authProvider: 'LOCAL',
      sports: ['Badminton'],
    });

    await UserModel.create({
      name: 'Pakki Sponsor',
      email: 'pakki3535@gmail.com',
      hashedPassword: await bcrypt.hash('pakki3535', 10),
      systemRole: 'SPONSOR',
      onboardingCompleted: true,
      emailVerified: true,
      authProvider: 'LOCAL',
    });

    // 3. Additional standard accounts
    const rohithPassword = await bcrypt.hash('rohith', 10);
    const standardUsers = [
      { name: 'Player', email: 'rohithganesan2002@gmail.com', systemRole: 'PLAYER' },
      { name: 'Tournament Organizer', email: 'rohithganesan2002+organizer@gmail.com', systemRole: 'ORGANIZER' },
      { name: 'Sponsor', email: 'rohithganesan2002+sponsor@gmail.com', systemRole: 'SPONSOR' },
      { name: 'Administrator', email: 'rohithganesan2002+admin@gmail.com', systemRole: 'ADMIN' },
      { name: 'Club Manager', email: 'rohithganesan2002+club@gmail.com', systemRole: 'CLUB' },
      { name: 'Federation', email: 'rohithganesan2002+federation@gmail.com', systemRole: 'FEDERATION' },
    ];

    for (const u of standardUsers) {
      await UserModel.create({
        ...u,
        hashedPassword: rohithPassword,
        onboardingCompleted: true,
        emailVerified: true,
        authProvider: 'LOCAL',
      });
    }

    // 4. Seed Organization, Venue & Tournament
    const org = await OrganizationModel.create({
      name: 'Pollachi Sports Club',
      description: 'Test Organization for DAFT Arena',
    });

    await OrganizationMembershipModel.create({
      userId: adminUser._id as any,
      organizationId: org._id as any,
      roleId: new mongoose.Types.ObjectId() as any,
    });

    const venue = await VenueModel.create({
      name: 'Pollachi Stadium',
      address: {
        street: 'Main Road',
        city: 'Pollachi',
        state: 'Tamil Nadu',
        country: 'India',
        zipCode: '642001',
      },
      timezone: 'Asia/Kolkata',
    });

    const mockSportId = new mongoose.Types.ObjectId();
    const mockRulePackageId = new mongoose.Types.ObjectId();

    const tournament = await TournamentModel.create({
      name: 'Badminton Pollachi Test Match',
      slug: 'badminton-pollachi-test-match',
      description: 'Official test match for DAFT Arena',
      organizationId: org._id as any,
      organizerName: adminUser.name,
      sportId: mockSportId,
      rulePackageId: mockRulePackageId,
      venueIds: [venue._id as any],
      visibility: 'Public',
      status: TournamentStatus.RegistrationOpen,
      registrationWindow: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      tournamentDates: {
        startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
      timezone: 'Asia/Kolkata',
      currency: 'INR',
    });

    const categories = [
      { name: 'Men Singles', eventType: EventType.Singles, gender: Gender.Male },
      { name: 'Women Singles', eventType: EventType.Singles, gender: Gender.Female },
      { name: 'Men Doubles', eventType: EventType.Doubles, gender: Gender.Male },
      { name: 'Women Doubles', eventType: EventType.Doubles, gender: Gender.Female },
      { name: 'Mixed Doubles', eventType: EventType.MixedDoubles, gender: Gender.Mixed },
    ];

    const ageCategories = [
      { name: 'Open', ageCategory: AgeCategory.Senior },
      { name: 'Under 15', ageCategory: AgeCategory.U15 },
      { name: 'Under 19', ageCategory: AgeCategory.U19 },
      { name: 'Veterans', ageCategory: AgeCategory.Veteran40 },
    ];

    for (const cat of categories) {
      for (const age of ageCategories) {
        await TournamentEventModel.create({
          tournamentId: tournament._id as any,
          sportId: mockSportId,
          rulePackageId: mockRulePackageId,
          name: `${age.name} - ${cat.name}`,
          eventType: cat.eventType,
          gender: cat.gender,
          ageCategory: age.ageCategory,
          minEntries: 0,
          maxEntries: 32,
          drawType: DrawType.Knockout,
          qualificationType: QualificationType.Direct,
          seedType: SeedType.Random,
        });
      }
    }

    console.log('✅ Auto-seeding complete! All accounts (Super Admin, Admin, Player, Sponsor) are ready.');
  } catch (error) {
    console.error('⚠️ Auto-seeding failed:', error);
  }
}
