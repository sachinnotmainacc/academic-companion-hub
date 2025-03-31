
import { toast } from 'sonner';
import { SemesterAPI } from '@/services/api';
import { Semester } from './types/dataTypes';

export const useSemesterActions = (
  semesters: Semester[],
  setSemesters: React.Dispatch<React.SetStateAction<Semester[]>>,
  subjects: { semesterId: string }[]
) => {
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
      const generateId = () => Math.random().toString(36).substring(2, 9);
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

  return {
    addSemester,
    updateSemester,
    deleteSemester
  };
};
