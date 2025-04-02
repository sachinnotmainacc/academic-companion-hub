
import { isBrowser } from '../../services/utils/apiUtils';

// Only import mongoose on the server
let mongoose: any;
let PDFSchema: any;
let PDF: any;

// Only execute this code on the server
if (!isBrowser) {
  // Dynamic import to prevent browser issues
  import('mongoose').then((module) => {
    mongoose = module.default;
    
    PDFSchema = new mongoose.Schema({
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
      description: {
        type: String,
        trim: true,
        default: ''
      },
      keywords: {
        type: [String],
        default: []
      },
      size: {
        type: String,
        default: 'Unknown'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    });

    // Safely check if models is available before accessing it
    PDF = mongoose.models ? 
      (mongoose.models.PDF || mongoose.model('PDF', PDFSchema)) : 
      (mongoose.model ? mongoose.model('PDF', PDFSchema) : null);
  }).catch(err => {
    console.error('Error importing mongoose:', err);
  });
}

// Create a browser-compatible dummy model
const BrowserPDF = {
  find: () => ({ sort: () => Promise.resolve([]) }),
  findById: () => Promise.resolve(null),
  findByIdAndUpdate: () => Promise.resolve(null),
  findByIdAndDelete: () => Promise.resolve(null)
};

// Export either the real model or the browser-compatible dummy
export default isBrowser ? BrowserPDF : PDF;
