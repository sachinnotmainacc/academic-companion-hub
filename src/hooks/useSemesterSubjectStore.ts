
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Type definitions
export interface Semester {
  id: string;
  name: string;
}

export interface Subject {
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
    const semesterExists = semesters.some(
      sem => sem.name.toLowerCase() === name.toLowerCase()
    );

    if (semesterExists) {
      toast.error("Semester already exists");
      return null;
    }

    const newSemester: Semester = {
      id: generateId(),
      name,
    };
    setSemesters([...semesters, newSemester]);
    toast.success("Semester added successfully");
    return newSemester;
  };

  // Add a new subject
  const addSubject = (name: string, semesterId: string) => {
    const subjectExists = subjects.some(
      sub => sub.name.toLowerCase() === name.toLowerCase() && sub.semesterId === semesterId
    );

    if (subjectExists) {
      toast.error("Subject already exists in this semester");
      return null;
    }

    const newSubject: Subject = {
      id: generateId(),
      name,
      semesterId,
    };
    setSubjects([...subjects, newSubject]);
    toast.success("Subject added successfully");
    return newSubject;
  };

  // Update a semester
  const updateSemester = (id: string, name: string) => {
    // Check if the updated name already exists in other semesters
    const semesterExists = semesters.some(
      sem => sem.name.toLowerCase() === name.toLowerCase() && sem.id !== id
    );

    if (semesterExists) {
      toast.error("Semester name already exists");
      return false;
    }

    setSemesters(
      semesters.map((semester) =>
        semester.id === id ? { ...semester, name } : semester
      )
    );
    toast.success("Semester updated successfully");
    return true;
  };

  // Update a subject
  const updateSubject = (id: string, data: Partial<Subject>) => {
    if (data.name && data.semesterId) {
      // Check if the updated name already exists in the same semester
      const subjectExists = subjects.some(
        sub => sub.name.toLowerCase() === data.name!.toLowerCase() && 
                sub.semesterId === data.semesterId && 
                sub.id !== id
      );

      if (subjectExists) {
        toast.error("Subject name already exists in this semester");
        return false;
      }
    }

    setSubjects(
      subjects.map((subject) =>
        subject.id === id ? { ...subject, ...data } : subject
      )
    );
    toast.success("Subject updated successfully");
    return true;
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
    toast.success("Semester deleted successfully");
    return true;
  };

  // Delete a subject
  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
    toast.success("Subject deleted successfully");
    return true;
  };

  // Get subjects by semester
  const getSubjectsBySemester = (semesterId: string) => {
    return subjects.filter(subject => subject.semesterId === semesterId);
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
    getSubjectsBySemester
  };
};
