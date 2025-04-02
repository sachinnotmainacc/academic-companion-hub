
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Check, X, Upload, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useSemesterSubjectStore } from "@/hooks/useSemesterSubjectStore";
import { usePdfStore } from "@/hooks/usePdfStore"; // Import the PDF store hook

export const PDFUploader = () => {
  const { semesters, subjects, loading } = useSemesterSubjectStore();
  const { addPdf } = usePdfStore(); // Use the PDF store hook for adding PDFs
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSelectedFile(null);
    setSelectedSemester("");
    setSelectedSubject("");
    setDescription("");
    setKeywords("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="mb-2 block text-gray-300 text-sm">PDF Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Module 1: Introduction"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-dark-800 border-dark-700 focus-visible:ring-primary"
                />
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block text-gray-300 text-sm">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Brief description of the content"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-dark-800 border-dark-700 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="semester" className="mb-2 block text-gray-300 text-sm">Semester</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger id="semester" className="bg-dark-800 border-dark-700 focus:ring-primary h-10">
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-800 border-dark-700">
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject" className="mb-2 block text-gray-300 text-sm">Subject</Label>
                <Select 
                  value={selectedSubject} 
                  onValueChange={setSelectedSubject} 
                  disabled={!selectedSemester}
                >
                  <SelectTrigger id="subject" className="bg-dark-800 border-dark-700 focus:ring-primary h-10">
                    <SelectValue placeholder={selectedSemester ? "Select a subject" : "First select a semester"} />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-800 border-dark-700">
                    {availableSubjects.length > 0 ? (
                      availableSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-gray-500">
                        {selectedSemester ? "No subjects in this semester" : "Select a semester first"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="keywords" className="mb-2 block text-gray-300 text-sm">Keywords (Optional, comma separated)</Label>
              <Input
                id="keywords"
                placeholder="e.g. theory, module 1, introduction"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="bg-dark-800 border-dark-700 focus-visible:ring-primary"
              />
              <p className="mt-1 text-xs text-gray-400">These keywords help with searching and categorization</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="mb-2 block text-gray-300 text-sm">PDF File</Label>
              <div className="flex items-center gap-3">
                <label className="flex-1">
                  <div className="relative cursor-pointer bg-dark-800 border border-dashed border-dark-600 rounded-md p-6 text-center hover:bg-dark-700/50 transition-colors">
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <File className="h-6 w-6 text-green-500" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-white truncate max-w-[300px]">{selectedFile.name}</p>
                          <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-auto text-gray-400 hover:text-white hover:bg-dark-600"
                          onClick={() => setSelectedFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <Upload className="h-10 w-10 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-blue-500">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PDF files only (Max 10MB)</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      id="file"
                      type="file"
                      accept=".pdf"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </div>
                </label>
              </div>
            </div>

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
