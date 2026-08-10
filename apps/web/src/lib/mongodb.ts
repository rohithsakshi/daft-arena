import mongoose from 'mongoose';
import { logger } from './logger';
import { connectToDatabase } from './db/mongoose';

export async function connectDB() {
  await connectToDatabase();
  return mongoose;
}

// Guard against duplicate SIGINT listeners on Next.js hot-reloads
const SIGINT_HANDLER_KEY = '__daft_arena_sigint_registered__';
if (!(globalThis as any)[SIGINT_HANDLER_KEY]) {
  (globalThis as any)[SIGINT_HANDLER_KEY] = true;
  process.setMaxListeners(20); // raise cap slightly to avoid spurious warnings
  process.on('SIGINT', async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    }
  });
}
