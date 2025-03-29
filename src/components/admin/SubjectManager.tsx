
import React, { useState } from "react";
import { PlusCircle, Edit, Trash2, AlertCircle, Layers, BookOpen, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
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
import { Badge } from "@/components/ui/badge";

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
      (selectedSemester && selectedSemester !== "all-semesters" ? subject.semesterId === selectedSemester : true) &&
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
      toast.success("Semester added successfully", {
        description: `"${newSemesterName}" has been created.`
      });
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
      toast.success("Subject added successfully", {
        description: `"${newSubjectName}" has been added to the selected semester.`
      });
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
      toast.success("Semester updated successfully", {
        description: `The semester has been renamed to "${editSemesterName}".`
      });
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
      toast.success("Subject updated successfully", {
        description: `The subject has been updated to "${editSubjectName}".`
      });
    }
  };

  const handleDeleteSubject = (id: string) => {
    // Check if PDFs are associated with this subject
    const hasPdfs = pdfs.some(pdf => pdf.subjectId === id);
    if (hasPdfs) {
      toast.error("Cannot delete subject with associated PDFs", {
        description: "Remove all PDFs linked to this subject first."
      });
      return;
    }

    setSubjectToDelete(id);
    setIsSubjectDeleteDialogOpen(true);
  };

  const confirmDeleteSubject = () => {
    if (subjectToDelete) {
      const subjectName = subjects.find(s => s.id === subjectToDelete)?.name;
      deleteSubject(subjectToDelete);
      setSubjectToDelete(null);
      setIsSubjectDeleteDialogOpen(false);
      toast.success("Subject deleted successfully", {
        description: `"${subjectName}" has been removed from the system.`
      });
    }
  };

  const handleDeleteSemester = (id: string) => {
    // Check if subjects are associated with this semester
    const hasSubjects = subjects.some(subject => subject.semesterId === id);
    if (hasSubjects) {
      toast.error("Cannot delete semester with associated subjects", {
        description: "Remove all subjects linked to this semester first."
      });
      return;
    }

    // Check if PDFs are associated with this semester
    const hasPdfs = pdfs.some(pdf => pdf.semesterId === id);
    if (hasPdfs) {
      toast.error("Cannot delete semester with associated PDFs", {
        description: "Remove all PDFs linked to this semester first."
      });
      return;
    }

    setSemesterToDelete(id);
    setIsSemesterDeleteDialogOpen(true);
  };

  const confirmDeleteSemester = () => {
    if (semesterToDelete) {
      const semesterName = semesters.find(s => s.id === semesterToDelete)?.name;
      deleteSemester(semesterToDelete);
      setSemesterToDelete(null);
      setIsSemesterDeleteDialogOpen(false);
      toast.success("Semester deleted successfully", {
        description: `"${semesterName}" has been removed from the system.`
      });
    }
  };

  // Get subject name by ID
  const getSubjectName = (id: string | null) => {
    if (!id) return null;
    return subjects.find(sub => sub.id === id)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {activeTab === "subjects" ? (
            <>
              <BookOpen className="h-5 w-5 text-blue-500" />
              <span>Manage Subjects</span>
              <Badge className="ml-2 bg-blue-500/80">{subjects.length}</Badge>
            </>
          ) : (
            <>
              <Layers className="h-5 w-5 text-blue-500" />
              <span>Manage Semesters</span>
              <Badge className="ml-2 bg-blue-500/80">{semesters.length}</Badge>
            </>
          )}
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsAddingSemester(true)}
            className="bg-dark-800 border-dark-700 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition-all duration-200"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Semester
          </Button>
          <Button 
            onClick={() => setIsAddingSubject(true)}
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "subjects" | "semesters")}>
        <TabsList className="grid grid-cols-2 w-full md:w-60 mb-4 bg-dark-800 border border-dark-700 p-1">
          <TabsTrigger 
            value="subjects" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-none text-gray-300"
          >
            Subjects
          </TabsTrigger>
          <TabsTrigger 
            value="semesters" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-none text-gray-300"
          >
            Semesters
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="subjects" className="animate-fade-in">
          <Card className="border-dark-800 overflow-hidden shadow-lg shadow-dark-900/20">
            <CardHeader className="bg-dark-900 border-b border-dark-800 pb-4">
              <CardTitle className="text-lg text-white">Filter Subjects</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="filter-semester" className="mb-2 block text-gray-300 text-sm">Filter by Semester</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger id="filter-semester" className="bg-dark-800 border-dark-700 focus:ring-blue-500 h-10">
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
                  <Label htmlFor="filter-subject" className="mb-2 block text-gray-300 text-sm">Search Subject</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="filter-subject"
                      placeholder="Type to search..."
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="pl-10 bg-dark-800 border-dark-700 focus-visible:ring-blue-500 h-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4 border-dark-800 overflow-hidden shadow-lg shadow-dark-900/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-dark-800/50">
                    <TableHead className="font-medium text-gray-300">Subject Name</TableHead>
                    <TableHead className="font-medium text-gray-300">Semester</TableHead>
                    <TableHead className="w-[100px] font-medium text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject) => (
                      <TableRow key={subject.id} className="hover:bg-dark-800/50 border-dark-800 transition-colors">
                        <TableCell className="font-medium text-white">{subject.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                            {semesters.find(sem => sem.id === subject.semesterId)?.name || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                              onClick={() => handleOpenEditSubject(subject)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:bg-red-500/10 transition-colors"
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
                      <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                        No subjects found. Add some subjects to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="semesters" className="animate-fade-in">
          <Card className="border-dark-800 overflow-hidden shadow-lg shadow-dark-900/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-dark-800/50">
                    <TableHead className="font-medium text-gray-300">Semester Name</TableHead>
                    <TableHead className="font-medium text-gray-300">Subjects Count</TableHead>
                    <TableHead className="font-medium text-gray-300">PDFs Count</TableHead>
                    <TableHead className="w-[100px] font-medium text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {semesters.length > 0 ? (
                    semesters.map((semester) => {
                      const subjectCount = subjects.filter(s => s.semesterId === semester.id).length;
                      const pdfCount = pdfs.filter(p => p.semesterId === semester.id).length;
                      
                      return (
                        <TableRow key={semester.id} className="hover:bg-dark-800/50 border-dark-800 transition-colors">
                          <TableCell className="font-medium text-white">{semester.name}</TableCell>
                          <TableCell>
                            <Badge className="bg-purple-500/10 text-purple-400 border-none">
                              {subjectCount}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-500/10 text-blue-400 border-none">
                              {pdfCount}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                                onClick={() => handleOpenEditSemester(semester)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:bg-red-500/10 transition-colors"
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
                      <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
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
        <DialogContent className="bg-dark-900 border-dark-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-500" /> Add New Semester
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new semester for organizing subjects and PDFs.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="semester-name" className="mb-2 block text-gray-300 text-sm">Semester Name</Label>
            <Input
              id="semester-name"
              placeholder="e.g. Semester 1"
              value={newSemesterName}
              onChange={(e) => setNewSemesterName(e.target.value)}
              className="bg-dark-800 border-dark-700 focus-visible:ring-blue-500"
            />
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
              onClick={handleAddSemester}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Semester
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={isAddingSubject} onOpenChange={setIsAddingSubject}>
        <DialogContent className="bg-dark-900 border-dark-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-500" /> Add New Subject
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new subject and assign it to a semester.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="select-semester" className="mb-2 block text-gray-300 text-sm">Select Semester</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger id="select-semester" className="bg-dark-800 border-dark-700 focus:ring-blue-500">
                  <SelectValue placeholder="Choose a semester" />
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
              <Label htmlFor="subject-name" className="mb-2 block text-gray-300 text-sm">Subject Name</Label>
              <Input
                id="subject-name"
                placeholder="e.g. Mathematics"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="bg-dark-800 border-dark-700 focus-visible:ring-blue-500"
              />
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
              onClick={handleAddSubject}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!selectedSemester}
            >
              Add Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Semester Dialog */}
      <Dialog open={isEditingSemester} onOpenChange={setIsEditingSemester}>
        <DialogContent className="bg-dark-900 border-dark-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" /> Edit Semester
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="edit-semester-name" className="mb-2 block text-gray-300 text-sm">Semester Name</Label>
            <Input
              id="edit-semester-name"
              value={editSemesterName}
              onChange={(e) => setEditSemesterName(e.target.value)}
              placeholder="Enter semester name"
              className="bg-dark-800 border-dark-700 focus-visible:ring-blue-500"
            />
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
              onClick={handleUpdateSemester}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update Semester
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditingSubject} onOpenChange={setIsEditingSubject}>
        <DialogContent className="bg-dark-900 border-dark-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-500" /> Edit Subject
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-subject-name" className="mb-2 block text-gray-300 text-sm">Subject Name</Label>
              <Input
                id="edit-subject-name"
                value={editSubjectName}
                onChange={(e) => setEditSubjectName(e.target.value)}
                placeholder="Enter subject name"
                className="bg-dark-800 border-dark-700 focus-visible:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="edit-subject-semester" className="mb-2 block text-gray-300 text-sm">Semester</Label>
              <Select 
                value={editSubjectSemesterId} 
                onValueChange={setEditSubjectSemesterId}
              >
                <SelectTrigger id="edit-subject-semester" className="bg-dark-800 border-dark-700 focus:ring-blue-500">
                  <SelectValue placeholder="Select semester" />
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
              onClick={handleUpdateSubject}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subject Confirmation Dialog */}
      <Dialog open={isSubjectDeleteDialogOpen} onOpenChange={setIsSubjectDeleteDialogOpen}>
        <DialogContent className="bg-dark-900 border-dark-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" /> Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-start space-x-3 text-amber-500">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p>Are you sure you want to delete this subject?</p>
                {subjectToDelete && (
                  <p className="mt-2 font-medium text-white">"{getSubjectName(subjectToDelete)}"</p>
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
              onClick={confirmDeleteSubject}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Semester Confirmation Dialog */}
      <Dialog open={isSemesterDeleteDialogOpen} onOpenChange={setIsSemesterDeleteDialogOpen}>
        <DialogContent className="bg-dark-900 border-dark-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" /> Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-start space-x-3 text-amber-500">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p>Are you sure you want to delete this semester?</p>
                {semesterToDelete && (
                  <p className="mt-2 font-medium text-white">
                    "{semesters.find(s => s.id === semesterToDelete)?.name}"
                  </p>
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
              onClick={confirmDeleteSemester}
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
