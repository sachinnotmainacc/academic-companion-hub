
import PDF from '@/db/models/PDF';
import { PDF as PDFType } from '@/hooks/usePdfStore';
import { isBrowser, generateId } from './utils/apiUtils';

export const PDFAPI = {
  // Get all PDFs
  getAll: async (): Promise<PDFType[]> => {
    try {
      // In browser environment, we'll use localStorage
      if (isBrowser || !PDF) {
        console.log('Using fallback for PDFs in browser');
        // Return PDFs from localStorage if available
        const storedPDFs = localStorage.getItem('pdfs');
        if (storedPDFs) {
          return JSON.parse(storedPDFs);
        }
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
      // In browser environment, we'll use localStorage
      if (isBrowser || !PDF) {
        console.log('Using fallback for adding PDF in browser');
        // Generate local PDF
        const newId = generateId();
        const newPDF = {
          id: newId,
          ...pdf,
          createdAt: Date.now()
        };
        
        // Store in localStorage
        const storedPDFs = localStorage.getItem('pdfs');
        const pdfs = storedPDFs ? JSON.parse(storedPDFs) : [];
        localStorage.setItem('pdfs', JSON.stringify([...pdfs, newPDF]));
        
        return newPDF;
      }
      
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
      // In browser environment, we'll use localStorage
      if (isBrowser || !PDF) {
        console.log('Using fallback for updating PDF in browser');
        
        // Update in localStorage
        const storedPDFs = localStorage.getItem('pdfs');
        if (storedPDFs) {
          const pdfs = JSON.parse(storedPDFs);
          const updatedPDFs = pdfs.map((pdf: PDFType) => 
            pdf.id === id ? { ...pdf, ...data } : pdf
          );
          localStorage.setItem('pdfs', JSON.stringify(updatedPDFs));
        }
        
        return true;
      }
      
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
      // In browser environment, we'll use localStorage
      if (isBrowser || !PDF) {
        console.log('Using fallback for deleting PDF in browser');
        
        // Delete from localStorage
        const storedPDFs = localStorage.getItem('pdfs');
        if (storedPDFs) {
          const pdfs = JSON.parse(storedPDFs);
          const filteredPDFs = pdfs.filter((pdf: PDFType) => pdf.id !== id);
          localStorage.setItem('pdfs', JSON.stringify(filteredPDFs));
        }
        
        return true;
      }
      
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
      // In browser environment, we'll use localStorage
      if (isBrowser || !PDF) {
        console.log('Using fallback for getting PDFs by subject in browser');
        
        // Filter PDFs from localStorage
        const storedPDFs = localStorage.getItem('pdfs');
        if (storedPDFs) {
          const pdfs = JSON.parse(storedPDFs);
          return pdfs.filter((pdf: PDFType) => pdf.subjectId === subjectId);
        }
        return [];
      }
      
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
      // In browser environment, we'll use localStorage
      if (isBrowser || !PDF) {
        console.log('Using fallback for getting PDFs by semester in browser');
        
        // Filter PDFs from localStorage
        const storedPDFs = localStorage.getItem('pdfs');
        if (storedPDFs) {
          const pdfs = JSON.parse(storedPDFs);
          return pdfs.filter((pdf: PDFType) => pdf.semesterId === semesterId);
        }
        return [];
      }
      
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
