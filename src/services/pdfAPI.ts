
import PDF from '@/db/models/PDF';
import { PDF as PDFType } from '@/hooks/usePdfStore';
import { generateId } from './utils/apiUtils';

export const PDFAPI = {
  // Get all PDFs
  getAll: async (): Promise<PDFType[]> => {
    try {
      // Check if PDF model is available
      if (!PDF || typeof PDF.find !== 'function') {
        console.error('PDF model is not properly initialized');
        return [];
      }
      
      const pdfs = await PDF.find().sort({ createdAt: -1 });
      return pdfs.map(pdf => ({
        id: pdf._id.toString(),
        title: pdf.title,
        fileName: pdf.fileName,
        fileUrl: pdf.fileUrl,
        semesterId: pdf.semesterId,
        subjectId: pdf.subjectId,
        description: pdf.description,
        keywords: pdf.keywords,
        size: pdf.size,
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
        description: newPDF.description,
        keywords: newPDF.keywords,
        size: newPDF.size,
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
