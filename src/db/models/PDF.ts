
import mongoose from 'mongoose';

const PDFSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true
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

// Check if we're in a browser environment (where mongoose.models might be undefined)
const isBrowser = typeof window !== 'undefined';

// Safely check if models is available before accessing it
let PDF;

if (isBrowser) {
  // Browser environment - create a safe fallback
  PDF = null;
} else {
  // Server environment - create/retrieve the model
  PDF = mongoose.models?.PDF || mongoose.model('PDF', PDFSchema);
}

export default PDF;
