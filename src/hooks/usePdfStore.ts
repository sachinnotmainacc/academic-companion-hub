
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Type definitions
export interface PDF {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string; // This would normally be a URL to the file on the server
  semesterId: string;
  subjectId: string;
  createdAt: number;
}

// Create a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const usePdfStore = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
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
          semesterId: 'sem-1', // This should match an existing semester ID
          subjectId: 'sub-1', // This should match an existing subject ID
          createdAt: Date.now(),
        },
        // More samples could be added here
      ];
      setPdfs(samplePdfs);
      localStorage.setItem('pdfs', JSON.stringify(samplePdfs));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('pdfs', JSON.stringify(pdfs));
  }, [pdfs]);

  // Add a new PDF
  const addPdf = (pdf: Omit<PDF, 'id' | 'createdAt'>) => {
    const newPdf: PDF = {
      ...pdf,
      id: generateId(),
      createdAt: Date.now(),
    };
    setPdfs([...pdfs, newPdf]);
    toast.success("PDF added successfully");
    return newPdf;
  };

  // Update a PDF
  const updatePdf = (id: string, data: Partial<PDF>) => {
    setPdfs(
      pdfs.map((pdf) =>
        pdf.id === id ? { ...pdf, ...data } : pdf
      )
    );
    toast.success("PDF updated successfully");
  };

  // Delete a PDF
  const deletePdf = (id: string) => {
    setPdfs(pdfs.filter((pdf) => pdf.id !== id));
    toast.success("PDF deleted successfully");
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
    addPdf,
    updatePdf,
    deletePdf,
    getPdfsBySubject,
    getPdfsBySemester
  };
};
