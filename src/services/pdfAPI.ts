
import { PDF as PDFType } from '@/hooks/usePdfStore';
import { generateId, isBrowser } from './utils/apiUtils';

// Mock storage for client-side fallback
const clientStorage = {
  pdfs: [] as PDFType[]
};

// Load from localStorage if in browser
if (isBrowser) {
  try {
    const storedPdfs = localStorage.getItem('pdfs');
    if (storedPdfs) {
      clientStorage.pdfs = JSON.parse(storedPdfs);
    }
  } catch (error) {
    console.error('Error loading PDFs from localStorage:', error);
  }
}

export const PDFAPI = {
  // Get all PDFs
  getAll: async (): Promise<PDFType[]> => {
    try {
      if (isBrowser) {
        try {
          // In browser environment, we should try fetch but be prepared for it to fail
          const response = await fetch('/api/pdfs');
          if (response.ok) {
            const pdfs = await response.json();
            return pdfs;
          } else {
            // Fallback to localStorage if API fails
            console.info('API request failed, using localStorage fallback');
            return clientStorage.pdfs;
          }
        } catch (error) {
          console.info('Using client storage fallback for PDFs');
          return clientStorage.pdfs;
        }
      } else {
        // This branch should not run in the browser
        console.error('Server-side PDF retrieval not available in browser');
        return clientStorage.pdfs;
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      // Return cached data
      return clientStorage.pdfs;
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
        try {
          // Try the server API first
          const response = await fetch('/api/pdfs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPDF),
          });
          
          if (response.ok) {
            const savedPDF = await response.json();
            // Update client storage/localStorage
            clientStorage.pdfs.unshift(savedPDF);
            localStorage.setItem('pdfs', JSON.stringify(clientStorage.pdfs));
            return savedPDF;
          } else {
            // Fallback to client storage if API fails
            console.info('API request failed, using client storage fallback for adding PDF');
            clientStorage.pdfs.unshift(newPDF);
            localStorage.setItem('pdfs', JSON.stringify(clientStorage.pdfs));
            return newPDF;
          }
        } catch (error) {
          // Fallback to client storage
          console.info('Using client storage fallback for adding PDF');
          clientStorage.pdfs.unshift(newPDF);
          localStorage.setItem('pdfs', JSON.stringify(clientStorage.pdfs));
          return newPDF;
        }
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
        try {
          // Try the server API first
          const response = await fetch(`/api/pdfs/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            // Fallback to client storage if API fails
            console.info('API request failed, using client storage fallback for updating PDF');
          }
        } catch (error) {
          console.info('Using client storage fallback for updating PDF');
        }
        
        // Update local storage regardless of API success
        const index = clientStorage.pdfs.findIndex(pdf => pdf.id === id);
        if (index !== -1) {
          clientStorage.pdfs[index] = { ...clientStorage.pdfs[index], ...data };
          localStorage.setItem('pdfs', JSON.stringify(clientStorage.pdfs));
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
        try {
          // Try the server API first
          const response = await fetch(`/api/pdfs/${id}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            // Fallback to client storage if API fails
            console.info('API request failed, using client storage fallback for deleting PDF');
          }
        } catch (error) {
          console.info('Using client storage fallback for deleting PDF');
        }
        
        // Update client storage regardless of API success
        clientStorage.pdfs = clientStorage.pdfs.filter(pdf => pdf.id !== id);
        localStorage.setItem('pdfs', JSON.stringify(clientStorage.pdfs));
        
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
      const pdfs = await PDFAPI.getAll();
      return pdfs.filter(pdf => pdf.subjectId === subjectId);
    } catch (error) {
      console.error('Error fetching PDFs by subject:', error);
      return [];
    }
  },

  // Get PDFs by semester
  getBySemester: async (semesterId: string): Promise<PDFType[]> => {
    try {
      const pdfs = await PDFAPI.getAll();
      return pdfs.filter(pdf => pdf.semesterId === semesterId);
    } catch (error) {
      console.error('Error fetching PDFs by semester:', error);
      return [];
    }
  }
};
