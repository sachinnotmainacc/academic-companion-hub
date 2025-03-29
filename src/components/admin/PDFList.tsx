
import React, { useState } from "react";
import { Download, ExternalLink, Search, Trash2, Edit, AlertCircle, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";

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
    const matchesSemester = selectedSemester && selectedSemester !== "all-semesters" ? pdf.semesterId === selectedSemester : true;
    const matchesSubject = selectedSubject && selectedSubject !== "all-subjects" ? pdf.subjectId === selectedSubject : true;
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
    toast.success("PDF updated successfully", {
      description: "Your changes have been saved."
    });
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
      toast.success("PDF deleted successfully", {
        description: "The PDF has been removed from the system."
      });
    }
  };

  // Get PDF details by ID
  const getPdfById = (id: string | null) => {
    if (!id) return null;
    return pdfs.find(pdf => pdf.id === id);
  };

  // Get semester name by ID
  const getSemesterName = (id: string) => {
    const semester = semesters.find(sem => sem.id === id);
    return semester ? semester.name : 'Unknown';
  };

  // Get subject name by ID
  const getSubjectName = (id: string) => {
    const subject = subjects.find(sub => sub.id === id);
    return subject ? subject.name : 'Unknown';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold mb-2 sm:mb-0 text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <span>Manage PDFs</span>
          <Badge className="ml-2 bg-blue-500/80">{pdfs.length}</Badge>
        </h2>
      </div>

      <Card className="border-dark-800 overflow-hidden shadow-lg shadow-dark-900/20">
        <CardHeader className="bg-dark-900 border-b border-dark-800 pb-3">
          <CardTitle className="text-lg text-white">Filter Resources</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="semester-filter" className="mb-2 block text-gray-300 text-sm">Filter by Semester</Label>
              <Select value={selectedSemester} onValueChange={(value) => {
                setSelectedSemester(value);
                setSelectedSubject(""); // Reset subject when semester changes
              }}>
                <SelectTrigger id="semester-filter" className="bg-dark-800 border-dark-700 focus:ring-blue-500 h-10">
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent className="bg-dark-800 border-dark-700">
                  <SelectItem value="all-semesters">All Semesters</SelectItem>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject-filter" className="mb-2 block text-gray-300 text-sm">Filter by Subject</Label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={!selectedSemester || selectedSemester === "all-semesters"}
              >
                <SelectTrigger id="subject-filter" className="bg-dark-800 border-dark-700 focus:ring-blue-500 h-10">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent className="bg-dark-800 border-dark-700">
                  <SelectItem value="all-subjects">All Subjects</SelectItem>
                  {filteredSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search-pdf" className="mb-2 block text-gray-300 text-sm">Search PDFs</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-pdf"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-dark-800 border-dark-700 focus-visible:ring-blue-500 h-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-dark-800 overflow-hidden shadow-lg shadow-dark-900/20">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-dark-800/50">
                <TableHead className="font-medium text-gray-300">File Name</TableHead>
                <TableHead className="font-medium text-gray-300">Semester</TableHead>
                <TableHead className="font-medium text-gray-300">Subject</TableHead>
                <TableHead className="font-medium text-gray-300">Date Added</TableHead>
                <TableHead className="w-[150px] font-medium text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPdfs.length > 0 ? (
                filteredPdfs.map((pdf) => (
                  <TableRow key={pdf.id} className="hover:bg-dark-800/50 border-dark-800 transition-colors">
                    <TableCell className="font-medium text-white">{pdf.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {getSemesterName(pdf.semesterId)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                        {getSubjectName(pdf.subjectId)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">{new Date(pdf.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-400 transition-colors">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-400 transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-500 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                          onClick={() => handleOpenEditDialog(pdf)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-red-500/10 transition-colors"
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
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
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
        <DialogContent className="bg-dark-900 border-dark-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" /> Edit PDF
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-title" className="mb-2 block text-gray-300 text-sm">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter PDF title"
                className="bg-dark-800 border-dark-700 focus-visible:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="edit-semester" className="mb-2 block text-gray-300 text-sm">Semester</Label>
              <Select value={editSemesterId} onValueChange={(value) => {
                setEditSemesterId(value);
                setEditSubjectId(""); // Reset subject when semester changes
              }}>
                <SelectTrigger id="edit-semester" className="bg-dark-800 border-dark-700 focus:ring-blue-500">
                  <SelectValue placeholder="Select Semester" />
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
              <Label htmlFor="edit-subject" className="mb-2 block text-gray-300 text-sm">Subject</Label>
              <Select 
                value={editSubjectId} 
                onValueChange={setEditSubjectId}
                disabled={!editSemesterId}
              >
                <SelectTrigger id="edit-subject" className="bg-dark-800 border-dark-700 focus:ring-blue-500">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent className="bg-dark-800 border-dark-700">
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
              <Button 
                variant="outline" 
                className="border-dark-700 text-gray-400 hover:text-white hover:bg-dark-800"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleUpdatePdf}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete PDF Confirmation Dialog */}
      <Dialog open={isPdfDeleteDialogOpen} onOpenChange={setIsPdfDeleteDialogOpen}>
        <DialogContent className="bg-dark-900 border-dark-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" /> Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p>Are you sure you want to delete this PDF?</p>
                {pdfToDelete && (
                  <p className="mt-2 font-medium text-white">"{getPdfById(pdfToDelete)?.title}"</p>
                )}
                <p className="mt-2 text-sm text-gray-400">This action cannot be undone.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                className="border-dark-700 text-gray-400 hover:text-white hover:bg-dark-800"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={confirmDeletePdf}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
