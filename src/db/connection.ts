
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // For demo purposes - using a free MongoDB Atlas cluster
    // In production, this would be an environment variable
    const MONGO_URI = 'mongodb+srv://demo:demo1234@studycluster.mongodb.net/studyportal?retryWrites=true&w=majority';
    
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
};

export default connectDB;
