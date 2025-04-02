
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Semester, Subject } from "@/hooks/useSemesterSubjectStore";

interface PDFFormInputsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  keywords: string;
  setKeywords: (keywords: string) => void;
  selectedSemester: string;
  setSelectedSemester: (semesterId: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subjectId: string) => void;
  semesters: Semester[];
  availableSubjects: Subject[];
}

export const PDFFormInputs: React.FC<PDFFormInputsProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  keywords,
  setKeywords,
  selectedSemester,
  setSelectedSemester,
  selectedSubject,
  setSelectedSubject,
  semesters,
  availableSubjects,
}) => {
  return (
    <>
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
    </>
  );
};
