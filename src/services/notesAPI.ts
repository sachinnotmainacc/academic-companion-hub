import fs from 'fs';
import path from 'path';
import Notes from '@/db/models/Notes';
import { isBrowser } from './utils/apiUtils';

// Define the path for the notes JSON file
const notesFilePath = path.join(process.cwd(), 'data', 'notes.json');

// Ensure the directory exists
const ensureDirectoryExists = () => {
  if (!isBrowser) {
    const dir = path.dirname(notesFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
};

// Interface definitions
export interface Material {
  title: string;
  description?: string;
  path: string;
  type: string;
  size?: string;
  uploadDate: string;
  downloadUrl: string;
  keywords?: string[];
}

export interface Subject {
  id: string;
  name: string;
  materials: Material[];
}

export interface Branch {
  id: string;
  name: string;
  subjects: Subject[];
  directoryUrl?: string;
  canBrowse?: boolean;
}

export interface Semester {
  id: number;
  name: string;
  branches: Branch[];
}

export interface SearchIndex {
  subjects: Record<string, string[]>;
}

export interface NotesData {
  semesters: Semester[];
  searchIndex: SearchIndex;
}

// Default notes data structure
const defaultNotesData: NotesData = {
  semesters: [],
  searchIndex: {
    subjects: {}
  }
};

export const NotesAPI = {
  // Get all notes data
  getAll: async (): Promise<NotesData> => {
    try {
      // In browser or if Notes model is unavailable
      if (isBrowser || !Notes) {
        console.log('Using fallback for notes in browser');
        
        // Check localStorage first
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
          return JSON.parse(storedNotes);
        }
        
        // Otherwise, check if the JSON file exists
        if (!isBrowser && fs.existsSync(notesFilePath)) {
          const fileData = fs.readFileSync(notesFilePath, 'utf8');
          return JSON.parse(fileData);
        }
        
        return defaultNotesData;
      }
      
      // Try to get from MongoDB
      let notesData = await Notes.findOne();
      
      if (!notesData) {
        // If no notes data exists in MongoDB, check if the JSON file exists
        if (fs.existsSync(notesFilePath)) {
          const fileData = fs.readFileSync(notesFilePath, 'utf8');
          const parsedData = JSON.parse(fileData);
          
          // Save to MongoDB
          notesData = new Notes(parsedData);
          await notesData.save();
        } else {
          // Create with default structure
          notesData = new Notes(defaultNotesData);
          await notesData.save();
          
          // Also initialize the JSON file
          ensureDirectoryExists();
          fs.writeFileSync(notesFilePath, JSON.stringify(defaultNotesData, null, 2));
        }
      }
      
      return notesData.toObject();
    } catch (error) {
      console.error('Error fetching notes data:', error);
      return defaultNotesData;
    }
  },

  // Save all notes data
  saveAll: async (notesData: NotesData): Promise<boolean> => {
    try {
      // In browser or if Notes model is unavailable
      if (isBrowser || !Notes) {
        console.log('Using fallback for saving notes in browser');
        localStorage.setItem('notes', JSON.stringify(notesData));
        return true;
      }
      
      // Save to MongoDB
      await Notes.findOneAndUpdate({}, notesData, { upsert: true, new: true });
      
      // Also update the JSON file
      ensureDirectoryExists();
      fs.writeFileSync(notesFilePath, JSON.stringify(notesData, null, 2));
      
      return true;
    } catch (error) {
      console.error('Error saving notes data:', error);
      return false;
    }
  },

  // Add a new semester
  addSemester: async (semesterData: Omit<Semester, 'branches'>): Promise<boolean> => {
    try {
      const notesData = await NotesAPI.getAll();
      
      // Check if semester already exists
      if (notesData.semesters.some(sem => sem.id === semesterData.id)) {
        console.error('Semester with this ID already exists');
        return false;
      }
      
      // Add new semester
      notesData.semesters.push({
        ...semesterData,
        branches: []
      });
      
      // Sort semesters by ID
      notesData.semesters.sort((a, b) => a.id - b.id);
      
      return await NotesAPI.saveAll(notesData);
    } catch (error) {
      console.error('Error adding semester:', error);
      return false;
    }
  },

  // Add a new branch to a semester
  addBranch: async (semesterId: number, branchData: Omit<Branch, 'subjects'>): Promise<boolean> => {
    try {
      const notesData = await NotesAPI.getAll();
      
      // Find the semester
      const semesterIndex = notesData.semesters.findIndex(sem => sem.id === semesterId);
      if (semesterIndex === -1) {
        console.error('Semester not found');
        return false;
      }
      
      // Check if branch already exists in this semester
      if (notesData.semesters[semesterIndex].branches.some(branch => branch.id === branchData.id)) {
        console.error('Branch with this ID already exists in this semester');
        return false;
      }
      
      // Add new branch
      notesData.semesters[semesterIndex].branches.push({
        ...branchData,
        subjects: []
      });
      
      return await NotesAPI.saveAll(notesData);
    } catch (error) {
      console.error('Error adding branch:', error);
      return false;
    }
  },

  // Add a new subject to a branch
  addSubject: async (
    semesterId: number, 
    branchId: string, 
    subjectData: Subject
  ): Promise<boolean> => {
    try {
      const notesData = await NotesAPI.getAll();
      
      // Find the semester
      const semesterIndex = notesData.semesters.findIndex(sem => sem.id === semesterId);
      if (semesterIndex === -1) {
        console.error('Semester not found');
        return false;
      }
      
      // Find the branch
      const branchIndex = notesData.semesters[semesterIndex].branches.findIndex(
        branch => branch.id === branchId
      );
      if (branchIndex === -1) {
        console.error('Branch not found');
        return false;
      }
      
      // Check if subject already exists in this branch
      if (
        notesData.semesters[semesterIndex].branches[branchIndex].subjects.some(
          sub => sub.id === subjectData.id
        )
      ) {
        console.error('Subject with this ID already exists in this branch');
        return false;
      }
      
      // Add new subject
      notesData.semesters[semesterIndex].branches[branchIndex].subjects.push(subjectData);
      
      // Update search index
      const subjectName = subjectData.name.toLowerCase();
      if (!notesData.searchIndex.subjects[subjectName]) {
        notesData.searchIndex.subjects[subjectName] = [];
      }
      notesData.searchIndex.subjects[subjectName].push(subjectData.id);
      
      return await NotesAPI.saveAll(notesData);
    } catch (error) {
      console.error('Error adding subject:', error);
      return false;
    }
  },

  // Add material to a subject
  addMaterial: async (
    semesterId: number,
    branchId: string,
    subjectId: string,
    materialData: Material
  ): Promise<boolean> => {
    try {
      const notesData = await NotesAPI.getAll();
      
      // Find the semester
      const semesterIndex = notesData.semesters.findIndex(sem => sem.id === semesterId);
      if (semesterIndex === -1) {
        console.error('Semester not found');
        return false;
      }
      
      // Find the branch
      const branchIndex = notesData.semesters[semesterIndex].branches.findIndex(
        branch => branch.id === branchId
      );
      if (branchIndex === -1) {
        console.error('Branch not found');
        return false;
      }
      
      // Find the subject
      const subjectIndex = notesData.semesters[semesterIndex].branches[branchIndex].subjects.findIndex(
        subject => subject.id === subjectId
      );
      if (subjectIndex === -1) {
        console.error('Subject not found');
        return false;
      }
      
      // Add new material
      notesData.semesters[semesterIndex].branches[branchIndex].subjects[subjectIndex].materials.push(
        materialData
      );
      
      // Update search index with keywords
      if (materialData.keywords && materialData.keywords.length > 0) {
        materialData.keywords.forEach(keyword => {
          const key = keyword.toLowerCase();
          if (!notesData.searchIndex.subjects[key]) {
            notesData.searchIndex.subjects[key] = [];
          }
          if (!notesData.searchIndex.subjects[key].includes(subjectId)) {
            notesData.searchIndex.subjects[key].push(subjectId);
          }
        });
      }
      
      return await NotesAPI.saveAll(notesData);
    } catch (error) {
      console.error('Error adding material:', error);
      return false;
    }
  },
  
  // Delete a semester
  deleteSemester: async (semesterId: number): Promise<boolean> => {
    try {
      const notesData = await NotesAPI.getAll();
      
      const originalLength = notesData.semesters.length;
      notesData.semesters = notesData.semesters.filter(sem => sem.id !== semesterId);
      
      if (notesData.semesters.length === originalLength) {
        console.error('Semester not found');
        return false;
      }
      
      return await NotesAPI.saveAll(notesData);
    } catch (error) {
      console.error('Error deleting semester:', error);
      return false;
    }
  },
  
  // Delete a branch
  deleteBranch: async (semesterId: number, branchId: string): Promise<boolean> => {
    try {
      const notesData = await NotesAPI.getAll();
      
      // Find the semester
      const semesterIndex = notesData.semesters.findIndex(sem => sem.id === semesterId);
      if (semesterIndex === -1) {
        console.error('Semester not found');
        return false;
      }
      
      const originalLength = notesData.semesters[semesterIndex].branches.length;
      notesData.semesters[semesterIndex].branches = notesData.semesters[semesterIndex].branches.filter(
        branch => branch.id !== branchId
      );
      
      if (notesData.semesters[semesterIndex].branches.length === originalLength) {
        console.error('Branch not found');
        return false;
      }
      
      return await NotesAPI.saveAll(notesData);
    } catch (error) {
      console.error('Error deleting branch:', error);
      return false;
    }
  },
  
  // Delete a subject
  deleteSubject: async (semesterId: number, branchId: string, subjectId: string): Promise<boolean> => {
    try {
      const notesData = await NotesAPI.getAll();
      
      // Find the semester
      const semesterIndex = notesData.semesters.findIndex(sem => sem.id === semesterId);
      if (semesterIndex === -1) {
        console.error('Semester not found');
        return false;
      }
      
      // Find the branch
      const branchIndex = notesData.semesters[semesterIndex].branches.findIndex(
        branch => branch.id === branchId
      );
      if (branchIndex === -1) {
        console.error('Branch not found');
        return false;
      }
      
      const originalLength = notesData.semesters[semesterIndex].branches[branchIndex].subjects.length;
      
      // Get the subject before deleting it
      const subject = notesData.semesters[semesterIndex].branches[branchIndex].subjects.find(
        sub => sub.id === subjectId
      );
      
      // Remove the subject
      notesData.semesters[semesterIndex].branches[branchIndex].subjects = 
        notesData.semesters[semesterIndex].branches[branchIndex].subjects.filter(
          sub => sub.id !== subjectId
        );
      
      if (notesData.semesters[semesterIndex].branches[branchIndex].subjects.length === originalLength) {
        console.error('Subject not found');
        return false;
      }
      
      // Update search index - remove this subject ID from all keywords
      if (subject) {
        for (const keyword in notesData.searchIndex.subjects) {
          notesData.searchIndex.subjects[keyword] = notesData.searchIndex.subjects[keyword].filter(
            id => id !== subjectId
          );
        }
      }
      
      return await NotesAPI.saveAll(notesData);
    } catch (error) {
      console.error('Error deleting subject:', error);
      return false;
    }
  }
};
