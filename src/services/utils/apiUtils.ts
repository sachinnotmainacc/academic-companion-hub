
import mongoose from 'mongoose';
import connectDB from '@/db/connection';

// Check if we're in a browser environment
export const isBrowser = typeof window !== 'undefined';

// Connect to MongoDB on service initialization (only in server environment)
if (!isBrowser) {
  connectDB();
}

// Generate MongoDB-compatible ID
export const generateId = () => Math.random().toString(36).substring(2, 9);

// Default semesters to create if none exist
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
