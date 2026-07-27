import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import * as path from 'path';
import connectToDatabase from '../src/lib/db/mongoose';
import { UserModel } from '../src/modules/iam/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const seedSuperAdmin = async () => {
  console.log('Connecting to database...');
  await connectToDatabase();
  console.log('Connected to MongoDB.');

  const email = 'daftlabs.reply@gmail.com';
  const password = 'daftlabs';
  const name = 'daftlabs';

  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await UserModel.findOne({ email });

  if (existing) {
    existing.name = name;
    existing.hashedPassword = hashedPassword;
    existing.systemRole = 'SUPER_ADMIN';
    existing.onboardingCompleted = true;
    existing.emailVerified = true;
    existing.authProvider = 'LOCAL';
    await existing.save();
    console.log(`Updated existing Super Admin: ${email}`);
  } else {
    await UserModel.create({
      email,
      name,
      hashedPassword,
      systemRole: 'SUPER_ADMIN',
      onboardingCompleted: true,
      emailVerified: true,
      authProvider: 'LOCAL'
    });
    console.log(`Created new Super Admin: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

seedSuperAdmin().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
