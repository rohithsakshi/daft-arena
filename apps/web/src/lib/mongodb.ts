import mongoose from 'mongoose';
import { config } from './config';
import { logger } from './logger';

const MONGODB_URI = config.MONGODB_URI;

declare global {
  var mongooseConnection: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      logger.info('Connected to MongoDB');
      return mongoose;
    }).catch(error => {
      logger.error('Error connecting to MongoDB', error);
      throw error;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

process.on('SIGINT', async () => {
  if (cached.conn) {
    await cached.conn.connection.close();
    logger.info('MongoDB connection closed due to app termination');
    process.exit(0);
  }
});
