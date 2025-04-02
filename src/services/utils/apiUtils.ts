
// Check if we're running in the browser
export const isBrowser = typeof window !== 'undefined';

// Generate a random ID for API operations
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Default semesters to use if needed
export const DEFAULT_SEMESTERS = [
  { name: 'Semester 1', order: 1 },
  { name: 'Semester 2', order: 2 },
  { name: 'Semester 3', order: 3 },
  { name: 'Semester 4', order: 4 },
  { name: 'Semester 5', order: 5 },
  { name: 'Semester 6', order: 6 },
  { name: 'Semester 7', order: 7 },
  { name: 'Semester 8', order: 8 }
];
