
import { useEffect } from 'react';
import { toast } from 'sonner';
import { SemesterAPI, SubjectAPI } from '@/services/api';
import { DEFAULT_SEMESTERS } from './useDataStore';
import { Semester, Subject } from './types/dataTypes';

export const useDataInitialization = (
  setSemesters: React.Dispatch<React.SetStateAction<Semester[]>>,
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
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
  }, [setSemesters, setSubjects, setLoading, setError]);
};
