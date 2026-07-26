import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.error('FATAL ERROR: MONGO_URI or MONGODB_URI environment variable is missing.');
    throw new Error('Database connection failed: Missing connection string.');
  }

  try {
    await mongoose.connect(uri, { 
      serverSelectionTimeoutMS: 5000, // Fail gracefully after 5s if DB is unreachable
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('FATAL ERROR: Failed to connect to MongoDB.', error);
    throw new Error('Database connection failed.');
  }
};

export default connectToDatabase;
