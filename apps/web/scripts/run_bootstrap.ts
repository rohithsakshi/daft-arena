import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { register } from '../src/instrumentation';
import mongoose from 'mongoose';

const run = async () => {
  // Simulate Next.js startup
  process.env.NEXT_RUNTIME = 'nodejs';
  await register();
  await mongoose.disconnect();
  console.log('Done.');
};

run().catch(console.error);
