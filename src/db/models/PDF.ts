
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

// Safely check if models is available before accessing it
const PDF = mongoose.models ? 
  (mongoose.models.PDF || mongoose.model('PDF', PDFSchema)) : 
  (mongoose.model ? mongoose.model('PDF', PDFSchema) : null);

export default PDF;
