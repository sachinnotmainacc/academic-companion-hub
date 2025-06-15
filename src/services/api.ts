

// Import all services first
import { SemesterAPI } from './semesterAPI';
import { SubjectAPI } from './subjectAPI';
import { PDFAPI } from './pdfAPI';
import { NotesAPI } from './notesAPI';

// Re-export all services for easy access
export { SemesterAPI, SubjectAPI, PDFAPI, NotesAPI };

// Default export for backward compatibility
export default {
  SemesterAPI,
  SubjectAPI,
  PDFAPI,
  NotesAPI,
};

