
import Subject from '@/db/models/Subject';
import type { Subject as SubjectType } from '@/hooks/useSemesterSubjectStore';
import { isBrowser, generateId } from './utils/apiUtils';

export const SubjectAPI = {
  // Get all subjects
  getAll: async (): Promise<SubjectType[]> => {
    try {
      // In browser, Subject might be null
      if (isBrowser || !Subject) {
        console.log('Using fallback for subjects in browser');
        // Return subjects from localStorage if available
        const storedSubjects = localStorage.getItem('subjects');
        if (storedSubjects) {
          return JSON.parse(storedSubjects);
        }
        return [];
      }
      
      const subjects = await Subject.find().sort({ name: 1 });
      return subjects.map(sub => ({
        id: sub._id.toString(),
        name: sub.name,
        semesterId: sub.semesterId
      }));
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
  },

  // Add a new subject
  add: async (name: string, semesterId: string): Promise<SubjectType | null> => {
    try {
      // In browser, Subject might be null
      if (isBrowser || !Subject) {
        console.log('Using fallback for adding subject in browser');
        // Generate local subject
        const newId = generateId();
        const newSubject = {
          id: newId,
          name,
          semesterId
        };
        
        // Store in localStorage
        const storedSubjects = localStorage.getItem('subjects');
        const subjects = storedSubjects ? JSON.parse(storedSubjects) : [];
        localStorage.setItem('subjects', JSON.stringify([...subjects, newSubject]));
        
        return newSubject;
      }
      
      const newSubject = new Subject({
        name,
        semesterId,
        _id: generateId()
      });
      await newSubject.save();
      return {
        id: newSubject._id.toString(),
        name: newSubject.name,
        semesterId: newSubject.semesterId
      };
    } catch (error) {
      console.error('Error adding subject:', error);
      return null;
    }
  },

  // Update a subject
  update: async (id: string, data: Partial<SubjectType>): Promise<boolean> => {
    try {
      // In browser, Subject might be null
      if (isBrowser || !Subject) {
        console.log('Using fallback for updating subject in browser');
        
        // Update in localStorage
        const storedSubjects = localStorage.getItem('subjects');
        if (storedSubjects) {
          const subjects = JSON.parse(storedSubjects);
          const updatedSubjects = subjects.map((sub: SubjectType) => 
            sub.id === id ? { ...sub, ...data } : sub
          );
          localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
        }
        
        return true;
      }
      
      await Subject.findByIdAndUpdate(id, data);
      return true;
    } catch (error) {
      console.error('Error updating subject:', error);
      return false;
    }
  },

  // Delete a subject
  delete: async (id: string): Promise<boolean> => {
    try {
      // In browser, Subject might be null
      if (isBrowser || !Subject) {
        console.log('Using fallback for deleting subject in browser');
        
        // Delete from localStorage
        const storedSubjects = localStorage.getItem('subjects');
        if (storedSubjects) {
          const subjects = JSON.parse(storedSubjects);
          const filteredSubjects = subjects.filter((sub: SubjectType) => sub.id !== id);
          localStorage.setItem('subjects', JSON.stringify(filteredSubjects));
        }
        
        return true;
      }
      
      await Subject.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error('Error deleting subject:', error);
      return false;
    }
  },

  // Get subjects by semester
  getBySemester: async (semesterId: string): Promise<SubjectType[]> => {
    try {
      // In browser, Subject might be null
      if (isBrowser || !Subject) {
        console.log('Using fallback for getting subjects by semester in browser');
        
        // Filter subjects from localStorage
        const storedSubjects = localStorage.getItem('subjects');
        if (storedSubjects) {
          const subjects = JSON.parse(storedSubjects);
          return subjects.filter((sub: SubjectType) => sub.semesterId === semesterId);
        }
        return [];
      }
      
      const subjects = await Subject.find({ semesterId }).sort({ name: 1 });
      return subjects.map(sub => ({
        id: sub._id.toString(),
        name: sub.name,
        semesterId: sub.semesterId
      }));
    } catch (error) {
      console.error('Error fetching subjects by semester:', error);
      return [];
    }
  }
};
