
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, List, TestTube, Star, Calculator, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface GradeRequirement {
  grade: string;
  points: number;
  requiredSEE: number;
}

const KTUCalculator = () => {
  const { toast } = useToast();
  
  // Toggle between 3-credit and 4-credit courses
  const [isFourCredit, setIsFourCredit] = useState(true);
  
  // Series Exams (3 exams, each out of 50)
  const [seriesExam1, setSeriesExam1] = useState<string>("");
  const [seriesExam2, setSeriesExam2] = useState<string>("");
  const [seriesExam3, setSeriesExam3] = useState<string>("");
  
  // Assignments (2 assignments, each out of 10)
  const [assignment1, setAssignment1] = useState<string>("");
  const [assignment2, setAssignment2] = useState<string>("");
  
  // Module Tests (3 tests, each out of 10)
  const [moduleTest1, setModuleTest1] = useState<string>("");
  const [moduleTest2, setModuleTest2] = useState<string>("");
  const [moduleTest3, setModuleTest3] = useState<string>("");
  
  // Lab Assessment (Only for courses with lab component)
  const [labInternal, setLabInternal] = useState<string>("");
  const [labExternal, setLabExternal] = useState<string>("");
  
  // Grace Marks
  const [graceMarks, setGraceMarks] = useState<string>("");
  
  // Results
  const [scaledSeriesMarks, setScaledSeriesMarks] = useState<number | null>(null);
  const [scaledAssignmentMarks, setScaledAssignmentMarks] = useState<number | null>(null);
  const [scaledModuleTestMarks, setScaledModuleTestMarks] = useState<number | null>(null);
  const [scaledLabMarks, setScaledLabMarks] = useState<number | null>(null);
  const [totalMarks, setTotalMarks] = useState<number | null>(null);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  
  // Grade requirements table
  const [gradeRequirements, setGradeRequirements] = useState<GradeRequirement[]>([
    { grade: "O", points: 10, requiredSEE: 0 },
    { grade: "A+", points: 9, requiredSEE: 0 },
    { grade: "A", points: 8, requiredSEE: 0 },
    { grade: "B+", points: 7, requiredSEE: 0 }
  ]);
  
  // Calculate scaled marks for Series Exams
  const calculateScaledSeriesMarks = () => {
    const exam1 = parseFloat(seriesExam1) || 0;
    const exam2 = parseFloat(seriesExam2) || 0;
    const exam3 = parseFloat(seriesExam3) || 0;
    
    // Ensure values are within range
    if (exam1 > 50 || exam2 > 50 || exam3 > 50) {
      toast({
        title: "Invalid input",
        description: "Series exam marks cannot exceed 50",
        variant: "destructive",
      });
      return 0;
    }
    
    const totalSeriesMarks = exam1 + exam2 + exam3;
    const maxSeriesMarks = 150; // 3 exams × 50 marks
    
    // For 4-credit: 30 marks, For 3-credit: 15 marks
    const seriesExamWeight = isFourCredit ? 30 : 15;
    
    return (totalSeriesMarks / maxSeriesMarks) * seriesExamWeight;
  };
  
  // Calculate scaled marks for Assignments
  const calculateScaledAssignmentMarks = () => {
    const assign1 = parseFloat(assignment1) || 0;
    const assign2 = parseFloat(assignment2) || 0;
    
    // Ensure values are within range
    if (assign1 > 10 || assign2 > 10) {
      toast({
        title: "Invalid input",
        description: "Assignment marks cannot exceed 10",
        variant: "destructive",
      });
      return 0;
    }
    
    const totalAssignmentMarks = assign1 + assign2;
    const maxAssignmentMarks = 20; // 2 assignments × 10 marks
    
    // For 4-credit: 10 marks, For 3-credit: 5 marks
    const assignmentWeight = isFourCredit ? 10 : 5;
    
    return (totalAssignmentMarks / maxAssignmentMarks) * assignmentWeight;
  };
  
  // Calculate scaled marks for Module Tests
  const calculateScaledModuleTestMarks = () => {
    const test1 = parseFloat(moduleTest1) || 0;
    const test2 = parseFloat(moduleTest2) || 0;
    const test3 = parseFloat(moduleTest3) || 0;
    
    // Ensure values are within range
    if (test1 > 10 || test2 > 10 || test3 > 10) {
      toast({
        title: "Invalid input",
        description: "Module test marks cannot exceed 10",
        variant: "destructive",
      });
      return 0;
    }
    
    const totalModuleTestMarks = test1 + test2 + test3;
    const maxModuleTestMarks = 30; // 3 tests × 10 marks
    
    // For 4-credit: 10 marks, For 3-credit: 5 marks
    const moduleTestWeight = isFourCredit ? 10 : 5;
    
    // Calculate scaled marks
    let scaledMarks = (totalModuleTestMarks / maxModuleTestMarks) * moduleTestWeight;
    
    // Ensure minimum 20% (2 marks for 10, 1 mark for 5)
    const minimumMarks = moduleTestWeight * 0.2;
    
    return Math.max(scaledMarks, minimumMarks);
  };
  
  // Calculate scaled marks for Lab (if applicable)
  const calculateScaledLabMarks = () => {
    // Lab is only considered for courses with lab component
    if (!labInternal && !labExternal) {
      return 0;
    }
    
    const internal = parseFloat(labInternal) || 0;
    const external = parseFloat(labExternal) || 0;
    
    // Ensure values are within range
    if (internal > 50 || external > 50) {
      toast({
        title: "Invalid input",
        description: "Lab marks cannot exceed 50",
        variant: "destructive",
      });
      return 0;
    }
    
    // For 4-credit: 50 marks, For 3-credit: 25 marks
    const labWeight = isFourCredit ? 50 : 25;
    const labHalfWeight = labWeight / 2;
    
    const internalContribution = (internal / 50) * labHalfWeight;
    const externalContribution = (external / 50) * labHalfWeight;
    
    return internalContribution + externalContribution;
  };
  
  // Calculate total internal marks and set eligibility
  const calculateFinalMarks = () => {
    // Calculate scaled marks for each component
    const seriesMarks = calculateScaledSeriesMarks();
    const assignmentMarks = calculateScaledAssignmentMarks();
    const moduleMarks = calculateScaledModuleTestMarks();
    const labMarks = calculateScaledLabMarks();
    const grace = parseFloat(graceMarks) || 0;
    
    // Set calculated component marks
    setScaledSeriesMarks(parseFloat(seriesMarks.toFixed(2)));
    setScaledAssignmentMarks(parseFloat(assignmentMarks.toFixed(2)));
    setScaledModuleTestMarks(parseFloat(moduleMarks.toFixed(2)));
    setScaledLabMarks(parseFloat(labMarks.toFixed(2)));
    
    // Calculate total internal marks
    const total = seriesMarks + assignmentMarks + moduleMarks + labMarks + grace;
    setTotalMarks(parseFloat(total.toFixed(2)));
    
    // Maximum possible internal marks
    const maxInternalMarks = isFourCredit ? 100 : 50;
    
    // Set eligibility (typically 45% or 50% of internal marks is required)
    const minimumRequiredPercentage = 45;
    const minimumMarks = (minimumRequiredPercentage / 100) * maxInternalMarks;
    setIsEligible(total >= minimumMarks);
    
    // Calculate required SEE marks for each grade
    calculateRequiredSEEMarks(total);
    
    // Show toast notification
    toast({
      title: "Calculation completed",
      description: `Total internal marks: ${total.toFixed(2)}/${maxInternalMarks}`,
    });
  };
  
  // Calculate required SEE marks for each grade
  const calculateRequiredSEEMarks = (internalMarks: number) => {
    const maxInternalMarks = isFourCredit ? 100 : 50;
    const maxSEEMarks = 100;
    
    // Internal to SEE ratio is typically 50:50
    // For 4-credit, internal is out of 100, SEE is out of 100
    // For 3-credit, internal is out of 50, SEE is out of 100 but scaled to 50
    const internalWeight = 0.5;
    const seeWeight = 0.5;
    
    // Calculate required SEE marks for each grade
    const updatedRequirements = [
      { grade: "O", points: 10, requiredSEE: 0 },
      { grade: "A+", points: 9, requiredSEE: 0 },
      { grade: "A", points: 8, requiredSEE: 0 },
      { grade: "B+", points: 7, requiredSEE: 0 }
    ];
    
    // Grade thresholds (typically)
    const gradeThresholds = [
      { grade: "O", threshold: 90 },
      { grade: "A+", threshold: 85 },
      { grade: "A", threshold: 80 },
      { grade: "B+", threshold: 70 }
    ];
    
    updatedRequirements.forEach((req, index) => {
      // Calculate the total points needed for this grade
      const totalPointsNeeded = gradeThresholds[index].threshold;
      
      // Calculate the points already earned from internal
      const internalPercentage = (internalMarks / maxInternalMarks) * 100;
      const internalContribution = internalPercentage * internalWeight;
      
      // Required SEE percentage = (totalPointsNeeded - internalContribution) / seeWeight
      const requiredSEEPercentage = (totalPointsNeeded - internalContribution) / seeWeight;
      
      // Convert to actual SEE marks
      let requiredSEEMarks = (requiredSEEPercentage / 100) * maxSEEMarks;
      
      // Ensure it's not negative and not greater than max SEE marks
      requiredSEEMarks = Math.max(0, Math.min(maxSEEMarks, requiredSEEMarks));
      
      // Update the requirement
      updatedRequirements[index].requiredSEE = Math.ceil(requiredSEEMarks);
    });
    
    setGradeRequirements(updatedRequirements);
  };
  
  // Reset all inputs
  const resetInputs = () => {
    setSeriesExam1("");
    setSeriesExam2("");
    setSeriesExam3("");
    setAssignment1("");
    setAssignment2("");
    setModuleTest1("");
    setModuleTest2("");
    setModuleTest3("");
    setLabInternal("");
    setLabExternal("");
    setGraceMarks("");
    setScaledSeriesMarks(null);
    setScaledAssignmentMarks(null);
    setScaledModuleTestMarks(null);
    setScaledLabMarks(null);
    setTotalMarks(null);
    setIsEligible(null);
    setGradeRequirements([
      { grade: "O", points: 10, requiredSEE: 0 },
      { grade: "A+", points: 9, requiredSEE: 0 },
      { grade: "A", points: 8, requiredSEE: 0 },
      { grade: "B+", points: 7, requiredSEE: 0 }
    ]);
  };
  
  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <Calculator className="inline-block mr-2 h-8 w-8 text-blue-500" />
              Final <span className="text-blue-500">Marks</span> Calculator
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Calculate your total marks and SEE exam eligibility
            </p>
          </div>
          
          <div className="flex justify-center items-center mb-8">
            <div className="flex items-center space-x-2">
              <span className={cn("text-sm font-medium", !isFourCredit && "text-blue-500")}>3 credit course</span>
              <Switch 
                checked={isFourCredit} 
                onCheckedChange={setIsFourCredit}
                className="data-[state=checked]:bg-blue-500"
              />
              <span className={cn("text-sm font-medium", isFourCredit && "text-blue-500")}>4 credit course</span>
            </div>
          </div>
          
          <Card className="glass-card border-dark-800 mb-6 animate-fade-in">
            <CardHeader className="bg-dark-900 border-b border-dark-800 flex flex-row items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <CardTitle className="text-white">Series Exams</CardTitle>
              <div className="ml-auto bg-dark-800 rounded-full h-5 w-5 flex items-center justify-center">
                <span className="text-xs text-gray-400">?</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Series Exam 1</div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500"></span>
                    <span className="text-xs text-gray-500">/50</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter marks"
                    className="bg-dark-800 border-dark-700 text-white"
                    value={seriesExam1}
                    onChange={(e) => setSeriesExam1(e.target.value)}
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Series Exam 2</div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500"></span>
                    <span className="text-xs text-gray-500">/50</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter marks"
                    className="bg-dark-800 border-dark-700 text-white"
                    value={seriesExam2}
                    onChange={(e) => setSeriesExam2(e.target.value)}
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Series Exam 3</div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500"></span>
                    <span className="text-xs text-gray-500">/50</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter marks"
                    className="bg-dark-800 border-dark-700 text-white"
                    value={seriesExam3}
                    onChange={(e) => setSeriesExam3(e.target.value)}
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-dark-800 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="bg-dark-900 border-b border-dark-800 flex flex-row items-center">
              <List className="h-5 w-5 text-blue-500 mr-2" />
              <CardTitle className="text-white">Assignments</CardTitle>
              <div className="ml-auto bg-dark-800 rounded-full h-5 w-5 flex items-center justify-center">
                <span className="text-xs text-gray-400">?</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Assignment 1</div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500"></span>
                    <span className="text-xs text-gray-500">/10</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter marks"
                    className="bg-dark-800 border-dark-700 text-white"
                    value={assignment1}
                    onChange={(e) => setAssignment1(e.target.value)}
                    min="0"
                    max="10"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Assignment 2</div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500"></span>
                    <span className="text-xs text-gray-500">/10</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter marks"
                    className="bg-dark-800 border-dark-700 text-white"
                    value={assignment2}
                    onChange={(e) => setAssignment2(e.target.value)}
                    min="0"
                    max="10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-dark-800 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="bg-dark-900 border-b border-dark-800 flex flex-row items-center">
              <TestTube className="h-5 w-5 text-blue-500 mr-2" />
              <CardTitle className="text-white">Module Tests</CardTitle>
              <div className="ml-auto bg-dark-800 rounded-full h-5 w-5 flex items-center justify-center">
                <span className="text-xs text-gray-400">?</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Module Test 1</div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500"></span>
                    <span className="text-xs text-gray-500">/10</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter marks"
                    className="bg-dark-800 border-dark-700 text-white"
                    value={moduleTest1}
                    onChange={(e) => setModuleTest1(e.target.value)}
                    min="0"
                    max="10"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Module Test 2</div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500"></span>
                    <span className="text-xs text-gray-500">/10</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter marks"
                    className="bg-dark-800 border-dark-700 text-white"
                    value={moduleTest2}
                    onChange={(e) => setModuleTest2(e.target.value)}
                    min="0"
                    max="10"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Module Test 3</div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500"></span>
                    <span className="text-xs text-gray-500">/10</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter marks"
                    className="bg-dark-800 border-dark-700 text-white"
                    value={moduleTest3}
                    onChange={(e) => setModuleTest3(e.target.value)}
                    min="0"
                    max="10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-dark-800 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="bg-dark-900 border-b border-dark-800 flex flex-row items-center">
              <Star className="h-5 w-5 text-blue-500 mr-2" />
              <CardTitle className="text-white">Grace Marks</CardTitle>
              <div className="ml-auto bg-dark-800 rounded-full h-5 w-5 flex items-center justify-center">
                <span className="text-xs text-gray-400">?</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div>
                <div className="text-sm text-gray-400 mb-2">Grace Marks</div>
                <Input
                  type="number"
                  placeholder="Enter grace marks (if any)"
                  className="bg-dark-800 border-dark-700 text-white"
                  value={graceMarks}
                  onChange={(e) => setGraceMarks(e.target.value)}
                  min="0"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-8">
            <Button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg"
              onClick={calculateFinalMarks}
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate Final Marks
            </Button>
          </div>
          
          {totalMarks !== null && (
            <Card className="glass-card border-dark-800 mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader className="bg-dark-900 border-b border-dark-800">
                <CardTitle className="text-white">Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                    <span className="text-gray-300">Scaled Series Exam Marks</span>
                    <span className="text-green-400 font-medium">{scaledSeriesMarks?.toFixed(2)}/{isFourCredit ? "30" : "15"}</span>
                  </div>
                  
                  <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                    <span className="text-gray-300">Scaled Assignment Marks</span>
                    <span className="text-green-400 font-medium">{scaledAssignmentMarks?.toFixed(2)}/{isFourCredit ? "10" : "5"}</span>
                  </div>
                  
                  <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                    <span className="text-gray-300">Scaled Module Test Marks</span>
                    <span className="text-green-400 font-medium">{scaledModuleTestMarks?.toFixed(2)}/{isFourCredit ? "10" : "5"}</span>
                  </div>
                  
                  {scaledLabMarks !== null && scaledLabMarks > 0 && (
                    <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                      <span className="text-gray-300">Lab Assessment Marks</span>
                      <span className="text-green-400 font-medium">{scaledLabMarks?.toFixed(2)}/{isFourCredit ? "50" : "25"}</span>
                    </div>
                  )}
                  
                  {parseFloat(graceMarks) > 0 && (
                    <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                      <span className="text-gray-300">Grace Marks</span>
                      <span className="text-green-400 font-medium">{parseFloat(graceMarks).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="bg-dark-800 rounded-md p-4 flex justify-between items-center">
                    <span className="text-white font-medium">Total Marks</span>
                    <span className="text-blue-500 font-bold text-xl">{totalMarks?.toFixed(2)}/{isFourCredit ? "100" : "50"}</span>
                  </div>
                  
                  <div className={cn(
                    "rounded-md p-4 flex items-center justify-center",
                    isEligible ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  )}>
                    {isEligible ? (
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Eligible to attempt SEE exam</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Not eligible for SEE exam</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="bg-dark-800 my-4" />
                  
                  <div>
                    <h3 className="text-lg text-white mb-3">Grade Requirements</h3>
                    <div className="overflow-hidden rounded-md border border-dark-700">
                      <table className="min-w-full divide-y divide-dark-700">
                        <thead className="bg-dark-800">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">GRADE</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">POINTS</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">REQUIRED SEE MARKS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700 bg-dark-900">
                          {gradeRequirements.map((req, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-white">{req.grade}</td>
                              <td className="px-4 py-3 text-sm text-white">{req.points}</td>
                              <td className="px-4 py-3 text-sm text-white">{req.requiredSEE}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default KTUCalculator;
