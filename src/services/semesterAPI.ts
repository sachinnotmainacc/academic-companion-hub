
import Semester from '@/db/models/Semester';
import { Semester as SemesterType } from '@/hooks/useSemesterSubjectStore';
import { isBrowser, generateId, DEFAULT_SEMESTERS } from './utils/apiUtils';

export const SemesterAPI = {
  // Get all semesters
  getAll: async (): Promise<SemesterType[]> => {
    try {
      // In browser, Semester might be null
      if (isBrowser || !Semester) {
        console.log('Using fallback for semesters in browser');
        // Return semesters from localStorage if available
        const storedSemesters = localStorage.getItem('semesters');
        if (storedSemesters) {
          return JSON.parse(storedSemesters);
        }
        return [];
      }
      
      let semesters = await Semester.find().sort({ order: 1, name: 1 });
      
      // If no semesters exist, create the default ones
      if (semesters.length === 0) {
        console.log('No semesters found, creating defaults');
        
        // Create default semesters
        for (const semData of DEFAULT_SEMESTERS) {
          try {
            const newSemester = new Semester({
              name: semData.name,
              order: semData.order,
              _id: generateId()
            });
            await newSemester.save();
          } catch (err) {
            console.error(`Error creating default semester ${semData.name}:`, err);
          }
        }
        
        // Fetch again after creating defaults
        semesters = await Semester.find().sort({ order: 1, name: 1 });
      }
      
      return semesters.map(sem => ({
        id: sem._id.toString(),
        name: sem.name,
        order: sem.order || 0
      }));
    } catch (error) {
      console.error('Error fetching semesters:', error);
      return [];
    }
  },

  // Add a new semester
  add: async (name: string, order?: number): Promise<SemesterType | null> => {
    try {
      // In browser, Semester might be null
      if (isBrowser || !Semester) {
        console.log('Using fallback for adding semester in browser');
        // Generate local semester
        const newId = generateId();
        const newSemester = {
          id: newId,
          name,
          order: order || 0
        };
        
        // Store in localStorage
        const storedSemesters = localStorage.getItem('semesters');
        const semesters = storedSemesters ? JSON.parse(storedSemesters) : [];
        localStorage.setItem('semesters', JSON.stringify([...semesters, newSemester]));
        
        return newSemester;
      }
      
      // Find the highest order if not provided
      let semesterOrder = order;
      if (!semesterOrder) {
        const highestSem = await Semester.findOne().sort({ order: -1 });
        semesterOrder = highestSem ? (highestSem.order + 1) : 1;
      }
      
      const newSemester = new Semester({
        name,
        order: semesterOrder,
        _id: generateId()
      });
      await newSemester.save();
      return {
        id: newSemester._id.toString(),
        name: newSemester.name,
        order: newSemester.order
      };
    } catch (error) {
      console.error('Error adding semester:', error);
      return null;
    }
  },

  // Update a semester
  update: async (id: string, data: Partial<SemesterType>): Promise<boolean> => {
    try {
      // In browser, Semester might be null
      if (isBrowser || !Semester) {
        console.log('Using fallback for updating semester in browser');
        
        // Update in localStorage
        const storedSemesters = localStorage.getItem('semesters');
        if (storedSemesters) {
          const semesters = JSON.parse(storedSemesters);
          const updatedSemesters = semesters.map((sem: SemesterType) => 
            sem.id === id ? { ...sem, ...data } : sem
          );
          localStorage.setItem('semesters', JSON.stringify(updatedSemesters));
        }
        
        return true;
      }
      
      await Semester.findByIdAndUpdate(id, data);
      return true;
    } catch (error) {
      console.error('Error updating semester:', error);
      return false;
    }
  },

  // Delete a semester
  delete: async (id: string): Promise<boolean> => {
    try {
      // In browser, Semester might be null
      if (isBrowser || !Semester) {
        console.log('Using fallback for deleting semester in browser');
        
        // Delete from localStorage
        const storedSemesters = localStorage.getItem('semesters');
        if (storedSemesters) {
          const semesters = JSON.parse(storedSemesters);
          const filteredSemesters = semesters.filter((sem: SemesterType) => sem.id !== id);
          localStorage.setItem('semesters', JSON.stringify(filteredSemesters));
        }
        
        return true;
      }
      
      await Semester.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error('Error deleting semester:', error);
      return false;
    }
  }
};
