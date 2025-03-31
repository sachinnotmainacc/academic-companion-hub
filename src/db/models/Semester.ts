
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

// Check if we're in a browser environment (where mongoose.models might be undefined)
const isBrowser = typeof window !== 'undefined';

// Safely check if models is available before accessing it
let Semester;

if (isBrowser) {
  // Browser environment - create a safe fallback
  Semester = null;
} else {
  // Server environment - create/retrieve the model
  Semester = mongoose.models?.Semester || mongoose.model('Semester', SemesterSchema);
}

export default Semester;
