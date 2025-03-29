
import React, { useState } from "react";
import { Download, ExternalLink, Search, Trash2, Edit, AlertCircle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

// Import the data stores
import { useSemesterSubjectStore } from "@/hooks/useSemesterSubjectStore";
import { usePdfStore, PDF } from "@/hooks/usePdfStore";
import { toast } from "sonner";

export const PDFList = () => {
  const { semesters, subjects } = useSemesterSubjectStore();
  const { pdfs, deletePdf, updatePdf } = usePdfStore();
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Edit PDF state
  const [isEditingPdf, setIsEditingPdf] = useState(false);
  const [pdfToEdit, setPdfToEdit] = useState<PDF | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSemesterId, setEditSemesterId] = useState("");
  const [editSubjectId, setEditSubjectId] = useState("");

  // Confirmation dialog state
  const [isPdfDeleteDialogOpen, setIsPdfDeleteDialogOpen] = useState(false);
  const [pdfToDelete, setPdfToDelete] = useState<string | null>(null);

  const filteredSubjects = subjects.filter(
    (subject) => selectedSemester ? subject.semesterId === selectedSemester : true
  );

  const editSubjects = subjects.filter(
    (subject) => editSemesterId ? subject.semesterId === editSemesterId : true
  );

  const filteredPdfs = pdfs.filter((pdf) => {
    const matchesSemester = selectedSemester ? pdf.semesterId === selectedSemester : true;
    const matchesSubject = selectedSubject ? pdf.subjectId === selectedSubject : true;
    const matchesSearch = searchQuery
      ? pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSemester && matchesSubject && matchesSearch;
  });

  const handleOpenEditDialog = (pdf: PDF) => {
    setPdfToEdit(pdf);
    setEditTitle(pdf.title);
    setEditSemesterId(pdf.semesterId);
    setEditSubjectId(pdf.subjectId);
    setIsEditingPdf(true);
  };

  const handleUpdatePdf = () => {
    if (!pdfToEdit) return;
    
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    if (!editSemesterId) {
      toast.error("Please select a semester");
      return;
    }

    if (!editSubjectId) {
      toast.error("Please select a subject");
      return;
    }

    updatePdf(pdfToEdit.id, {
      title: editTitle,
      semesterId: editSemesterId,
      subjectId: editSubjectId
    });

    setIsEditingPdf(false);
    setPdfToEdit(null);
  };

  const handleDeletePdf = (id: string) => {
    setPdfToDelete(id);
    setIsPdfDeleteDialogOpen(true);
  };

  const confirmDeletePdf = () => {
    if (pdfToDelete) {
      deletePdf(pdfToDelete);
      setPdfToDelete(null);
      setIsPdfDeleteDialogOpen(false);
    }
  };

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
                <TableHead className="w-[150px]">Actions</TableHead>
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-500"
                          onClick={() => handleOpenEditDialog(pdf)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeletePdf(pdf.id)}
                        >
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

      {/* Edit PDF Dialog */}
      <Dialog open={isEditingPdf} onOpenChange={setIsEditingPdf}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit PDF</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-title" className="mb-2 block">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter PDF title"
              />
            </div>
            <div>
              <Label htmlFor="edit-semester" className="mb-2 block">Semester</Label>
              <Select value={editSemesterId} onValueChange={(value) => {
                setEditSemesterId(value);
                setEditSubjectId(""); // Reset subject when semester changes
              }}>
                <SelectTrigger id="edit-semester">
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
            <div>
              <Label htmlFor="edit-subject" className="mb-2 block">Subject</Label>
              <Select 
                value={editSubjectId} 
                onValueChange={setEditSubjectId}
                disabled={!editSemesterId}
              >
                <SelectTrigger id="edit-subject">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {editSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdatePdf}>Update PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete PDF Confirmation Dialog */}
      <Dialog open={isPdfDeleteDialogOpen} onOpenChange={setIsPdfDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p>Are you sure you want to delete this PDF? This action cannot be undone.</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDeletePdf}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
