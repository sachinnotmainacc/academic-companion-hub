
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Semester, Subject } from './types/dataTypes';

// Create a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Default semesters to use if needed
export const DEFAULT_SEMESTERS: Semester[] = [
  { id: generateId(), name: 'Semester 1', order: 1 },
  { id: generateId(), name: 'Semester 2', order: 2 },
  { id: generateId(), name: 'Semester 3', order: 3 },
  { id: generateId(), name: 'Semester 4', order: 4 },
  { id: generateId(), name: 'Semester 5', order: 5 },
  { id: generateId(), name: 'Semester 6', order: 6 },
  { id: generateId(), name: 'Semester 7', order: 7 },
  { id: generateId(), name: 'Semester 8', order: 8 }
];

export const useDataStore = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Save to localStorage as a backup
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('semesters', JSON.stringify(semesters));
    }
  }, [semesters, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('subjects', JSON.stringify(subjects));
    }
  }, [subjects, loading]);

  // Get subjects by semester
  const getSubjectsBySemester = (semesterId: string) => {
    return subjects.filter(subject => subject.semesterId === semesterId);
  };

  return {
    semesters,
    setSemesters,
    subjects,
    setSubjects,
    loading,
    setLoading,
    error,
    setError,
    getSubjectsBySemester
  };
};
