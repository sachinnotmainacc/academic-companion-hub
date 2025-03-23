import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FolderOpen, FileText, Download, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Mock data for demonstration
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const subjects = {
    1: ["Mathematics I", "Physics I", "Computer Programming", "Engineering Drawing", "English"],
    2: ["Mathematics II", "Physics II", "Chemistry", "Basic Electronics", "Environmental Science"],
    3: ["Data Structures", "Digital Logic", "Computer Architecture", "Discrete Mathematics", "Economics"],
    4: ["Algorithms", "Operating Systems", "Database Management", "Computer Networks", "Theory of Computation"],
    5: ["Software Engineering", "Web Technologies", "Computer Graphics", "Artificial Intelligence", "Information Security"],
    6: ["Compiler Design", "Machine Learning", "Mobile Computing", "Cloud Computing", "Big Data Analytics"],
    7: ["Deep Learning", "Internet of Things", "Blockchain", "Virtual Reality", "Natural Language Processing"],
    8: ["Capstone Project", "Ethics in Computing", "Entrepreneurship", "Technical Writing", "Professional Practice"],
  };

  const notes = [
    {
      id: 1,
      title: "Data Structures Complete Notes",
      description: "Comprehensive notes covering arrays, linked lists, stacks, queues, trees, and graphs",
      semester: 3,
      subject: "Data Structures",
      size: "2.4 MB",
      uploadDate: "May 15, 2023",
      downloads: 358,
    },
    {
      id: 2,
      title: "Operating Systems - Process Management",
      description: "Detailed notes on process scheduling, synchronization, deadlocks, and memory management",
      semester: 4,
      subject: "Operating Systems",
      size: "1.8 MB",
      uploadDate: "March 22, 2023",
      downloads: 275,
    },
    {
      id: 3,
      title: "Database Management Systems",
      description: "Complete guide to DBMS including ER diagrams, normalization, SQL, and transactions",
      semester: 4,
      subject: "Database Management",
      size: "3.2 MB",
      uploadDate: "April 10, 2023",
      downloads: 412,
    },
    {
      id: 4,
      title: "Computer Networks - Fundamentals",
      description: "Notes covering network layers, protocols, addressing, routing, and security concepts",
      semester: 4,
      subject: "Computer Networks",
      size: "2.7 MB",
      uploadDate: "May 5, 2023",
      downloads: 294,
    },
    {
      id: 5,
      title: "Algorithms Analysis and Design",
      description: "Comprehensive guide to algorithm design paradigms, complexity analysis, and optimization",
      semester: 4,
      subject: "Algorithms",
      size: "2.1 MB",
      uploadDate: "February 18, 2023",
      downloads: 325,
    },
    {
      id: 6,
      title: "Digital Logic Design",
      description: "Notes on boolean algebra, logic gates, flip-flops, counters, and digital circuit design",
      semester: 3,
      subject: "Digital Logic",
      size: "1.9 MB",
      uploadDate: "June 7, 2023",
      downloads: 187,
    },
  ];

  // Filter notes based on search and filters
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSemester = selectedSemester ? note.semester === parseInt(selectedSemester) : true;
    const matchesSubject = selectedSubject ? note.subject === selectedSubject : true;
    
    return matchesSearch && matchesSemester && matchesSubject;
  });

  // Get subjects for the selected semester
  const currentSubjects = selectedSemester ? subjects[parseInt(selectedSemester) as keyof typeof subjects] || [] : [];

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Notes <span className="text-blue-500">Repository</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Access and download comprehensive notes organized by semester and subject
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="glass-card rounded-xl p-6 mb-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search for notes..."
                    className="pl-10 bg-dark-800 border-dark-700 text-white placeholder:text-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="bg-dark-800 border-dark-700 text-white">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-800 border-dark-700 text-white">
                    <SelectItem value="">All Semesters</SelectItem>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester.toString()}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select 
                  value={selectedSubject} 
                  onValueChange={setSelectedSubject}
                  disabled={!selectedSemester}
                >
                  <SelectTrigger className="bg-dark-800 border-dark-700 text-white">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-800 border-dark-700 text-white">
                    <SelectItem value="">All Subjects</SelectItem>
                    {currentSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Notes list */}
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="glass-card card-hover border-dark-800 overflow-hidden animate-fade-in-up">
                  <CardHeader className="pb-2 border-b border-dark-800">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Semester {note.semester}</Badge>
                      <Badge variant="outline" className="border-dark-700 text-gray-400">
                        <FileText className="h-3 w-3 mr-1" />
                        {note.size}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-white mt-2">{note.title}</CardTitle>
                    <CardDescription className="text-gray-400">{note.subject}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{note.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {note.uploadDate}
                      </div>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FolderOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">No notes found</h3>
              <p className="text-gray-400">
                Try adjusting your search or filters to find what you're looking for
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Notes;
