
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calculator, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

// Grade scale definition
const gradeScale = [
  { grade: 'S', points: 10, minMarks: 90 },
  { grade: 'A', points: 9, minMarks: 80 },
  { grade: 'B', points: 8, minMarks: 70 },
  { grade: 'C', points: 7, minMarks: 60 },
  { grade: 'D', points: 6, minMarks: 50 },
  { grade: 'E', points: 5, minMarks: 45 },
  { grade: 'P', points: 4, minMarks: 40 },
  { grade: 'F', points: 0, minMarks: 0 }
];

const InternalMarks = () => {
  const { toast } = useToast();
  
  // Mode toggle
  const [isLabMode, setIsLabMode] = useState(false);
  
  // Input values
  const [series1, setSeries1] = useState("");
  const [series2, setSeries2] = useState("");
  const [series3, setSeries3] = useState("");
  const [assignment1, setAssignment1] = useState("");
  const [assignment2, setAssignment2] = useState("");
  const [module1, setModule1] = useState("");
  const [module2, setModule2] = useState("");
  const [module3, setModule3] = useState("");
  const [labInternal, setLabInternal] = useState("");
  const [labExternal, setLabExternal] = useState("");
  const [graceMarks, setGraceMarks] = useState("");
  
  // Results
  const [scaledSeries, setScaledSeries] = useState(0);
  const [scaledAssignments, setScaledAssignments] = useState(0);
  const [scaledModules, setScaledModules] = useState(0);
  const [labInternalMarks, setLabInternalMarks] = useState(0);
  const [labExternalMarks, setLabExternalMarks] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [eligibilityReason, setEligibilityReason] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [gradeTableData, setGradeTableData] = useState<{grade: string, points: number, marks: number}[]>([]);
  
  // Safe parsing function
  const safeParseFloat = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Reset all values when mode changes
  useEffect(() => {
    resetCalculator();
  }, [isLabMode]);
  
  const resetCalculator = () => {
    // Reset inputs
    setSeries1("");
    setSeries2("");
    setSeries3("");
    setAssignment1("");
    setAssignment2("");
    setModule1("");
    setModule2("");
    setModule3("");
    setLabInternal("");
    setLabExternal("");
    setGraceMarks("");
    
    // Reset results
    setScaledSeries(0);
    setScaledAssignments(0);
    setScaledModules(0);
    setLabInternalMarks(0);
    setLabExternalMarks(0);
    setTotalMarks(0);
    setIsEligible(null);
    setEligibilityReason("");
    setShowResults(false);
    setGradeTableData([]);
  };
  
  const calculateMarks = () => {
    try {
      if (isLabMode) {
        calculateLabMode();
      } else {
        calculateRegularMode();
      }
      
      setShowResults(true);
    } catch (error) {
      console.error("Error calculating marks:", error);
      toast({
        title: "Error calculating marks",
        description: "Please check your inputs and try again",
        variant: "destructive",
      });
    }
  };
  
  const calculateRegularMode = () => {
    const series1Value = safeParseFloat(series1);
    const series2Value = safeParseFloat(series2);
    const series3Value = safeParseFloat(series3);
    const assignment1Value = safeParseFloat(assignment1);
    const assignment2Value = safeParseFloat(assignment2);
    const module1Value = safeParseFloat(module1);
    const module2Value = safeParseFloat(module2);
    const module3Value = safeParseFloat(module3);
    const graceMarksValue = safeParseFloat(graceMarks);
    
    // Calculate scaled marks
    const seriesAvg = (series1Value + series2Value + series3Value) / 3;
    const scaledSeriesValue = (seriesAvg / 50) * 30;
    setScaledSeries(scaledSeriesValue);
    
    const assignmentTotal = assignment1Value + assignment2Value;
    const scaledAssignmentsValue = (assignmentTotal / 20) * 10;
    setScaledAssignments(scaledAssignmentsValue);
    
    const moduleTotal = module1Value + module2Value + module3Value;
    const scaledModulesValue = (moduleTotal / 30) * 10;
    setScaledModules(scaledModulesValue);
    
    // Calculate total
    const totalValue = scaledSeriesValue + scaledAssignmentsValue + scaledModulesValue + graceMarksValue;
    setTotalMarks(totalValue);
    
    // Check eligibility (must be >= 20 out of 50)
    const eligibleValue = totalValue >= 20;
    setIsEligible(eligibleValue);
    
    if (eligibleValue) {
      setEligibilityReason("All eligibility criteria met");
      // Calculate grade table
      generateGradeTable(totalValue, false);
    } else {
      setEligibilityReason("Internal marks are below the minimum requirement");
    }
  };
  
  const calculateLabMode = () => {
    const series1Value = safeParseFloat(series1);
    const series2Value = safeParseFloat(series2);
    const series3Value = safeParseFloat(series3);
    const assignment1Value = safeParseFloat(assignment1);
    const assignment2Value = safeParseFloat(assignment2);
    const module1Value = safeParseFloat(module1);
    const module2Value = safeParseFloat(module2);
    const module3Value = safeParseFloat(module3);
    const labInternalValue = safeParseFloat(labInternal);
    const labExternalValue = safeParseFloat(labExternal);
    
    // Calculate scaled marks
    const seriesAvg = (series1Value + series2Value + series3Value) / 3;
    const scaledSeriesValue = (seriesAvg / 50) * 30;
    setScaledSeries(scaledSeriesValue);
    
    const assignmentTotal = assignment1Value + assignment2Value;
    const scaledAssignmentsValue = (assignmentTotal / 20) * 10;
    setScaledAssignments(scaledAssignmentsValue);
    
    const moduleTotal = module1Value + module2Value + module3Value;
    const scaledModulesValue = (moduleTotal / 30) * 10;
    setScaledModules(scaledModulesValue);
    
    // Calculate lab component marks (each out of 25)
    const labInternalMarksValue = labInternalValue / 2;
    const labExternalMarksValue = labExternalValue / 2;
    setLabInternalMarks(labInternalMarksValue);
    setLabExternalMarks(labExternalMarksValue);
    
    // Calculate total internal marks (out of 50 for eligibility check)
    const totalInternal = scaledSeriesValue + scaledAssignmentsValue + scaledModulesValue;
    
    // Calculate final total (out of 75)
    const totalValue = (totalInternal / 2) + labInternalMarksValue + labExternalMarksValue;
    setTotalMarks(totalValue);
    
    // Check eligibility based on internal marks (must be >= 20 out of 50)
    const eligibleValue = totalInternal >= 20;
    setIsEligible(eligibleValue);
    
    if (eligibleValue) {
      setEligibilityReason("All eligibility criteria met");
      const percentage = (totalValue / 75) * 100;
      generateGradeTable(percentage, true);
    } else {
      setEligibilityReason("Internal marks are below the minimum requirement");
    }
  };
  
  const generateGradeTable = (currentMarks: number, isLabMode: boolean) => {
    const newGradeData: {grade: string, points: number, marks: number}[] = [];
    
    gradeScale.forEach(({ grade, points, minMarks }) => {
      if (isLabMode) {
        // For lab mode (current marks are out of 75)
        const currentPercentage = (currentMarks / 75) * 50; // Convert to 50 marks scale
        const requiredSEE = Math.ceil((minMarks - currentPercentage) * 2);
        
        // Only show grades that are achievable (SEE marks <= 100)
        if (requiredSEE <= 100 && requiredSEE > 0) {
          newGradeData.push({ grade, points, marks: requiredSEE });
        }
      } else {
        // Regular mode (current marks are out of 50)
        const requiredSEE = Math.ceil((minMarks - currentMarks) * 2);
        if (requiredSEE <= 100 && requiredSEE > 0) {
          newGradeData.push({ grade, points, marks: requiredSEE });
        }
      }
    });
    
    setGradeTableData(newGradeData);
  };
  
  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Internal <span className="text-blue-500">Assessment</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Calculate your internal marks and check exam eligibility
            </p>
          </div>
          
          <Card className="glass-card border-dark-800 mb-6 animate-fade-in-up">
            <CardHeader className="bg-dark-900 border-b border-dark-800">
              <CardTitle className="text-white flex items-center justify-between">
                <span>Course Type</span>
                <div className="flex items-center space-x-3">
                  <Label 
                    htmlFor="course-type" 
                    className={`text-sm cursor-pointer ${!isLabMode ? "text-blue-400" : "text-gray-400"}`}
                  >
                    3-Credit Course
                  </Label>
                  <Switch 
                    id="course-type"
                    checked={isLabMode}
                    onCheckedChange={setIsLabMode}
                  />
                  <Label 
                    htmlFor="course-type" 
                    className={`text-sm cursor-pointer ${isLabMode ? "text-blue-400" : "text-gray-400"}`}
                  >
                    4-Credit Course
                  </Label>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="glass-card border-dark-800 mb-6 animate-fade-in-up">
            <CardHeader className="bg-dark-900 border-b border-dark-800">
              <CardTitle className="text-white">Series Exams</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Series Exam 1</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-dark-800 border-dark-700 text-white pr-12"
                      min="0"
                      max="50"
                      value={series1}
                      onChange={(e) => setSeries1(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/50</span>
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Series Exam 2</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-dark-800 border-dark-700 text-white pr-12"
                      min="0"
                      max="50"
                      value={series2}
                      onChange={(e) => setSeries2(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/50</span>
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Series Exam 3</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-dark-800 border-dark-700 text-white pr-12"
                      min="0"
                      max="50"
                      value={series3}
                      onChange={(e) => setSeries3(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/50</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-dark-800 mb-6 animate-fade-in-up">
            <CardHeader className="bg-dark-900 border-b border-dark-800">
              <CardTitle className="text-white">Assignments</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Assignment 1</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-dark-800 border-dark-700 text-white pr-12"
                      min="0"
                      max="10"
                      value={assignment1}
                      onChange={(e) => setAssignment1(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/10</span>
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Assignment 2</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-dark-800 border-dark-700 text-white pr-12"
                      min="0"
                      max="10"
                      value={assignment2}
                      onChange={(e) => setAssignment2(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/10</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-dark-800 mb-6 animate-fade-in-up">
            <CardHeader className="bg-dark-900 border-b border-dark-800">
              <CardTitle className="text-white">Module Tests</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Module Test 1</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-dark-800 border-dark-700 text-white pr-12"
                      min="0"
                      max="10"
                      value={module1}
                      onChange={(e) => setModule1(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/10</span>
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Module Test 2</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-dark-800 border-dark-700 text-white pr-12"
                      min="0"
                      max="10"
                      value={module2}
                      onChange={(e) => setModule2(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/10</span>
                  </div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Module Test 3</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      className="bg-dark-800 border-dark-700 text-white pr-12"
                      min="0"
                      max="10"
                      value={module3}
                      onChange={(e) => setModule3(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/10</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {isLabMode && (
            <Card className="glass-card border-dark-800 mb-6 animate-fade-in-up">
              <CardHeader className="bg-dark-900 border-b border-dark-800">
                <CardTitle className="text-white">Lab Assessment</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Lab Internal</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0"
                        className="bg-dark-800 border-dark-700 text-white pr-12"
                        min="0"
                        max="50"
                        value={labInternal}
                        onChange={(e) => setLabInternal(e.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/50</span>
                    </div>
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Lab External</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0"
                        className="bg-dark-800 border-dark-700 text-white pr-12"
                        min="0"
                        max="50"
                        value={labExternal}
                        onChange={(e) => setLabExternal(e.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/50</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {!isLabMode && (
            <Card className="glass-card border-dark-800 mb-6 animate-fade-in-up">
              <CardHeader className="bg-dark-900 border-b border-dark-800">
                <CardTitle className="text-white">Grace Marks</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Grace Marks (if any)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="bg-dark-800 border-dark-700 text-white"
                    min="0"
                    max="10"
                    value={graceMarks}
                    onChange={(e) => setGraceMarks(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex gap-4 mb-8">
            <Button 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={calculateMarks}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-400 hover:text-gray-300"
              onClick={resetCalculator}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          {showResults && (
            <Card className="glass-card border-dark-800 animate-fade-in-up">
              <CardHeader className="bg-dark-900 border-b border-dark-800">
                <CardTitle className="text-white">Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Scaled Series Exam Marks</div>
                      <div className="text-lg font-medium text-white">{scaledSeries.toFixed(2)}/30</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Scaled Assignment Marks</div>
                      <div className="text-lg font-medium text-white">{scaledAssignments.toFixed(2)}/10</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Scaled Module Test Marks</div>
                      <div className="text-lg font-medium text-white">{scaledModules.toFixed(2)}/10</div>
                    </div>
                    {!isLabMode && (
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Grace Marks</div>
                        <div className="text-lg font-medium text-white">{safeParseFloat(graceMarks).toFixed(2)}</div>
                      </div>
                    )}
                    {isLabMode && (
                      <>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Lab Internal Contribution</div>
                          <div className="text-lg font-medium text-white">{labInternalMarks.toFixed(2)}/25</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Lab External Contribution</div>
                          <div className="text-lg font-medium text-white">{labExternalMarks.toFixed(2)}/25</div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Separator className="bg-dark-800" />
                  
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Total Marks</div>
                    <div className="text-2xl font-bold text-white">
                      {totalMarks.toFixed(2)} <span className="text-sm text-gray-500">/ {isLabMode ? '75' : '50'}</span>
                    </div>
                  </div>
                  
                  <Separator className="bg-dark-800" />
                  
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Eligibility</div>
                    {isEligible ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Eligible for Final Exam</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="h-5 w-5" />
                        <span className="font-medium">Not Eligible for Final Exam</span>
                      </div>
                    )}
                    <div className="text-sm text-gray-400 mt-1">{eligibilityReason}</div>
                  </div>
                  
                  {isEligible && gradeTableData.length > 0 && (
                    <>
                      <Separator className="bg-dark-800" />
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-3">
                          {isLabMode ? "Required SEE Marks for Grades" : "Required SEE Marks for Grades"}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-dark-700">
                                <th className="text-left py-2 px-3 text-gray-400">Grade</th>
                                <th className="text-left py-2 px-3 text-gray-400">Points</th>
                                <th className="text-left py-2 px-3 text-gray-400">
                                  Required SEE Marks
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {gradeTableData.map((item, index) => (
                                <tr key={index} className="border-b border-dark-800">
                                  <td className="py-3 px-3">{item.grade}</td>
                                  <td className="py-3 px-3">{item.points}</td>
                                  <td className="py-3 px-3">
                                    <div className="flex items-center">
                                      {item.marks}
                                      {item.marks > 80 && (
                                        <AlertTriangle className="h-4 w-4 ml-2 text-yellow-500" />
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
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

export default InternalMarks;
