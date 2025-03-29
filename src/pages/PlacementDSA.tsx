
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useCSVQuestions } from "@/hooks/use-csv-questions";
import MainLayout from "@/components/layout/MainLayout";
import {
  BookOpen,
  Building,
  Calendar,
  ChevronRight,
  Code,
  Filter,
  Search,
  Star,
  Timer,
  TrendingUp,
  AlignLeft,
  ExternalLink,
  Briefcase,
  Tag,
  BarChart2,
  RefreshCcw
} from "lucide-react";

const PlacementDSA = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [company, setCompany] = useState("google");
  const [timeRange, setTimeRange] = useState("alltime");
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);

  // Fix the timeRange type to match what's expected by useCSVQuestions
  const { questions, isLoading, error } = useCSVQuestions(company, timeRange as "All Time" | "6 Months" | "1 Year" | "2 Years");
  
  const companies = [
    { id: "google", name: "Google" },
    { id: "amazon", name: "Amazon" },
    { id: "facebook", name: "Facebook" },
    { id: "microsoft", name: "Microsoft" },
    { id: "apple", name: "Apple" },
    { id: "netflix", name: "Netflix" },
    { id: "uber", name: "Uber" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "airbnb", name: "Airbnb" },
    { id: "twitter", name: "Twitter" },
  ];

  const timeRanges = [
    { id: "6months", name: "Last 6 Months" },
    { id: "1year", name: "Last 1 Year" },
    { id: "2year", name: "Last 2 Years" },
    { id: "alltime", name: "All Time" },
  ];

  // Update when questions change
  useEffect(() => {
    if (!questions) {
      setFilteredQuestions([]);
      return;
    }
    
    setFilteredQuestions(questions);
  }, [questions]);

  // Filter questions based on search term
  useEffect(() => {
    if (!questions) {
      setFilteredQuestions([]);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredQuestions(questions);
      return;
    }

    const filtered = questions.filter((question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuestions(filtered);
  }, [searchTerm, questions]);

  // Difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-500 border-amber-500/30";
      case "hard":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
    }
  };

  // Animate list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Map from UI time ranges to API time ranges
  const mapTimeRangeToAPI = (uiTimeRange) => {
    switch (uiTimeRange) {
      case "6months":
        return "6 Months";
      case "1year":
        return "1 Year";
      case "2year":
        return "2 Years";
      case "alltime":
      default:
        return "All Time";
    }
  };

  return (
    <MainLayout>
      <div className="page-container animate-fade-in">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                DSA by Company
              </h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" />
                Curated coding questions from top tech companies
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Star className="h-4 w-4 text-amber-400" />
                <span>Favorites</span>
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <RefreshCcw className="h-4 w-4 text-blue-500" />
                <span>Refresh Data</span>
              </Button>
            </div>
          </div>

          <Card className="border-dark-800 shadow-lg shadow-dark-900/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5 text-gray-300">
                    <Building className="h-4 w-4 text-blue-500" />
                    Select Company
                  </label>
                  <Select defaultValue={company} onValueChange={setCompany}>
                    <SelectTrigger className="bg-dark-800 border-dark-700 focus:ring-blue-500">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-800 border-dark-700">
                      {companies.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5 text-gray-300">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Time Range
                  </label>
                  <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="bg-dark-800 border-dark-700 focus:ring-blue-500">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-800 border-dark-700">
                      {timeRanges.map((tr) => (
                        <SelectItem key={tr.id} value={tr.id}>
                          {tr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5 text-gray-300">
                    <Search className="h-4 w-4 text-blue-500" />
                    Search Questions
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by question name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-dark-800 border-dark-700 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </header>

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-1">
            <Card className="border-dark-800 shadow-lg shadow-dark-900/20 overflow-hidden sticky top-20">
              <CardHeader className="border-b border-dark-800 p-4">
                <CardTitle className="text-md flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-500" /> 
                  Quick Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="difficulty" className="w-full">
                  <TabsList className="grid grid-cols-2 bg-dark-900 border-b border-dark-800">
                    <TabsTrigger value="difficulty" className="data-[state=active]:bg-dark-800">Difficulty</TabsTrigger>
                    <TabsTrigger value="topic" className="data-[state=active]:bg-dark-800">Topic</TabsTrigger>
                  </TabsList>
                  <TabsContent value="difficulty" className="p-4 space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start border-green-500/20 text-green-500 hover:bg-green-500/10 hover:text-green-400">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Easy
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start border-amber-500/20 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                      Medium
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400">
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                      Hard
                    </Button>
                  </TabsContent>
                  <TabsContent value="topic" className="p-4 space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start text-blue-500 hover:bg-blue-500/10 hover:text-blue-400">
                      <Tag className="h-3.5 w-3.5 mr-2" />
                      Arrays
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-blue-500 hover:bg-blue-500/10 hover:text-blue-400">
                      <Tag className="h-3.5 w-3.5 mr-2" />
                      Linked Lists
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-blue-500 hover:bg-blue-500/10 hover:text-blue-400">
                      <Tag className="h-3.5 w-3.5 mr-2" />
                      Trees
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-blue-500 hover:bg-blue-500/10 hover:text-blue-400">
                      <Tag className="h-3.5 w-3.5 mr-2" />
                      Dynamic Programming
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-blue-500 hover:bg-blue-500/10 hover:text-blue-400">
                      <Tag className="h-3.5 w-3.5 mr-2" />
                      Graphs
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <div className="p-4 border-t border-dark-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Questions</span>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                    {filteredQuestions?.length || 0}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-4">
            <Card className="border-dark-800 shadow-lg shadow-dark-900/20 overflow-hidden">
              <CardHeader className="border-b border-dark-800 p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Code className="h-4 w-4 text-blue-500" />
                    {companies.find(c => c.id === company)?.name || "Company"} Questions
                    <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-400">
                      {filteredQuestions?.length || 0}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Timer className="h-3.5 w-3.5 mr-1.5" />
                      {timeRanges.find(tr => tr.id === timeRange)?.name}
                    </span>
                    <Separator orientation="vertical" className="h-4 bg-dark-700" />
                    <span className="text-sm text-muted-foreground flex items-center">
                      <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                      Frequency
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="animate-spin h-12 w-12 text-blue-500 mb-4">
                      <RefreshCcw className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Loading questions...</h3>
                    <p className="text-center text-muted-foreground max-w-md">
                      Please wait while we fetch the questions for {companies.find(c => c.id === company)?.name}.
                    </p>
                  </div>
                ) : error || !filteredQuestions.length ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <BookOpen className="h-12 w-12 text-blue-500/30 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No questions found</h3>
                    <p className="text-center text-muted-foreground max-w-md">
                      {error || "We couldn't find any questions for this company and time range. Try selecting a different company or time range."}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-400px)]">
                    <motion.div 
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      <Table>
                        <TableHeader className="bg-dark-900/50">
                          <TableRow>
                            <TableHead className="w-[50%]">Question</TableHead>
                            <TableHead className="w-[20%]">Difficulty</TableHead>
                            <TableHead className="w-[15%]">Frequency</TableHead>
                            <TableHead className="w-[15%] text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredQuestions.map((question, index) => (
                            <motion.tr
                              key={index}
                              variants={item}
                              className="border-b border-dark-800 group hover:bg-dark-800/50 transition-colors duration-200"
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <div className={`h-2 w-2 rounded-full ${
                                    question.difficulty?.toLowerCase() === 'easy' ? 'bg-green-500' :
                                    question.difficulty?.toLowerCase() === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                                  }`}></div>
                                  <a 
                                    href={question.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-blue-400 transition-colors group-hover:underline flex items-center"
                                  >
                                    {question.title}
                                    <ExternalLink className="h-3.5 w-3.5 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </a>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={getDifficultyColor(question.difficulty)}
                                >
                                  {question.difficulty}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <BarChart2 className="h-4 w-4 text-blue-500" />
                                  <span className="text-blue-400">{question.frequency > 0 ? question.frequency.toFixed(2) : 'Low'}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-dark-700">
                                    <Star className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-dark-700">
                                    <AlignLeft className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                                    asChild
                                  >
                                    <a href={question.link} target="_blank" rel="noopener noreferrer">
                                      <ChevronRight className="h-4 w-4" />
                                    </a>
                                  </Button>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </motion.div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PlacementDSA;
