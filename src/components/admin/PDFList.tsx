
import React, { useState } from "react";
import { Download, ExternalLink, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Temporary data store (will be replaced with backend)
import { useSemesterSubjectStore } from "@/hooks/useSemesterSubjectStore";
import { usePdfStore } from "@/hooks/usePdfStore";

export const PDFList = () => {
  const { semesters, subjects } = useSemesterSubjectStore();
  const { pdfs } = usePdfStore();
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubjects = subjects.filter(
    (subject) => selectedSemester ? subject.semesterId === selectedSemester : true
  );

  const filteredPdfs = pdfs.filter((pdf) => {
    const matchesSemester = selectedSemester ? pdf.semesterId === selectedSemester : true;
    const matchesSubject = selectedSubject ? pdf.subjectId === selectedSubject : true;
    const matchesSearch = searchQuery
      ? pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSemester && matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Uploaded PDFs</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="semester-filter" className="mb-2 block">Filter by Semester</Label>
          <Select value={selectedSemester} onValueChange={(value) => {
            setSelectedSemester(value);
            setSelectedSubject(""); // Reset subject when semester changes
          }}>
            <SelectTrigger id="semester-filter">
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Semesters</SelectItem>
              {semesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subject-filter" className="mb-2 block">Filter by Subject</Label>
          <Select 
            value={selectedSubject} 
            onValueChange={setSelectedSubject}
            disabled={!selectedSemester}
          >
            <SelectTrigger id="subject-filter">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Subjects</SelectItem>
              {filteredSubjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="search-pdf" className="mb-2 block">Search PDFs</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-pdf"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPdfs.length > 0 ? (
                filteredPdfs.map((pdf) => (
                  <TableRow key={pdf.id}>
                    <TableCell className="font-medium">{pdf.title}</TableCell>
                    <TableCell>
                      {semesters.find(sem => sem.id === pdf.semesterId)?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {subjects.find(sub => sub.id === pdf.subjectId)?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>{new Date(pdf.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {pdfs.length === 0 
                      ? "No PDFs have been uploaded yet. Upload some PDFs to get started."
                      : "No PDFs match your search criteria. Try adjusting your filters."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
