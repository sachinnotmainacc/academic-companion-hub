
import { useMemo } from 'react';
import { useDataStore } from './useDataStore';
import { useSemesterActions } from './useSemesterActions';
import { useSubjectActions } from './useSubjectActions';
import { useDataInitialization } from './useDataInitialization';
import { Semester, Subject } from './types/dataTypes';

export { Semester, Subject };

export const useSemesterSubjectStore = () => {
  // Get shared store state
  const {
    semesters,
    setSemesters,
    subjects,
    setSubjects,
    loading,
    setLoading,
    error,
    setError,
    getSubjectsBySemester
  } = useDataStore();
  
  // Initialize data
  useDataInitialization(setSemesters, setSubjects, setLoading, setError);
  
  // Get semester actions
  const semesterActions = useSemesterActions(semesters, setSemesters, subjects);
  
  // Get subject actions
  const subjectActions = useSubjectActions(subjects, setSubjects);
  
  // Create the store API
  const store = useMemo(() => ({
    // Data
    semesters,
    subjects,
    loading,
    error,
    
    // Semester operations
    addSemester: semesterActions.addSemester,
    updateSemester: semesterActions.updateSemester,
    deleteSemester: semesterActions.deleteSemester,
    
    // Subject operations
    addSubject: subjectActions.addSubject,
    updateSubject: subjectActions.updateSubject,
    deleteSubject: subjectActions.deleteSubject,
    
    // Utility functions
    getSubjectsBySemester
  }), [
    semesters, 
    subjects, 
    loading, 
    error, 
    semesterActions, 
    subjectActions, 
    getSubjectsBySemester
  ]);
  
  return store;
};
