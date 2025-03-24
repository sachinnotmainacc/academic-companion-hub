
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, BookOpen, Percent, Check, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const InternalMarks = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("internal");

  // Internal mark calculator state
  const [attendance, setAttendance] = useState("");
  const [assignment, setAssignment] = useState("");
  const [series1, setSeries1] = useState("");
  const [series2, setSeries2] = useState("");
  const [internalMarks, setInternalMarks] = useState<number | null>(null);
  
  // SEE calculator state
  const [internal, setInternal] = useState("");
  const [targetGrade, setTargetGrade] = useState("S");
  const [seeMarks, setSeeMarks] = useState<number | null>(null);
  const [gradeDetails, setGradeDetails] = useState<{
    grade: string;
    points: number;
    marks: number;
    finalMarks: number;
  }[]>([]);

  // Grade calculation
  const calculateInternalMarks = () => {
    const attendanceVal = parseFloat(attendance);
    const assignmentVal = parseFloat(assignment);
    const series1Val = parseFloat(series1);
    const series2Val = parseFloat(series2);

    if (isNaN(attendanceVal) || isNaN(assignmentVal) || isNaN(series1Val) || isNaN(series2Val)) {
      toast({
        title: "Input Error",
        description: "Please fill all fields with valid numbers",
        variant: "destructive",
      });
      return;
    }

    if (
      attendanceVal < 0 || attendanceVal > 100 ||
      assignmentVal < 0 || assignmentVal > 20 ||
      series1Val < 0 || series1Val > 50 ||
      series2Val < 0 || series2Val > 50
    ) {
      toast({
        title: "Input Error",
        description: "Please enter values within the valid range",
        variant: "destructive",
      });
      return;
    }

    // Calculate attendance marks (max 10)
    let attendanceMarks = 0;
    if (attendanceVal >= 90) {
      attendanceMarks = 10;
    } else if (attendanceVal >= 85) {
      attendanceMarks = 9;
    } else if (attendanceVal >= 80) {
      attendanceMarks = 8;
    } else if (attendanceVal >= 75) {
      attendanceMarks = 7;
    } else if (attendanceVal >= 70) {
      attendanceMarks = 6;
    } else if (attendanceVal >= 65) {
      attendanceMarks = 5;
    } else if (attendanceVal >= 60) {
      attendanceMarks = 4;
    } else if (attendanceVal >= 55) {
      attendanceMarks = 3;
    } else if (attendanceVal >= 50) {
      attendanceMarks = 2;
    } else if (attendanceVal >= 45) {
      attendanceMarks = 1;
    }

    // Assignment marks (max 10)
    let assignmentMarks = (assignmentVal / 20) * 10;
    if (assignmentMarks > 10) assignmentMarks = 10;

    // Series tests (max 30)
    let seriesMarks = ((series1Val + series2Val) / 100) * 30;
    if (seriesMarks > 30) seriesMarks = 30;

    // Total internal marks (out of 50)
    const totalInternalMarks = attendanceMarks + assignmentMarks + seriesMarks;
    setInternalMarks(Math.round(totalInternalMarks));

    toast({
      title: "Calculation Complete",
      description: `Your internal marks are ${Math.round(totalInternalMarks)} out of 50`,
    });
  };

  const calculateSEEMarks = () => {
    const internalVal = parseFloat(internal);

    if (isNaN(internalVal)) {
      toast({
        title: "Input Error",
        description: "Please enter your internal marks",
        variant: "destructive",
      });
      return;
    }

    if (internalVal < 0 || internalVal > 50) {
      toast({
        title: "Input Error",
        description: "Internal marks should be between a 0 and 50",
        variant: "destructive",
      });
      return;
    }

    // Define grade ranges
    const grades = [
      { grade: "S", points: 10, minTotal: 90 },
      { grade: "A+", points: 9, minTotal: 85 },
      { grade: "A", points: 8.5, minTotal: 80 },
      { grade: "B+", points: 8, minTotal: 75 },
      { grade: "B", points: 7, minTotal: 70 },
      { grade: "C+", points: 6, minTotal: 65 },
      { grade: "C", points: 5, minTotal: 60 },
      { grade: "D", points: 4, minTotal: 50 },
      { grade: "P", points: 0, minTotal: 45 },
      { grade: "F", points: 0, minTotal: 0 }
    ];

    // Find target grade
    const targetGradeInfo = grades.find(g => g.grade === targetGrade);
    
    if (!targetGradeInfo) {
      toast({
        title: "Error",
        description: "Invalid target grade",
        variant: "destructive",
      });
      return;
    }

    // Calculate required SEE marks for target grade
    const minTotalRequired = targetGradeInfo.minTotal;
    const requiredSEE = Math.ceil(minTotalRequired - internalVal);
    
    // Calculate actual SEE percentage needed (SEE is out of 100)
    const seeFinal = requiredSEE > 100 ? 100 : requiredSEE;
    setSeeMarks(seeFinal);

    // Generate details for all grades
    const gradeDetailsList = grades.map(g => {
      const reqSEE = Math.ceil(g.minTotal - internalVal);
      const finalMarks = internalVal + (reqSEE > 100 ? 100 : (reqSEE < 0 ? 0 : reqSEE));
      
      return {
        grade: g.grade,
        points: g.points,
        marks: reqSEE > 100 ? 100 : (reqSEE < 0 ? 0 : reqSEE),
        finalMarks: finalMarks
      };
    });

    setGradeDetails(gradeDetailsList);

    if (requiredSEE > 100) {
      toast({
        title: "Warning",
        description: `Target grade ${targetGrade} is not achievable with your current internal marks`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Calculation Complete",
        description: `You need ${seeFinal}% in your SEE to get a ${targetGrade} grade`,
      });
    }
  };

  const resetInternalForm = () => {
    setAttendance("");
    setAssignment("");
    setSeries1("");
    setSeries2("");
    setInternalMarks(null);
  };

  const resetSEEForm = () => {
    setInternal("");
    setTargetGrade("S");
    setSeeMarks(null);
    setGradeDetails([]);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">KTU Internal <span className="text-blue-500">Marks</span> Calculator</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Calculate your internal assessment marks and required SEE marks to achieve your target grade
            </p>
          </div>
          
          <Tabs defaultValue="internal" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="internal" className="data-[state=active]:bg-blue-500">
                Internal Marks
              </TabsTrigger>
              <TabsTrigger value="see" className="data-[state=active]:bg-blue-500">
                SEE Calculator
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="internal">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card border-dark-800 overflow-hidden animate-fade-in-up">
                  <CardHeader className="bg-dark-900 border-b border-dark-800">
                    <CardTitle className="text-white flex items-center">
                      <Calculator className="h-5 w-5 text-blue-500 mr-2" />
                      Internal Assessment Calculator
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Calculate your internal marks based on attendance, assignments, and series tests
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="block text-sm text-gray-400 mb-1">Attendance (%)</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 85"
                          className="bg-dark-800 border-dark-700 text-white"
                          min="0"
                          max="100"
                          value={attendance}
                          onChange={(e) => setAttendance(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Percentage of classes attended</p>
                      </div>
                      
                      <div>
                        <Label className="block text-sm text-gray-400 mb-1">Assignment Marks</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 15"
                          className="bg-dark-800 border-dark-700 text-white"
                          min="0"
                          max="20"
                          value={assignment}
                          onChange={(e) => setAssignment(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Out of 20 marks</p>
                      </div>
                      
                      <div>
                        <Label className="block text-sm text-gray-400 mb-1">Series Test 1</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 35"
                          className="bg-dark-800 border-dark-700 text-white"
                          min="0"
                          max="50"
                          value={series1}
                          onChange={(e) => setSeries1(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Out of 50 marks</p>
                      </div>
                      
                      <div>
                        <Label className="block text-sm text-gray-400 mb-1">Series Test 2</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 40"
                          className="bg-dark-800 border-dark-700 text-white"
                          min="0"
                          max="50"
                          value={series2}
                          onChange={(e) => setSeries2(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Out of 50 marks</p>
                      </div>
                      
                      <div className="flex gap-4 pt-2">
                        <Button 
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={calculateInternalMarks}
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          Calculate
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-gray-600 text-gray-400 hover:text-gray-300"
                          onClick={resetInternalForm}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {internalMarks !== null && (
                  <Card className="glass-card border-dark-800 animate-fade-in-up">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white">Results</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-blue-500 mb-2">{internalMarks}/50</div>
                        <p className="text-gray-400">Your internal assessment marks</p>
                      </div>
                      
                      <div className="space-y-4 mt-6">
                        <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                          <h3 className="text-lg text-white font-medium mb-2">Breakdown</h3>
                          <ul className="space-y-2">
                            <li className="flex justify-between">
                              <span className="text-gray-400">Attendance:</span>
                              <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
                                {attendance ? Math.min(10, Math.floor((parseFloat(attendance) - 40) / 5)) : 0}/10
                              </Badge>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-400">Assignment:</span>
                              <Badge variant="outline" className="bg-green-500/20 text-green-400">
                                {assignment ? Math.min(10, Math.round((parseFloat(assignment) / 20) * 10)) : 0}/10
                              </Badge>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-gray-400">Series Tests:</span>
                              <Badge variant="outline" className="bg-purple-500/20 text-purple-400">
                                {series1 && series2 ? Math.min(30, Math.round(((parseFloat(series1) + parseFloat(series2)) / 100) * 30)) : 0}/30
                              </Badge>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                          <h3 className="text-lg text-white font-medium mb-2">What's Next?</h3>
                          <p className="text-gray-400 mb-4">
                            Use the SEE Calculator tab to determine the marks you need in your Semester End Exam to achieve your target grade.
                          </p>
                          <Button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => {
                              setInternal(internalMarks.toString());
                              setActiveTab("see");
                            }}
                          >
                            Calculate Required SEE Marks
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="see">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card border-dark-800 overflow-hidden animate-fade-in-up">
                  <CardHeader className="bg-dark-900 border-b border-dark-800">
                    <CardTitle className="text-white flex items-center">
                      <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                      SEE Calculator
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Calculate the SEE marks required to achieve your target grade
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="block text-sm text-gray-400 mb-1">Internal Marks</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 40"
                          className="bg-dark-800 border-dark-700 text-white"
                          min="0"
                          max="50"
                          value={internal}
                          onChange={(e) => setInternal(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Out of 50 marks</p>
                      </div>
                      
                      <div>
                        <Label className="block text-sm text-gray-400 mb-1">Target Grade</Label>
                        <div className="grid grid-cols-5 gap-2 mt-1">
                          {["S", "A+", "A", "B+", "B"].map((grade) => (
                            <Button
                              key={grade}
                              variant={targetGrade === grade ? "default" : "outline"}
                              className={
                                targetGrade === grade
                                  ? "bg-blue-500 hover:bg-blue-600 border-transparent"
                                  : "border-gray-600 text-gray-400 hover:text-gray-300"
                              }
                              onClick={() => setTargetGrade(grade)}
                            >
                              {grade}
                            </Button>
                          ))}
                        </div>
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          {["C+", "C", "D", "P", "F"].map((grade) => (
                            <Button
                              key={grade}
                              variant={targetGrade === grade ? "default" : "outline"}
                              className={
                                targetGrade === grade
                                  ? "bg-blue-500 hover:bg-blue-600 border-transparent"
                                  : "border-gray-600 text-gray-400 hover:text-gray-300"
                              }
                              onClick={() => setTargetGrade(grade)}
                            >
                              {grade}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-4 pt-2">
                        <Button 
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={calculateSEEMarks}
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          Calculate
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-gray-600 text-gray-400 hover:text-gray-300"
                          onClick={resetSEEForm}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {seeMarks !== null && (
                  <Card className="glass-card border-dark-800 animate-fade-in-up">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white">Results</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-blue-500 mb-2">{seeMarks}%</div>
                        <p className="text-gray-400">
                          SEE marks required for {targetGrade} grade
                        </p>
                        
                        {seeMarks > 100 && (
                          <div className="flex items-center mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            <p className="text-sm text-red-400">
                              This grade is not achievable with your current internal marks
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <Separator className="my-4 bg-dark-800" />
                      
                      <h3 className="text-lg text-white font-medium mb-3">All Possible Grades</h3>
                      <ScrollArea className="h-64 rounded-md border border-dark-700 p-4">
                        <div className="space-y-3">
                          {gradeDetails.map((detail, index) => (
                            <div 
                              key={index} 
                              className={`bg-dark-800 p-3 rounded-lg border ${
                                detail.grade === targetGrade 
                                  ? "border-blue-500/50" 
                                  : "border-dark-700"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <Badge 
                                    variant="outline" 
                                    className={`
                                      ${detail.grade === "S" 
                                        ? "bg-purple-500/20 text-purple-400" 
                                        : detail.grade === "A+" || detail.grade === "A" 
                                        ? "bg-blue-500/20 text-blue-400"
                                        : detail.grade === "B+" || detail.grade === "B"
                                        ? "bg-green-500/20 text-green-400"
                                        : detail.grade === "C+" || detail.grade === "C"
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-red-500/20 text-red-400"
                                      }
                                      mr-2
                                    `}
                                  >
                                    {detail.grade}
                                  </Badge>
                                  <span className="text-sm text-gray-300">Grade Points: {detail.points}</span>
                                </div>
                                
                                {detail.grade === targetGrade && (
                                  <Badge className="bg-blue-500 text-white">Target</Badge>
                                )}
                              </div>
                              
                              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-400">
                                  Required SEE: <span className="text-white font-medium">{detail.marks}%</span>
                                </div>
                                <div className="text-gray-400 text-right">
                                  Final: <span className="text-white font-medium">{detail.finalMarks}%</span>
                                </div>
                              </div>
                              
                              {detail.marks > 100 ? (
                                <div className="mt-2 flex items-center text-xs text-red-400">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Not achievable
                                </div>
                              ) : detail.marks <= 50 ? (
                                <div className="mt-2 flex items-center text-xs text-green-400">
                                  <Check className="h-3 w-3 mr-1" />
                                  Easily achievable
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InternalMarks;
