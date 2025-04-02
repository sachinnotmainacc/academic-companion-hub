
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Check, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSemesterSubjectStore } from "@/hooks/useSemesterSubjectStore";
import { usePdfStore } from "@/hooks/usePdfStore";
import { PDFFormInputs } from "./pdf/PDFFormInputs";
import { PDFFileUpload } from "./pdf/PDFFileUpload";

export const PDFUploader = () => {
  const { semesters, subjects, loading } = useSemesterSubjectStore();
  const { addPdf } = usePdfStore();
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);

  // Update available subjects when semester changes
  useEffect(() => {
    if (selectedSemester) {
      const filteredSubjects = subjects.filter(
        (subject) => subject.semesterId === selectedSemester
      );
      setAvailableSubjects(filteredSubjects);
    } else {
      setAvailableSubjects([]);
    }
    setSelectedSubject("");
  }, [selectedSemester, subjects]);

  const resetForm = () => {
    setTitle("");
    setSelectedFile(null);
    setSelectedSemester("");
    setSelectedSubject("");
    setDescription("");
    setKeywords("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!selectedSemester) {
      toast.error("Please select a semester");
      return;
    }
    
    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }
    
    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }
    
    if (!selectedFile.name.endsWith('.pdf')) {
      toast.error("Only PDF files are allowed");
      return;
    }

    setUploading(true);
    try {
      // Simulated file URL - in a real app, this would come from your storage service
      const fileUrl = `/uploads/${selectedFile.name}`;
      
      // Create keywords array from input
      const keywordsArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      // Use the PDF store hook to add the PDF
      const newPDF = await addPdf({
        title,
        fileName: selectedFile.name,
        fileUrl,
        semesterId: selectedSemester,
        subjectId: selectedSubject,
        description,
        keywords: keywordsArray,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB`
      });
      
      if (newPDF) {
        toast.success("PDF uploaded successfully!");
        resetForm();
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error("Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          <span>Upload PDF Resources</span>
        </h2>
      </div>

      <Card className="border-dark-800 overflow-hidden shadow-lg shadow-dark-900/20">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <PDFFormInputs
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              keywords={keywords}
              setKeywords={setKeywords}
              selectedSemester={selectedSemester}
              setSelectedSemester={setSelectedSemester}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              semesters={semesters}
              availableSubjects={availableSubjects}
            />

            <PDFFileUpload
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Upload PDF
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
