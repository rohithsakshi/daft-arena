import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import connectToDatabase from '../src/lib/db/mongoose';
import { UserModel } from '../src/modules/iam/models/User';
import mongoose from 'mongoose';

const check = async () => {
  try {
    await connectToDatabase();
    const admin = await UserModel.findOne({ systemRole: { $in: ['SUPERADMIN', 'ADMIN', 'SUPER_ADMIN'] } });
    if (admin) {
      console.log(JSON.stringify({
        exists: true,
        email: admin.email,
        systemRole: admin.systemRole,
        onboardingCompleted: admin.onboardingCompleted,
        emailVerified: admin.emailVerified
      }));
    } else {
      console.log(JSON.stringify({ exists: false }));
    }
  } catch (err: any) {
    console.log(JSON.stringify({ error: err.message }));
  }
  await mongoose.disconnect();
  process.exit(0);
};

check();
