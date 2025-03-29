
import React, { useState } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
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

// Temporary data store (will be replaced with backend)
import { useSemesterSubjectStore } from "@/hooks/useSemesterSubjectStore";

export const SubjectManager = () => {
  const { semesters, subjects, addSubject, addSemester } = useSemesterSubjectStore();
  const [isAddingSemester, setIsAddingSemester] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSemesterName, setNewSemesterName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [filter, setFilter] = useState("");

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

    const semesterExists = semesters.some(
      (sem) => sem.name.toLowerCase() === newSemesterName.toLowerCase()
    );

    if (semesterExists) {
      toast.error("Semester already exists");
      return;
    }

    addSemester(newSemesterName);
    setNewSemesterName("");
    setIsAddingSemester(false);
    toast.success("Semester added successfully");
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

    const subjectExists = subjects.some(
      (sub) => 
        sub.name.toLowerCase() === newSubjectName.toLowerCase() &&
        sub.semesterId === selectedSemester
    );

    if (subjectExists) {
      toast.error("Subject already exists in this semester");
      return;
    }

    addSubject(newSubjectName, selectedSemester);
    setNewSubjectName("");
    setIsAddingSubject(false);
    toast.success("Subject added successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Manage Subjects</h2>
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

      <Card>
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
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
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No subjects found. Add some subjects to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
    </div>
  );
};
