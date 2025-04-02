
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { SemesterAPI, SubjectAPI } from '@/services/api';

// Type definitions
export type Semester = {
  id: string;
  name: string;
  order?: number;
};

export type Subject = {
  id: string;
  name: string;
  semesterId: string;
};

// Create a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Default semesters to use if needed
const DEFAULT_SEMESTERS: Semester[] = [
  { id: generateId(), name: 'Semester 1', order: 1 },
  { id: generateId(), name: 'Semester 2', order: 2 },
  { id: generateId(), name: 'Semester 3', order: 3 },
  { id: generateId(), name: 'Semester 4', order: 4 },
  { id: generateId(), name: 'Semester 5', order: 5 },
  { id: generateId(), name: 'Semester 6', order: 6 },
  { id: generateId(), name: 'Semester 7', order: 7 },
  { id: generateId(), name: 'Semester 8', order: 8 }
];

export const useSemesterSubjectStore = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from MongoDB on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First try to fetch from MongoDB
        console.log('Fetching semesters from API...');
        const fetchedSemesters = await SemesterAPI.getAll();
        console.log('Fetched semesters:', fetchedSemesters);
        
        const fetchedSubjects = await SubjectAPI.getAll();
        console.log('Fetched subjects:', fetchedSubjects);
        
        // If we have data from MongoDB, use it
        if (fetchedSemesters.length > 0) {
          setSemesters(fetchedSemesters);
        } else {
          // No MongoDB data, check localStorage as fallback
          const storedSemesters = localStorage.getItem('semesters');
          if (storedSemesters) {
            const parsedSemesters = JSON.parse(storedSemesters);
            setSemesters(parsedSemesters);
            
            // Migrate localStorage data to MongoDB
            parsedSemesters.forEach(async (sem: Semester) => {
              await SemesterAPI.add(sem.name, sem.order);
            });
          } else {
            // Add default semesters if none exist
            setSemesters(DEFAULT_SEMESTERS);
            
            // Save default semesters to MongoDB
            DEFAULT_SEMESTERS.forEach(async (sem) => {
              await SemesterAPI.add(sem.name, sem.order);
            });
          }
        }
        
        // Same for subjects
        if (fetchedSubjects.length > 0) {
          setSubjects(fetchedSubjects);
        } else {
          const storedSubjects = localStorage.getItem('subjects');
          if (storedSubjects) {
            const parsedSubjects = JSON.parse(storedSubjects);
            setSubjects(parsedSubjects);
            
            // Migrate localStorage data to MongoDB
            parsedSubjects.forEach(async (sub: Subject) => {
              await SubjectAPI.add(sub.name, sub.semesterId);
            });
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to connect to database');
        
        // Fallback to localStorage
        const storedSemesters = localStorage.getItem('semesters');
        const storedSubjects = localStorage.getItem('subjects');

        if (storedSemesters) {
          setSemesters(JSON.parse(storedSemesters));
        } else {
          // Use default semesters if nothing in localStorage
          setSemesters(DEFAULT_SEMESTERS);
          localStorage.setItem('semesters', JSON.stringify(DEFAULT_SEMESTERS));
        }
        
        if (storedSubjects) {
          setSubjects(JSON.parse(storedSubjects));
        }
        
        toast.error("Failed to connect to database. Using local storage temporarily.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Still save to localStorage as a backup
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

  // Add a new semester
  const addSemester = async (name: string) => {
    const semesterExists = semesters.some(
      sem => sem.name.toLowerCase() === name.toLowerCase()
    );

    if (semesterExists) {
      toast.error("Semester already exists");
      return null;
    }

    try {
      const newSemester = await SemesterAPI.add(name);
      
      if (newSemester) {
        setSemesters([...semesters, newSemester]);
        toast.success("Semester added successfully");
        return newSemester;
      }
      
      // Fallback to local if API fails
      const localSemester: Semester = {
        id: generateId(),
        name,
      };
      setSemesters([...semesters, localSemester]);
      toast.success("Semester added successfully (local only)");
      return localSemester;
    } catch (error) {
      console.error("Error adding semester:", error);
      toast.error("Failed to add semester to database");
      return null;
    }
  };

  // Add a new subject
  const addSubject = async (name: string, semesterId: string) => {
    const subjectExists = subjects.some(
      sub => sub.name.toLowerCase() === name.toLowerCase() && sub.semesterId === semesterId
    );

    if (subjectExists) {
      toast.error("Subject already exists in this semester");
      return null;
    }

    try {
      const newSubject = await SubjectAPI.add(name, semesterId);
      
      if (newSubject) {
        setSubjects([...subjects, newSubject]);
        toast.success("Subject added successfully");
        return newSubject;
      }
      
      // Fallback to local if API fails
      const localSubject: Subject = {
        id: generateId(),
        name,
        semesterId,
      };
      setSubjects([...subjects, localSubject]);
      toast.success("Subject added successfully (local only)");
      return localSubject;
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Failed to add subject to database");
      return null;
    }
  };

  // Update a semester
  const updateSemester = async (id: string, data: Partial<Semester>) => {
    if (data.name) {
      // Check if the updated name already exists in other semesters
      const semesterExists = semesters.some(
        sem => sem.name.toLowerCase() === data.name!.toLowerCase() && sem.id !== id
      );

      if (semesterExists) {
        toast.error("Semester name already exists");
        return false;
      }
    }

    try {
      const success = await SemesterAPI.update(id, data);
      
      if (success) {
        setSemesters(
          semesters.map((semester) =>
            semester.id === id ? { ...semester, ...data } : semester
          )
        );
        toast.success("Semester updated successfully");
        return true;
      } else {
        // Fallback to local update
        setSemesters(
          semesters.map((semester) =>
            semester.id === id ? { ...semester, ...data } : semester
          )
        );
        toast.success("Semester updated successfully (local only)");
        return true;
      }
    } catch (error) {
      console.error("Error updating semester:", error);
      toast.error("Failed to update semester in database");
      return false;
    }
  };

  // Update a subject
  const updateSubject = async (id: string, data: Partial<Subject>) => {
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

    try {
      const success = await SubjectAPI.update(id, data);
      
      if (success) {
        setSubjects(
          subjects.map((subject) =>
            subject.id === id ? { ...subject, ...data } : subject
          )
        );
        toast.success("Subject updated successfully");
        return true;
      } else {
        // Fallback to local update
        setSubjects(
          subjects.map((subject) =>
            subject.id === id ? { ...subject, ...data } : subject
          )
        );
        toast.success("Subject updated successfully (local only)");
        return true;
      }
    } catch (error) {
      console.error("Error updating subject:", error);
      toast.error("Failed to update subject in database");
      return false;
    }
  };

  // Delete a semester
  const deleteSemester = async (id: string) => {
    // Check if subjects are using this semester
    const hasSubjects = subjects.some(subject => subject.semesterId === id);
    if (hasSubjects) {
      toast.error('Cannot delete semester with associated subjects');
      return false;
    }

    try {
      const success = await SemesterAPI.delete(id);
      
      if (success) {
        setSemesters(semesters.filter((semester) => semester.id !== id));
        toast.success("Semester deleted successfully");
        return true;
      } else {
        // Fallback to local delete
        setSemesters(semesters.filter((semester) => semester.id !== id));
        toast.success("Semester deleted successfully (local only)");
        return true;
      }
    } catch (error) {
      console.error("Error deleting semester:", error);
      toast.error("Failed to delete semester from database");
      return false;
    }
  };

  // Delete a subject
  const deleteSubject = async (id: string) => {
    try {
      const success = await SubjectAPI.delete(id);
      
      if (success) {
        setSubjects(subjects.filter((subject) => subject.id !== id));
        toast.success("Subject deleted successfully");
        return true;
      } else {
        // Fallback to local delete
        setSubjects(subjects.filter((subject) => subject.id !== id));
        toast.success("Subject deleted successfully (local only)");
        return true;
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject from database");
      return false;
    }
  };

  // Get subjects by semester
  const getSubjectsBySemester = (semesterId: string) => {
    return subjects.filter(subject => subject.semesterId === semesterId);
  };

  return {
    semesters,
    subjects,
    loading,
    error,
    addSemester,
    addSubject,
    updateSemester,
    updateSubject,
    deleteSemester,
    deleteSubject,
    getSubjectsBySemester
  };
};
