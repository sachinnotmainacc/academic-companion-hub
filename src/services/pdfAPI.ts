
import { PDF as PDFType } from '@/hooks/usePdfStore';
import { generateId, isBrowser } from './utils/apiUtils';

const API_BASE_URL = '/api';

// Mock storage for client-side fallback
const clientStorage = {
  pdfs: [] as PDFType[]
};

export const PDFAPI = {
  // Get all PDFs
  getAll: async (): Promise<PDFType[]> => {
    try {
      if (isBrowser) {
        // In browser, use fetch API
        const response = await fetch(`${API_BASE_URL}/pdfs`);
        if (!response.ok) {
          throw new Error(`Error fetching PDFs: ${response.status}`);
        }
        const pdfs = await response.json();
        return pdfs;
      } else {
        // This branch should not run in the browser
        console.error('Server-side PDF retrieval not available in browser');
        return clientStorage.pdfs;
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      // Return cached data or empty array
      return isBrowser ? 
        JSON.parse(localStorage.getItem('pdfs') || '[]') : 
        clientStorage.pdfs;
    }
  },

  // Add a new PDF
  add: async (pdf: Omit<PDFType, 'id' | 'createdAt'>): Promise<PDFType | null> => {
    try {
      const newPDF = {
        ...pdf,
        id: generateId(),
        createdAt: Date.now()
      };
      
      if (isBrowser) {
        // In browser, use fetch API
        const response = await fetch(`${API_BASE_URL}/pdfs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPDF),
        });
        
        if (!response.ok) {
          throw new Error(`Error adding PDF: ${response.status}`);
        }
        
        const savedPDF = await response.json();
        
        // Update local cache
        const pdfs = JSON.parse(localStorage.getItem('pdfs') || '[]');
        pdfs.unshift(savedPDF);
        localStorage.setItem('pdfs', JSON.stringify(pdfs));
        
        return savedPDF;
      } else {
        // This branch should not run in the browser
        console.error('Server-side PDF creation not available in browser');
        clientStorage.pdfs.unshift(newPDF);
        return newPDF;
      }
    } catch (error) {
      console.error('Error adding PDF:', error);
      return null;
    }
  },

  // Update a PDF
  update: async (id: string, data: Partial<PDFType>): Promise<boolean> => {
    try {
      if (isBrowser) {
        // In browser, use fetch API
        const response = await fetch(`${API_BASE_URL}/pdfs/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error(`Error updating PDF: ${response.status}`);
        }
        
        // Update local cache
        const pdfs = JSON.parse(localStorage.getItem('pdfs') || '[]');
        const index = pdfs.findIndex((pdf: PDFType) => pdf.id === id);
        if (index !== -1) {
          pdfs[index] = { ...pdfs[index], ...data };
          localStorage.setItem('pdfs', JSON.stringify(pdfs));
        }
        
        return true;
      } else {
        // This branch should not run in the browser
        console.error('Server-side PDF update not available in browser');
        const index = clientStorage.pdfs.findIndex(pdf => pdf.id === id);
        if (index !== -1) {
          clientStorage.pdfs[index] = { ...clientStorage.pdfs[index], ...data };
        }
        return true;
      }
    } catch (error) {
      console.error('Error updating PDF:', error);
      return false;
    }
  },

  // Delete a PDF
  delete: async (id: string): Promise<boolean> => {
    try {
      if (isBrowser) {
        // In browser, use fetch API
        const response = await fetch(`${API_BASE_URL}/pdfs/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Error deleting PDF: ${response.status}`);
        }
        
        // Update local cache
        const pdfs = JSON.parse(localStorage.getItem('pdfs') || '[]');
        const filteredPdfs = pdfs.filter((pdf: PDFType) => pdf.id !== id);
        localStorage.setItem('pdfs', JSON.stringify(filteredPdfs));
        
        return true;
      } else {
        // This branch should not run in the browser
        console.error('Server-side PDF deletion not available in browser');
        clientStorage.pdfs = clientStorage.pdfs.filter(pdf => pdf.id !== id);
        return true;
      }
    } catch (error) {
      console.error('Error deleting PDF:', error);
      return false;
    }
  },

  // Get PDFs by subject
  getBySubject: async (subjectId: string): Promise<PDFType[]> => {
    try {
      if (isBrowser) {
        // In browser, use fetch API
        const response = await fetch(`${API_BASE_URL}/pdfs?subjectId=${subjectId}`);
        if (!response.ok) {
          throw new Error(`Error fetching PDFs by subject: ${response.status}`);
        }
        return await response.json();
      } else {
        // This branch should not run in the browser
        console.error('Server-side PDF retrieval not available in browser');
        return clientStorage.pdfs.filter(pdf => pdf.subjectId === subjectId);
      }
    } catch (error) {
      console.error('Error fetching PDFs by subject:', error);
      // Try to use local storage as fallback
      if (isBrowser) {
        const pdfs = JSON.parse(localStorage.getItem('pdfs') || '[]');
        return pdfs.filter((pdf: PDFType) => pdf.subjectId === subjectId);
      }
      return [];
    }
  },

  // Get PDFs by semester
  getBySemester: async (semesterId: string): Promise<PDFType[]> => {
    try {
      if (isBrowser) {
        // In browser, use fetch API
        const response = await fetch(`${API_BASE_URL}/pdfs?semesterId=${semesterId}`);
        if (!response.ok) {
          throw new Error(`Error fetching PDFs by semester: ${response.status}`);
        }
        return await response.json();
      } else {
        // This branch should not run in the browser
        console.error('Server-side PDF retrieval not available in browser');
        return clientStorage.pdfs.filter(pdf => pdf.semesterId === semesterId);
      }
    } catch (error) {
      console.error('Error fetching PDFs by semester:', error);
      // Try to use local storage as fallback
      if (isBrowser) {
        const pdfs = JSON.parse(localStorage.getItem('pdfs') || '[]');
        return pdfs.filter((pdf: PDFType) => pdf.semesterId === semesterId);
      }
      return [];
    }
  }
};
