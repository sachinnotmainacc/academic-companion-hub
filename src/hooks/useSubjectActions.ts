
import { toast } from 'sonner';
import { SubjectAPI } from '@/services/api';
import { Subject } from './types/dataTypes';

export const useSubjectActions = (
  subjects: Subject[],
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>
) => {
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
      const generateId = () => Math.random().toString(36).substring(2, 9);
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

  return {
    addSubject,
    updateSubject,
    deleteSubject
  };
};
