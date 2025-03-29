
import React, { useState } from "react";
import { PlusCircle, Edit, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the data stores
import { useSemesterSubjectStore, Subject, Semester } from "@/hooks/useSemesterSubjectStore";
import { usePdfStore } from "@/hooks/usePdfStore";

export const SubjectManager = () => {
  const { 
    semesters, 
    subjects, 
    addSubject, 
    addSemester, 
    updateSubject, 
    updateSemester,
    deleteSubject,
    deleteSemester
  } = useSemesterSubjectStore();
  const { pdfs } = usePdfStore();

  // State for subject management
  const [isAddingSemester, setIsAddingSemester] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSemesterName, setNewSemesterName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"subjects" | "semesters">("subjects");

  // State for editing semester
  const [isEditingSemester, setIsEditingSemester] = useState(false);
  const [semesterToEdit, setSemesterToEdit] = useState<Semester | null>(null);
  const [editSemesterName, setEditSemesterName] = useState("");

  // State for editing subject
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [editSubjectSemesterId, setEditSubjectSemesterId] = useState("");

  // Confirmation dialogs state
  const [isSubjectDeleteDialogOpen, setIsSubjectDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);
  const [isSemesterDeleteDialogOpen, setIsSemesterDeleteDialogOpen] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState<string | null>(null);

  const filteredSubjects = subjects.filter(
    (subject) => 
      (selectedSemester ? subject.semesterId === selectedSemester : true) &&
      (filter ? subject.name.toLowerCase().includes(filter.toLowerCase()) : true)
  );

  const handleAddSemester = () => {
    if (!newSemesterName.trim()) {
      toast.error("Semester name cannot be empty");
      return;
    }

    const result = addSemester(newSemesterName);
    if (result) {
      setNewSemesterName("");
      setIsAddingSemester(false);
    }
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      toast.error("Subject name cannot be empty");
      return;
    }

    if (!selectedSemester) {
      toast.error("Please select a semester");
      return;
    }

    const result = addSubject(newSubjectName, selectedSemester);
    if (result) {
      setNewSubjectName("");
      setIsAddingSubject(false);
    }
  };

  const handleOpenEditSemester = (semester: Semester) => {
    setSemesterToEdit(semester);
    setEditSemesterName(semester.name);
    setIsEditingSemester(true);
  };

  const handleUpdateSemester = () => {
    if (!semesterToEdit) return;
    
    if (!editSemesterName.trim()) {
      toast.error("Semester name cannot be empty");
      return;
    }

    const result = updateSemester(semesterToEdit.id, editSemesterName);
    if (result) {
      setIsEditingSemester(false);
      setSemesterToEdit(null);
    }
  };

  const handleOpenEditSubject = (subject: Subject) => {
    setSubjectToEdit(subject);
    setEditSubjectName(subject.name);
    setEditSubjectSemesterId(subject.semesterId);
    setIsEditingSubject(true);
  };

  const handleUpdateSubject = () => {
    if (!subjectToEdit) return;
    
    if (!editSubjectName.trim()) {
      toast.error("Subject name cannot be empty");
      return;
    }

    if (!editSubjectSemesterId) {
      toast.error("Please select a semester");
      return;
    }

    const result = updateSubject(subjectToEdit.id, {
      name: editSubjectName,
      semesterId: editSubjectSemesterId
    });
    
    if (result) {
      setIsEditingSubject(false);
      setSubjectToEdit(null);
    }
  };

  const handleDeleteSubject = (id: string) => {
    // Check if PDFs are associated with this subject
    const hasPdfs = pdfs.some(pdf => pdf.subjectId === id);
    if (hasPdfs) {
      toast.error("Cannot delete subject with associated PDFs");
      return;
    }

    setSubjectToDelete(id);
    setIsSubjectDeleteDialogOpen(true);
  };

  const confirmDeleteSubject = () => {
    if (subjectToDelete) {
      deleteSubject(subjectToDelete);
      setSubjectToDelete(null);
      setIsSubjectDeleteDialogOpen(false);
    }
  };

  const handleDeleteSemester = (id: string) => {
    // Check if subjects are associated with this semester
    const hasSubjects = subjects.some(subject => subject.semesterId === id);
    if (hasSubjects) {
      toast.error("Cannot delete semester with associated subjects");
      return;
    }

    // Check if PDFs are associated with this semester
    const hasPdfs = pdfs.some(pdf => pdf.semesterId === id);
    if (hasPdfs) {
      toast.error("Cannot delete semester with associated PDFs");
      return;
    }

    setSemesterToDelete(id);
    setIsSemesterDeleteDialogOpen(true);
  };

  const confirmDeleteSemester = () => {
    if (semesterToDelete) {
      deleteSemester(semesterToDelete);
      setSemesterToDelete(null);
      setIsSemesterDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Manage {activeTab === "subjects" ? "Subjects" : "Semesters"}</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsAddingSemester(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Semester
          </Button>
          <Button 
            onClick={() => setIsAddingSubject(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "subjects" | "semesters")}>
        <TabsList className="grid grid-cols-2 w-full md:w-60 mb-4">
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="semesters">Semesters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subjects">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="filter-semester" className="mb-2 block">Filter by Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger id="filter-semester">
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
              <Label htmlFor="filter-subject" className="mb-2 block">Search Subject</Label>
              <Input
                id="filter-subject"
                placeholder="Type to search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>

          <Card className="mt-4">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">{subject.name}</TableCell>
                        <TableCell>
                          {semesters.find(sem => sem.id === subject.semesterId)?.name || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleOpenEditSubject(subject)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteSubject(subject.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No subjects found. Add some subjects to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="semesters">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semester Name</TableHead>
                    <TableHead>Subjects Count</TableHead>
                    <TableHead>PDFs Count</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semesters.length > 0 ? (
                    semesters.map((semester) => {
                      const subjectCount = subjects.filter(s => s.semesterId === semester.id).length;
                      const pdfCount = pdfs.filter(p => p.semesterId === semester.id).length;
                      
                      return (
                        <TableRow key={semester.id}>
                          <TableCell className="font-medium">{semester.name}</TableCell>
                          <TableCell>{subjectCount}</TableCell>
                          <TableCell>{pdfCount}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleOpenEditSemester(semester)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteSemester(semester.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No semesters found. Add some semesters to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Semester Dialog */}
      <Dialog open={isAddingSemester} onOpenChange={setIsAddingSemester}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Semester</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="semester-name" className="mb-2 block">Semester Name</Label>
            <Input
              id="semester-name"
              placeholder="e.g. Semester 1"
              value={newSemesterName}
              onChange={(e) => setNewSemesterName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddSemester}>Add Semester</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={isAddingSubject} onOpenChange={setIsAddingSubject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="select-semester" className="mb-2 block">Select Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger id="select-semester">
                  <SelectValue placeholder="Choose a semester" />
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
              <Label htmlFor="subject-name" className="mb-2 block">Subject Name</Label>
              <Input
                id="subject-name"
                placeholder="e.g. Mathematics"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddSubject}>Add Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Semester Dialog */}
      <Dialog open={isEditingSemester} onOpenChange={setIsEditingSemester}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Semester</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="edit-semester-name" className="mb-2 block">Semester Name</Label>
            <Input
              id="edit-semester-name"
              value={editSemesterName}
              onChange={(e) => setEditSemesterName(e.target.value)}
              placeholder="Enter semester name"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateSemester}>Update Semester</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditingSubject} onOpenChange={setIsEditingSubject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-subject-name" className="mb-2 block">Subject Name</Label>
              <Input
                id="edit-subject-name"
                value={editSubjectName}
                onChange={(e) => setEditSubjectName(e.target.value)}
                placeholder="Enter subject name"
              />
            </div>
            <div>
              <Label htmlFor="edit-subject-semester" className="mb-2 block">Semester</Label>
              <Select 
                value={editSubjectSemesterId} 
                onValueChange={setEditSubjectSemesterId}
              >
                <SelectTrigger id="edit-subject-semester">
                  <SelectValue placeholder="Select semester" />
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdateSubject}>Update Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subject Confirmation Dialog */}
      <Dialog open={isSubjectDeleteDialogOpen} onOpenChange={setIsSubjectDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p>Are you sure you want to delete this subject? This action cannot be undone.</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDeleteSubject}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Semester Confirmation Dialog */}
      <Dialog open={isSemesterDeleteDialogOpen} onOpenChange={setIsSemesterDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p>Are you sure you want to delete this semester? This action cannot be undone.</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDeleteSemester}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
