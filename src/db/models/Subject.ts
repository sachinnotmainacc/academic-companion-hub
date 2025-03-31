
import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  semesterId: {
    type: String,
    required: true,
    ref: 'Semester'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// We want to ensure that name+semesterId combination is unique
SubjectSchema.index({ name: 1, semesterId: 1 }, { unique: true });

// Check if we're in a browser environment (where mongoose.models might be undefined)
const isBrowser = typeof window !== 'undefined';

// Safely check if models is available before accessing it
let Subject;

if (isBrowser) {
  // Browser environment - create a safe fallback
  Subject = null;
} else {
  // Server environment - create/retrieve the model
  Subject = mongoose.models?.Subject || mongoose.model('Subject', SubjectSchema);
}

export default Subject;
