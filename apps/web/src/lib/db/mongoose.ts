import mongoose from 'mongoose';
import { ensureInitialSeed } from './autoSeed';
import path from 'path';
import fs from 'fs';

// Use globalThis to persist the server instance across Next.js hot reloads
// so only ONE MongoMemoryServer is ever started per process lifetime.
const g = globalThis as any;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/daft-arena-dev';

  // 1. Try connecting to a real MongoDB first (local or atlas)
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log('MongoDB connected successfully at', uri);
    await ensureInitialSeed();
    return;
  } catch (_) {
    // Falls through to embedded server fallback
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Database connection failed: Unable to connect to MongoDB at ${uri}.`);
  }

  // 2. Fallback: use a persistent embedded server in dev
  try {
    // If a previous hot-reload already started the server, reuse its URI
    if (g.__mongo_dev_uri) {
      if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
      await mongoose.connect(g.__mongo_dev_uri);
      console.log('🔁 Reusing Persistent Local MongoDB at', g.__mongo_dev_uri);
      await ensureInitialSeed();
      return;
    }

    console.log('⚠️ Local MongoDB not detected. Starting Persistent Local MongoDB for dev...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');

    const dbPath = path.join(process.cwd(), '.mongo-local-data');
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }

    const mongoServer = await MongoMemoryServer.create({
      instance: {
        port: 27018,
        dbPath,
        storageEngine: 'wiredTiger',
      },
    });

    const memUri = mongoServer.getUri();
    g.__mongo_dev_server = mongoServer;
    g.__mongo_dev_uri = memUri;

    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    await mongoose.connect(memUri);
    console.log('🚀 Connected to Persistent Local MongoDB at', memUri);
    await ensureInitialSeed();
    return;
  } catch (memError: any) {
    console.warn('Failed to start Persistent Local MongoDB:', memError?.message || memError);
    throw new Error('Database connection failed: Could not start embedded MongoDB.');
  }
};

export default connectToDatabase;
