
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

// Safely check if models is available before accessing it
const Subject = mongoose.models ? 
  (mongoose.models.Subject || mongoose.model('Subject', SubjectSchema)) : 
  (mongoose.model ? mongoose.model('Subject', SubjectSchema) : null);

export default Subject;
