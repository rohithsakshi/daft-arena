import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import * as path from 'path';
import connectToDatabase from '../src/lib/db/mongoose';
import { UserModel } from '../src/modules/iam/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const seed = async () => {
  console.log('Connecting to database...');
  await connectToDatabase();
  console.log('Connected.');
  
  const hashedPassword = await bcrypt.hash('rohith', 10);
  
  const users = [
    { name: 'Player', email: 'rohithganesan2002@gmail.com', systemRole: 'PLAYER' },
    { name: 'Tournament Organizer', email: 'rohithganesan2002+organizer@gmail.com', systemRole: 'ORGANIZER' },
    { name: 'Sponsor', email: 'rohithganesan2002+sponsor@gmail.com', systemRole: 'SPONSOR' },
    { name: 'Administrator', email: 'rohithganesan2002+admin@gmail.com', systemRole: 'ADMIN' },
    { name: 'Club Manager', email: 'rohithganesan2002+club@gmail.com', systemRole: 'CLUB' },
    { name: 'Federation', email: 'rohithganesan2002+federation@gmail.com', systemRole: 'FEDERATION' },
  ];

  for (const u of users) {
    const existing = await UserModel.findOne({ email: u.email });
    if (!existing) {
      await UserModel.create({
        ...u,
        hashedPassword,
        onboardingCompleted: true,
        emailVerified: true,
        authProvider: 'LOCAL'
      });
      console.log(`Created: ${u.email} - Role: ${u.systemRole}`);
    } else {
      console.log(`Skipped (already exists): ${u.email} - Role: ${u.systemRole}`);
    }
  }
  
  console.log('\n--- SEEDED ACCOUNTS ---');
  console.table(users.map(u => ({ Email: u.email, Role: u.systemRole })));
  
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
