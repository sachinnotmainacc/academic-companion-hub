import connectDB from '@/db/connection';
import Semester from '@/db/models/Semester';
import Subject from '@/db/models/Subject';
import PDF from '@/db/models/PDF';
import { Semester as SemesterType, Subject as SubjectType } from '@/hooks/useSemesterSubjectStore';
import { PDF as PDFType } from '@/hooks/usePdfStore';
import mongoose from 'mongoose';

// Connect to MongoDB on service initialization
connectDB();

// Generate MongoDB-compatible ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Add a fallback mechanism to check MongoDB availability
const isMongoDB = typeof window === 'undefined' || (mongoose && mongoose.connection?.readyState >= 1);

// Semester API
export const SemesterAPI = {
  // Get all semesters
  getAll: async (): Promise<SemesterType[]> => {
    try {
      const semesters = await Semester.find().sort({ name: 1 });
      return semesters.map(sem => ({
        id: sem._id.toString(),
        name: sem.name
      }));
    } catch (error) {
      console.error('Error fetching semesters:', error);
      return [];
    }
  },

  // Add a new semester
  add: async (name: string): Promise<SemesterType | null> => {
    try {
      const newSemester = new Semester({
        name,
        _id: generateId()
      });
      await newSemester.save();
      return {
        id: newSemester._id.toString(),
        name: newSemester.name
      };
    } catch (error) {
      console.error('Error adding semester:', error);
      return null;
    }
  },

  // Update a semester
  update: async (id: string, name: string): Promise<boolean> => {
    try {
      await Semester.findByIdAndUpdate(id, { name });
      return true;
    } catch (error) {
      console.error('Error updating semester:', error);
      return false;
    }
  },

  // Delete a semester
  delete: async (id: string): Promise<boolean> => {
    try {
      await Semester.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error('Error deleting semester:', error);
      return false;
    }
  }
};

// Subject API
export const SubjectAPI = {
  // Get all subjects
  getAll: async (): Promise<SubjectType[]> => {
    try {
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

// PDF API
export const PDFAPI = {
  // Get all PDFs
  getAll: async (): Promise<PDFType[]> => {
    try {
      const pdfs = await PDF.find().sort({ createdAt: -1 });
      return pdfs.map(pdf => ({
        id: pdf._id.toString(),
        title: pdf.title,
        fileName: pdf.fileName,
        fileUrl: pdf.fileUrl,
        semesterId: pdf.semesterId,
        subjectId: pdf.subjectId,
        createdAt: pdf.createdAt.getTime()
      }));
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      return [];
    }
  },

  // Add a new PDF
  add: async (pdf: Omit<PDFType, 'id' | 'createdAt'>): Promise<PDFType | null> => {
    try {
      const newPDF = new PDF({
        ...pdf,
        _id: generateId(),
        createdAt: new Date()
      });
      await newPDF.save();
      return {
        id: newPDF._id.toString(),
        title: newPDF.title,
        fileName: newPDF.fileName,
        fileUrl: newPDF.fileUrl,
        semesterId: newPDF.semesterId,
        subjectId: newPDF.subjectId,
        createdAt: newPDF.createdAt.getTime()
      };
    } catch (error) {
      console.error('Error adding PDF:', error);
      return null;
    }
  },

  // Update a PDF
  update: async (id: string, data: Partial<PDFType>): Promise<boolean> => {
    try {
      await PDF.findByIdAndUpdate(id, data);
      return true;
    } catch (error) {
      console.error('Error updating PDF:', error);
      return false;
    }
  },

  // Delete a PDF
  delete: async (id: string): Promise<boolean> => {
    try {
      await PDF.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error('Error deleting PDF:', error);
      return false;
    }
  },

  // Get PDFs by subject
  getBySubject: async (subjectId: string): Promise<PDFType[]> => {
    try {
      const pdfs = await PDF.find({ subjectId }).sort({ createdAt: -1 });
      return pdfs.map(pdf => ({
        id: pdf._id.toString(),
        title: pdf.title,
        fileName: pdf.fileName,
        fileUrl: pdf.fileUrl,
        semesterId: pdf.semesterId,
        subjectId: pdf.subjectId,
        createdAt: pdf.createdAt.getTime()
      }));
    } catch (error) {
      console.error('Error fetching PDFs by subject:', error);
      return [];
    }
  },

  // Get PDFs by semester
  getBySemester: async (semesterId: string): Promise<PDFType[]> => {
    try {
      const pdfs = await PDF.find({ semesterId }).sort({ createdAt: -1 });
      return pdfs.map(pdf => ({
        id: pdf._id.toString(),
        title: pdf.title,
        fileName: pdf.fileName,
        fileUrl: pdf.fileUrl,
        semesterId: pdf.semesterId,
        subjectId: pdf.subjectId,
        createdAt: pdf.createdAt.getTime()
      }));
    } catch (error) {
      console.error('Error fetching PDFs by semester:', error);
      return [];
    }
  }
};
