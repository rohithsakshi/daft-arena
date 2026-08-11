import * as dotenv from 'dotenv';
dotenv.config({ path: 'apps/web/.env.local' });
import mongoose from 'mongoose';

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/daft-arena-dev';
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db!;
    const collection = db.collection('users');
    const result = await collection.deleteOne({ email: 'rayaan3535@gmail.com' });
    console.log(`Deleted ${result.deletedCount} user(s).`);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}
run();
