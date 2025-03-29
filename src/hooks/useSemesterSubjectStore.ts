
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Type definitions
interface Semester {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  semesterId: string;
}

// Create a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useSemesterSubjectStore = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedSemesters = localStorage.getItem('semesters');
    const storedSubjects = localStorage.getItem('subjects');

    if (storedSemesters) {
      setSemesters(JSON.parse(storedSemesters));
    } else {
      // Add default semesters if none exist
      const defaultSemesters: Semester[] = [
        { id: generateId(), name: 'Semester 1' },
        { id: generateId(), name: 'Semester 2' },
        { id: generateId(), name: 'Semester 3' },
        { id: generateId(), name: 'Semester 4' },
      ];
      setSemesters(defaultSemesters);
      localStorage.setItem('semesters', JSON.stringify(defaultSemesters));
    }

    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('semesters', JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Add a new semester
  const addSemester = (name: string) => {
    const newSemester: Semester = {
      id: generateId(),
      name,
    };
    setSemesters([...semesters, newSemester]);
  };

  // Add a new subject
  const addSubject = (name: string, semesterId: string) => {
    const newSubject: Subject = {
      id: generateId(),
      name,
      semesterId,
    };
    setSubjects([...subjects, newSubject]);
  };

  // Update a semester
  const updateSemester = (id: string, name: string) => {
    setSemesters(
      semesters.map((semester) =>
        semester.id === id ? { ...semester, name } : semester
      )
    );
  };

  // Update a subject
  const updateSubject = (id: string, data: Partial<Subject>) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id ? { ...subject, ...data } : subject
      )
    );
  };

  // Delete a semester
  const deleteSemester = (id: string) => {
    // Check if subjects are using this semester
    const hasSubjects = subjects.some(subject => subject.semesterId === id);
    if (hasSubjects) {
      toast.error('Cannot delete semester with associated subjects');
      return false;
    }

    setSemesters(semesters.filter((semester) => semester.id !== id));
    return true;
  };

  // Delete a subject
  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
    return true;
  };

  return {
    semesters,
    subjects,
    addSemester,
    addSubject,
    updateSemester,
    updateSubject,
    deleteSemester,
    deleteSubject,
  };
};
