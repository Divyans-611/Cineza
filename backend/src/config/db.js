import mongoose from 'mongoose';
import config from './index.js';

export const connectDB = async () => {
  try {
    if (!config.mongoUri) {
      throw new Error('MONGO_URI is missing in environment variables');
    }
    
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};
