
import mongoose from 'mongoose';

const SemesterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if model already exists to prevent overwriting during hot reloads
const Semester = mongoose.models.Semester || mongoose.model('Semester', SemesterSchema);

export default Semester;
