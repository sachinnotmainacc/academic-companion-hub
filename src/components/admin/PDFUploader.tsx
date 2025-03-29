
import React, { useState } from "react";
import { Upload, File, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import the data stores
import { useSemesterSubjectStore } from "@/hooks/useSemesterSubjectStore";
import { usePdfStore } from "@/hooks/usePdfStore";

export const PDFUploader = () => {
  const { semesters, subjects } = useSemesterSubjectStore();
  const { addPdf } = usePdfStore();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [title, setTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const filteredSubjects = subjects.filter(
    (subject) => subject.semesterId === selectedSemester
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File size should be less than 10MB");
      return;
    }
    
    setSelectedFile(file);
    // If title is empty, use the file name without extension
    if (!title) {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);
    }
    toast.success("File selected successfully");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file");
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

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    // In a real app, you would upload the file to a server here
    // For now, we'll just create a URL for demo purposes
    const fileUrl = URL.createObjectURL(selectedFile);
    
    // Add the PDF to our local store
    addPdf({
      title: title,
      fileName: selectedFile.name,
      fileUrl: fileUrl,
      semesterId: selectedSemester,
      subjectId: selectedSubject
    });
    
    // Reset form
    setSelectedFile(null);
    setTitle("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Upload PDF Resources</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={selectedSemester} onValueChange={(value) => {
                setSelectedSemester(value);
                setSelectedSubject(""); // Reset subject when semester changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={!selectedSemester}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSemester && filteredSubjects.length === 0 && (
                <p className="text-xs text-amber-500 mt-1">
                  No subjects found for this semester. Please add subjects first.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="Enter document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div>
          <Label className="mb-2 block">Upload PDF</Label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border"
            } ${selectedFile ? "bg-muted/50" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <div className="text-center py-8">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Drag & Drop PDF here</p>
                <p className="text-sm text-muted-foreground mb-4">or</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Browse Files
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-background rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded">
                    <File className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !selectedSemester || !selectedSubject || !title}
            >
              Upload PDF
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center gap-3 text-sm">
        <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
        <p>
          PDF files will be temporarily stored in browser until the backend is connected. 
          This is just for UI demonstration.
        </p>
      </div>
    </div>
  );
};
