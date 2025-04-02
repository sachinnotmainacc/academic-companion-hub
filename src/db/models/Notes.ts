
import mongoose from 'mongoose';

// Material schema
const MaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  path: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'pdf'
  },
  size: {
    type: String
  },
  uploadDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  downloadUrl: {
    type: String
  },
  keywords: {
    type: [String],
    default: []
  }
});

// Subject schema
const SubjectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  materials: {
    type: [MaterialSchema],
    default: []
  }
});

// Branch schema
const BranchSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  subjects: {
    type: [SubjectSchema],
    default: []
  },
  directoryUrl: {
    type: String
  },
  canBrowse: {
    type: Boolean,
    default: false
  }
});

// Semester schema
const SemesterSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  branches: {
    type: [BranchSchema],
    default: []
  }
});

// Notes schema
const NotesSchema = new mongoose.Schema({
  semesters: {
    type: [SemesterSchema],
    default: []
  },
  searchIndex: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      subjects: {}
    }
  }
});

// Safely check if models is available before accessing it
const Notes = mongoose.models ? 
  (mongoose.models.Notes || mongoose.model('Notes', NotesSchema)) : 
  (mongoose.model ? mongoose.model('Notes', NotesSchema) : null);

export default Notes;
