import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import connectToDatabase from '../src/lib/db/mongoose';
import { UserModel } from '../src/modules/iam/models/User';
import mongoose from 'mongoose';

const verify = async () => {
  console.log('Connecting to database...');
  await connectToDatabase();
  
  const superAdmins = await UserModel.find({ email: 'daftlabs.reply@gmail.com' });
  console.log(`Found ${superAdmins.length} super admin(s)`);
  
  if (superAdmins.length === 1) {
    console.log(`Role: ${superAdmins[0].systemRole}`);
    if (superAdmins[0].systemRole === 'SUPERADMIN') {
      console.log('SUCCESS: Exactly one user exists with SUPERADMIN role.');
    } else {
      console.log('ERROR: Role is not SUPERADMIN.');
    }
  } else {
    console.log('ERROR: Expected exactly 1 super admin.');
  }

  await mongoose.disconnect();
  process.exit(0);
};

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
