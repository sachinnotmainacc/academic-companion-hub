
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PDFAPI } from '@/services/api';

// Type definitions
export interface PDF {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string; 
  semesterId: string;
  subjectId: string;
  createdAt: number;
  description?: string;
  keywords?: string[];
  size?: string;
}

// Create a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const usePdfStore = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from MongoDB on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // First try to fetch from MongoDB
        const fetchedPDFs = await PDFAPI.getAll();
        
        // If we have data from MongoDB, use it
        if (fetchedPDFs.length > 0) {
          setPdfs(fetchedPDFs);
        } else {
          // No MongoDB data, check localStorage as fallback
          const storedPdfs = localStorage.getItem('pdfs');
          if (storedPdfs) {
            const parsedPdfs = JSON.parse(storedPdfs);
            setPdfs(parsedPdfs);
            
            // Migrate localStorage data to MongoDB
            parsedPdfs.forEach(async (pdf: PDF) => {
              await PDFAPI.add({
                title: pdf.title,
                fileName: pdf.fileName,
                fileUrl: pdf.fileUrl,
                semesterId: pdf.semesterId,
                subjectId: pdf.subjectId
              });
            });
          } else {
            // Add sample PDF data for demonstration
            const samplePdfs: PDF[] = [
              {
                id: generateId(),
                title: 'Sample PDF 1',
                fileName: 'sample1.pdf',
                fileUrl: '#',
                semesterId: 'sem-1', // This should match an existing semester ID
                subjectId: 'sub-1', // This should match an existing subject ID
                createdAt: Date.now(),
              },
              // More samples could be added here
            ];
            setPdfs(samplePdfs);
            
            // Save sample PDFs to MongoDB
            samplePdfs.forEach(async (pdf) => {
              await PDFAPI.add({
                title: pdf.title,
                fileName: pdf.fileName,
                fileUrl: pdf.fileUrl,
                semesterId: pdf.semesterId,
                subjectId: pdf.subjectId
              });
            });
          }
        }
      } catch (error) {
        console.error('Error loading PDFs:', error);
        // Fallback to localStorage
        const storedPdfs = localStorage.getItem('pdfs');
        if (storedPdfs) {
          setPdfs(JSON.parse(storedPdfs));
        } else {
          // Add sample PDF data for demonstration
          const samplePdfs: PDF[] = [
            {
              id: generateId(),
              title: 'Sample PDF 1',
              fileName: 'sample1.pdf',
              fileUrl: '#',
              semesterId: 'sem-1',
              subjectId: 'sub-1',
              createdAt: Date.now(),
            },
          ];
          setPdfs(samplePdfs);
        }
        
        toast.error("Failed to connect to database. Using local storage temporarily.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Still save to localStorage as a backup
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('pdfs', JSON.stringify(pdfs));
    }
  }, [pdfs, loading]);

  // Add a new PDF
  const addPdf = async (pdf: Omit<PDF, 'id' | 'createdAt'>) => {
    try {
      const newPdf = await PDFAPI.add(pdf);
      
      if (newPdf) {
        setPdfs([...pdfs, newPdf]);
        toast.success("PDF added successfully");
        return newPdf;
      }
      
      // Fallback to local if API fails
      const localPdf: PDF = {
        ...pdf,
        id: generateId(),
        createdAt: Date.now(),
      };
      setPdfs([...pdfs, localPdf]);
      toast.success("PDF added successfully (local only)");
      return localPdf;
    } catch (error) {
      console.error("Error adding PDF:", error);
      toast.error("Failed to add PDF to database");
      return null;
    }
  };

  // Update a PDF
  const updatePdf = async (id: string, data: Partial<PDF>) => {
    try {
      const success = await PDFAPI.update(id, data);
      
      if (success) {
        setPdfs(
          pdfs.map((pdf) =>
            pdf.id === id ? { ...pdf, ...data } : pdf
          )
        );
        toast.success("PDF updated successfully");
        return true;
      } else {
        // Fallback to local update
        setPdfs(
          pdfs.map((pdf) =>
            pdf.id === id ? { ...pdf, ...data } : pdf
          )
        );
        toast.success("PDF updated successfully (local only)");
        return true;
      }
    } catch (error) {
      console.error("Error updating PDF:", error);
      toast.error("Failed to update PDF in database");
      return false;
    }
  };

  // Delete a PDF
  const deletePdf = async (id: string) => {
    try {
      const success = await PDFAPI.delete(id);
      
      if (success) {
        setPdfs(pdfs.filter((pdf) => pdf.id !== id));
        toast.success("PDF deleted successfully");
        return true;
      } else {
        // Fallback to local delete
        setPdfs(pdfs.filter((pdf) => pdf.id !== id));
        toast.success("PDF deleted successfully (local only)");
        return true;
      }
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast.error("Failed to delete PDF from database");
      return false;
    }
  };

  // Get PDFs by subject
  const getPdfsBySubject = (subjectId: string) => {
    return pdfs.filter(pdf => pdf.subjectId === subjectId);
  };

  // Get PDFs by semester
  const getPdfsBySemester = (semesterId: string) => {
    return pdfs.filter(pdf => pdf.semesterId === semesterId);
  };

  return {
    pdfs,
    loading,
    addPdf,
    updatePdf,
    deletePdf,
    getPdfsBySubject,
    getPdfsBySemester
  };
};
