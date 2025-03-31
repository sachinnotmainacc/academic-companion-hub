
import mongoose from 'mongoose';

// Define the schema
const SemesterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Safely check if models is available before accessing it
// This prevents "Cannot read properties of undefined (reading 'Semester')" error
const Semester = mongoose.models ? 
  (mongoose.models.Semester || mongoose.model('Semester', SemesterSchema)) : 
  (mongoose.model ? mongoose.model('Semester', SemesterSchema) : null);

export default Semester;
