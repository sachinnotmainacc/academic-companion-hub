
import mongoose from 'mongoose';

const PDFSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  semesterId: {
    type: String,
    required: true,
    ref: 'Semester'
  },
  subjectId: {
    type: String,
    required: true,
    ref: 'Subject'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if model already exists to prevent overwriting during hot reloads
const PDF = mongoose.models.PDF || mongoose.model('PDF', PDFSchema);

export default PDF;
