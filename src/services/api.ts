
// Re-export all services for easy access
export { SemesterAPI } from './semesterAPI';
export { SubjectAPI } from './subjectAPI';
export { PDFAPI } from './pdfAPI';
export { NotesAPI } from './notesAPI';

// Default export for backward compatibility
export default {
  SemesterAPI,
  SubjectAPI,
  PDFAPI,
  NotesAPI,
};
