
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calculator, CheckCircle, XCircle, AlertTriangle, RefreshCw, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// KTU Grade scale definition
const gradeScale = [
  { grade: 'O', points: 10, minMarks: 90 },
  { grade: 'A+', points: 9, minMarks: 80 },
  { grade: 'A', points: 8, minMarks: 70 },
  { grade: 'B+', points: 7, minMarks: 60 },
  { grade: 'C+', points: 6, minMarks: 50 },
  { grade: 'C', points: 5, minMarks: 40 },
  { grade: 'F', points: 0, minMarks: 0 }
];

const InternalMarks = () => {
  const { toast } = useToast();
  
  // Mode toggle
  const [isLabMode, setIsLabMode] = useState(false);
  const [isFourCredit, setIsFourCredit] = useState(true);
  
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
  const [gradeTableData, setGradeTableData] = useState<{grade: string, points: number, marks: number, finalMarks: number}[]>([]);
  
  // Safe parsing function
  const safeParseFloat = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Reset all values when mode changes
  useEffect(() => {
    resetCalculator();
  }, [isLabMode, isFourCredit]);
  
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
      
      toast({
        title: "Calculation Complete",
        description: "Your internal marks have been calculated successfully!",
      });
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
      // Calculate grade table with predictions
      generateGradeTable(totalValue, false);
    } else {
      setEligibilityReason("Internal marks are below the minimum requirement of 20/50");
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
      // Call generateGradeTable with the correct parameters
      generateGradeTable(totalValue, true);
    } else {
      setEligibilityReason("Internal marks are below the minimum requirement of 20/50");
    }
  };
  
  // Calculate KTU final marks
  const calculateKTUFinalMarks = () => {
    try {
      // Calculate based on credit type
      if (isFourCredit) {
        calculateFourCreditMarks();
      } else {
        calculateThreeCreditMarks();
      }
      
      setShowResults(true);
      
      toast({
        title: "Calculation Complete",
        description: `Total internal marks: ${totalMarks.toFixed(2)}/${isFourCredit ? '100' : '50'}`,
      });
    } catch (error) {
      console.error("Error calculating marks:", error);
      toast({
        title: "Error calculating marks",
        description: "Please check your inputs and try again",
        variant: "destructive",
      });
    }
  };
  
  // Calculate for 4-credit courses
  const calculateFourCreditMarks = () => {
    const exam1 = safeParseFloat(series1);
    const exam2 = safeParseFloat(series2);
    const exam3 = safeParseFloat(series3);
    const assign1 = safeParseFloat(assignment1);
    const assign2 = safeParseFloat(assignment2);
    const test1 = safeParseFloat(module1);
    const test2 = safeParseFloat(module2);
    const test3 = safeParseFloat(module3);
    const grace = safeParseFloat(graceMarks);
    const labInt = safeParseFloat(labInternal);
    const labExt = safeParseFloat(labExternal);
    
    // Validate inputs
    if (exam1 > 50 || exam2 > 50 || exam3 > 50) {
      toast({
        title: "Invalid input",
        description: "Series exam marks cannot exceed 50",
        variant: "destructive",
      });
      return;
    }
    
    if (assign1 > 10 || assign2 > 10) {
      toast({
        title: "Invalid input",
        description: "Assignment marks cannot exceed 10",
        variant: "destructive",
      });
      return;
    }
    
    if (test1 > 10 || test2 > 10 || test3 > 10) {
      toast({
        title: "Invalid input",
        description: "Module test marks cannot exceed 10",
        variant: "destructive",
      });
      return;
    }
    
    if (labInt > 50 || labExt > 50) {
      toast({
        title: "Invalid input",
        description: "Lab marks cannot exceed 50",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate scaled series marks
    const totalSeriesMarks = exam1 + exam2 + exam3;
    const maxSeriesMarks = 150; // 3 exams × 50 marks
    const seriesExamWeight = 30;
    const scaledSeriesValue = (totalSeriesMarks / maxSeriesMarks) * seriesExamWeight;
    setScaledSeries(scaledSeriesValue);
    
    // Calculate scaled assignment marks
    const totalAssignmentMarks = assign1 + assign2;
    const maxAssignmentMarks = 20; // 2 assignments × 10 marks
    const assignmentWeight = 10;
    const scaledAssignmentsValue = (totalAssignmentMarks / maxAssignmentMarks) * assignmentWeight;
    setScaledAssignments(scaledAssignmentsValue);
    
    // Calculate scaled module test marks
    const totalModuleTestMarks = test1 + test2 + test3;
    const maxModuleTestMarks = 30; // 3 tests × 10 marks
    const moduleTestWeight = 10;
    const rawScaledModules = (totalModuleTestMarks / maxModuleTestMarks) * moduleTestWeight;
    const minimumModulesMarks = moduleTestWeight * 0.2;
    const scaledModulesValue = Math.max(rawScaledModules, minimumModulesMarks);
    setScaledModules(scaledModulesValue);
    
    // Calculate lab marks if relevant
    let labTotal = 0;
    if (labInt > 0 || labExt > 0) {
      const labWeight = 50;
      const labHalfWeight = labWeight / 2;
      
      const internalContribution = (labInt / 50) * labHalfWeight;
      const externalContribution = (labExt / 50) * labHalfWeight;
      
      setLabInternalMarks(internalContribution);
      setLabExternalMarks(externalContribution);
      
      labTotal = internalContribution + externalContribution;
    }
    
    // Calculate total marks
    const total = scaledSeriesValue + scaledAssignmentsValue + scaledModulesValue + labTotal + grace;
    setTotalMarks(total);
    
    // Check eligibility (minimum 45% of internal marks)
    const minimumRequiredPercentage = 45;
    const maxInternalMarks = 100;
    const minimumMarks = (minimumRequiredPercentage / 100) * maxInternalMarks;
    const isEligibleValue = total >= minimumMarks;
    setIsEligible(isEligibleValue);
    
    if (isEligibleValue) {
      setEligibilityReason("All eligibility criteria met");
      calculateRequiredSEEMarks(total, true);
    } else {
      setEligibilityReason(`Internal marks (${total.toFixed(2)}) are below the minimum requirement (${minimumMarks})`);
    }
  };
  
  // Calculate for 3-credit courses
  const calculateThreeCreditMarks = () => {
    const exam1 = safeParseFloat(series1);
    const exam2 = safeParseFloat(series2);
    const exam3 = safeParseFloat(series3);
    const assign1 = safeParseFloat(assignment1);
    const assign2 = safeParseFloat(assignment2);
    const test1 = safeParseFloat(module1);
    const test2 = safeParseFloat(module2);
    const test3 = safeParseFloat(module3);
    const grace = safeParseFloat(graceMarks);
    
    // Validate inputs (same validation logic as 4-credit)
    
    // Calculate scaled series marks
    const totalSeriesMarks = exam1 + exam2 + exam3;
    const maxSeriesMarks = 150; // 3 exams × 50 marks
    const seriesExamWeight = 15;
    const scaledSeriesValue = (totalSeriesMarks / maxSeriesMarks) * seriesExamWeight;
    setScaledSeries(scaledSeriesValue);
    
    // Calculate scaled assignment marks
    const totalAssignmentMarks = assign1 + assign2;
    const maxAssignmentMarks = 20; // 2 assignments × 10 marks
    const assignmentWeight = 5;
    const scaledAssignmentsValue = (totalAssignmentMarks / maxAssignmentMarks) * assignmentWeight;
    setScaledAssignments(scaledAssignmentsValue);
    
    // Calculate scaled module test marks
    const totalModuleTestMarks = test1 + test2 + test3;
    const maxModuleTestMarks = 30; // 3 tests × 10 marks
    const moduleTestWeight = 5;
    const rawScaledModules = (totalModuleTestMarks / maxModuleTestMarks) * moduleTestWeight;
    const minimumModulesMarks = moduleTestWeight * 0.2;
    const scaledModulesValue = Math.max(rawScaledModules, minimumModulesMarks);
    setScaledModules(scaledModulesValue);
    
    // Calculate total marks
    const total = scaledSeriesValue + scaledAssignmentsValue + scaledModulesValue + grace;
    setTotalMarks(total);
    
    // Check eligibility (minimum 45% of internal marks)
    const minimumRequiredPercentage = 45;
    const maxInternalMarks = 50;
    const minimumMarks = (minimumRequiredPercentage / 100) * maxInternalMarks;
    const isEligibleValue = total >= minimumMarks;
    setIsEligible(isEligibleValue);
    
    if (isEligibleValue) {
      setEligibilityReason("All eligibility criteria met");
      calculateRequiredSEEMarks(total, false);
    } else {
      setEligibilityReason(`Internal marks (${total.toFixed(2)}) are below the minimum requirement (${minimumMarks})`);
    }
  };
  
  // Calculate required SEE marks for each grade
  const calculateRequiredSEEMarks = (internalMarks: number, isFourCredit: boolean) => {
    const maxInternalMarks = isFourCredit ? 100 : 50;
    const maxSEEMarks = 100;
    
    // Internal to SEE ratio is typically 50:50
    const internalWeight = 0.5;
    const seeWeight = 0.5;
    
    // Calculate required SEE marks for each grade
    const updatedRequirements = [
      { grade: "O", points: 10, requiredSEE: 0, finalMarks: 0 },
      { grade: "A+", points: 9, requiredSEE: 0, finalMarks: 0 },
      { grade: "A", points: 8, requiredSEE: 0, finalMarks: 0 },
      { grade: "B+", points: 7, requiredSEE: 0, finalMarks: 0 }
    ];
    
    // Grade thresholds
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
      
      // Calculate final marks percentage
      const finalMarks = internalContribution + (Math.min(requiredSEEMarks, maxSEEMarks) / maxSEEMarks * 100 * seeWeight);
      
      // Update the requirement
      updatedRequirements[index].requiredSEE = Math.ceil(requiredSEEMarks);
      updatedRequirements[index].finalMarks = parseFloat(finalMarks.toFixed(1));
    });
    
    setGradeTableData(updatedRequirements);
  };
  
  const generateGradeTable = (currentMarks: number, isLabMode: boolean) => {
    const newGradeData: {grade: string, points: number, marks: number, finalMarks: number}[] = [];
    
    gradeScale.forEach(({ grade, points, minMarks }) => {
      if (isLabMode) {
        // For lab mode (marks out of 75)
        // For a 4-credit course:
        // Final = ((Internal/2) + Lab Assessment) + (SEE/2)
        // where Internal is out of 50 and Lab Assessment is out of 50
        // So Final = (currentMarks) + (SEE/2) where currentMarks is out of 75
        
        // To achieve minMarks (as a percentage):
        // minMarks = (currentMarks + (SEE/2))/100 * 100
        // Solving for SEE:
        // SEE = (minMarks - currentMarks) * 2
        
        const requiredSEE = Math.max(0, Math.ceil((minMarks - (currentMarks / 75 * 100)) * 2));
        const finalMarks = Math.min(100, (currentMarks / 75 * 100) + (Math.min(requiredSEE, 100) / 2));
        
        // Only show grades that are achievable (SEE marks <= 100)
        if (requiredSEE <= 100) {
          newGradeData.push({ grade, points, marks: requiredSEE, finalMarks });
        }
      } else {
        // For regular mode (marks out of 50)
        // Final = Internal + (SEE/2)
        // To achieve minMarks (as a percentage):
        // minMarks = (Internal + (SEE/2))/100 * 100
        // Solving for SEE:
        // SEE = (minMarks - (Internal/50 * 100)) * 2
        
        const requiredSEE = Math.max(0, Math.ceil((minMarks - (currentMarks / 50 * 100)) * 2));
        const finalMarks = Math.min(100, (currentMarks / 50 * 100) + (Math.min(requiredSEE, 100) / 2));
        
        // Only show grades that are achievable (SEE marks <= 100)
        if (requiredSEE <= 100) {
          newGradeData.push({ grade, points, marks: requiredSEE, finalMarks });
        }
      }
    });
    
    setGradeTableData(newGradeData);
  };
  
  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Internal <span className="text-blue-500">Marks</span> Calculator
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Calculate your internal marks, check exam eligibility, and predict SEE marks needed for each grade
            </p>
          </div>
          
          <Tabs defaultValue="internal" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="internal" className="data-[state=active]:bg-blue-500">
                Internal Marks
              </TabsTrigger>
              <TabsTrigger value="ktu" className="data-[state=active]:bg-blue-500">
                KTU Calculator
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="internal">
              <Card className="glass-card border-dark-800 mb-6 animate-fade-in-up">
                <CardHeader className="bg-dark-900 border-b border-dark-800">
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>Course Type</span>
                    <div className="flex items-center space-x-3">
                      <Label 
                        htmlFor="course-type" 
                        className={`text-sm cursor-pointer ${!isLabMode ? "text-blue-400" : "text-gray-400"}`}
                      >
                        Theory (3-Credit)
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
                        Theory + Lab (4-Credit)
                      </Label>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-gray-400 pt-2">
                    {isLabMode ? 
                      "For courses with lab components (4-credit courses)" : 
                      "For theory-only courses (3-credit courses)"}
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card className="glass-card border-dark-800 animate-fade-in-up">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white flex items-center">
                        Series Exams
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
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
                  
                  <Card className="glass-card border-dark-800 animate-fade-in-up">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white flex items-center">
                        Assignments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-4">
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
                </div>
                
                <div className="space-y-6">
                  <Card className="glass-card border-dark-800 animate-fade-in-up">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white flex items-center">
                        Module Tests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
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
                  
                  {isLabMode ? (
                    <Card className="glass-card border-dark-800 animate-fade-in-up">
                      <CardHeader className="bg-dark-900 border-b border-dark-800">
                        <CardTitle className="text-white flex items-center">
                          Lab Assessment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-4">
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
                  ) : (
                    <Card className="glass-card border-dark-800 animate-fade-in-up">
                      <CardHeader className="bg-dark-900 border-b border-dark-800">
                        <CardTitle className="text-white flex items-center">
                          Grace Marks
                        </CardTitle>
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
                </div>
              </div>
              
              <div className="flex gap-4 my-8">
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
                <div className="space-y-6">
                  <Card className="glass-card border-dark-800 animate-fade-in-up">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white">Results Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                            <div className="text-sm text-gray-400 mb-1">Series Exams</div>
                            <div className="text-lg font-medium text-white">{scaledSeries.toFixed(2)}/30</div>
                            <Progress value={(scaledSeries / 30) * 100} className="h-1 mt-2" />
                          </div>
                          <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                            <div className="text-sm text-gray-400 mb-1">Assignments</div>
                            <div className="text-lg font-medium text-white">{scaledAssignments.toFixed(2)}/10</div>
                            <Progress value={(scaledAssignments / 10) * 100} className="h-1 mt-2" />
                          </div>
                          <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                            <div className="text-sm text-gray-400 mb-1">Module Tests</div>
                            <div className="text-lg font-medium text-white">{scaledModules.toFixed(2)}/10</div>
                            <Progress value={(scaledModules / 10) * 100} className="h-1 mt-2" />
                          </div>
                          
                          {isLabMode ? (
                            <>
                              <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                                <div className="text-sm text-gray-400 mb-1">Lab Internal</div>
                                <div className="text-lg font-medium text-white">{labInternalMarks.toFixed(2)}/25</div>
                                <Progress value={(labInternalMarks / 25) * 100} className="h-1 mt-2" />
                              </div>
                              <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                                <div className="text-sm text-gray-400 mb-1">Lab External</div>
                                <div className="text-lg font-medium text-white">{labExternalMarks.toFixed(2)}/25</div>
                                <Progress value={(labExternalMarks / 25) * 100} className="h-1 mt-2" />
                              </div>
                            </>
                          ) : (
                            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                              <div className="text-sm text-gray-400 mb-1">Grace Marks</div>
                              <div className="text-lg font-medium text-white">{safeParseFloat(graceMarks).toFixed(2)}</div>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-dark-900 p-6 rounded-lg border border-dark-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Total Internal Assessment Marks</div>
                              <div className="text-3xl font-bold text-white">
                                {totalMarks.toFixed(2)} 
                                <span className="text-sm text-gray-500 ml-1">/ {isLabMode ? '75' : '50'}</span>
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                ({(isLabMode ? (totalMarks / 75) : (totalMarks / 50)) * 100}% of internal assessment)
                              </div>
                            </div>
                            
                            <div>
                              {isEligible ? (
                                <div className="flex flex-col items-center text-center">
                                  <div className="bg-green-900/30 p-3 rounded-full border border-green-500/30 mb-2">
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                  </div>
                                  <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/30">
                                    Eligible
                                  </Badge>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center text-center">
                                  <div className="bg-red-900/30 p-3 rounded-full border border-red-500/30 mb-2">
                                    <XCircle className="h-8 w-8 text-red-500" />
                                  </div>
                                  <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-500/30">
                                    Not Eligible
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Separator className="my-4 bg-dark-700" />
                          
                          <div className="text-sm text-gray-300">
                            {eligibilityReason}
                            {!isEligible && (
                              <div className="mt-2 text-yellow-400 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                You need at least 20 marks (out of 50) in the internal assessment to be eligible for the exam.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {isEligible && gradeTableData.length > 0 && (
                    <Card className="glass-card border-dark-800 animate-fade-in-up overflow-hidden">
                      <CardHeader className="bg-dark-900 border-b border-dark-800">
                        <CardTitle className="text-white">
                          {isLabMode ? "Achievable KTU Grades" : "Required SEE Marks for KTU Grades"}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Based on your current internal marks ({totalMarks.toFixed(2)}/{isLabMode ? '75' : '50'})
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-dark-800 border-b border-dark-700">
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Grade</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Points</th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                                  Required SEE Marks
                                </th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                                  Expected Final %
                                </th>
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {gradeTableData.map((item, index) => (
                                <tr 
                                  key={index} 
                                  className={`border-b border-dark-800 ${index % 2 === 0 ? 'bg-dark-950/50' : 'bg-dark-900/50'} hover:bg-dark-800/50 transition-colors`}
                                >
                                  <td className="py-3 px-4">
                                    <span className="font-medium text-white">{item.grade}</span>
                                  </td>
                                  <td className="py-3 px-4">{item.points}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <span className="text-white font-medium">{item.marks}</span>
                                      <span className="text-gray-400 ml-1">/100</span>
                                      {item.marks > 80 && (
                                        <AlertTriangle className="h-4 w-4 ml-2 text-yellow-500" />
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-white">{item.finalMarks.toFixed(1)}%</span>
                                  </td>
                                  <td className="py-3 px-4">
                                    {item.marks <= 50 ? (
                                      <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                                        Easily Achievable
                                      </Badge>
                                    ) : item.marks <= 75 ? (
                                      <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                                        Achievable
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                                        Challenging
                                      </Badge>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="p-4 bg-dark-900/60 border-t border-dark-700">
                          <div className="flex items-center text-sm text-gray-400">
                            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                            <span>SEE marks above 80 may be difficult to achieve. Focus on grades with lower requirements.</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {isEligible && (
                    <Card className="glass-card border-dark-800 animate-fade-in-up">
                      <CardHeader className="bg-dark-900 border-b border-dark-800">
                        <CardTitle className="text-white">KTU Grading System</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="border-b border-dark-700">
                                <th className="text-left py-2 px-3 text-gray-400 font-medium">Grade</th>
                                <th className="text-left py-2 px-3 text-gray-400 font-medium">Points</th>
                                <th className="text-left py-2 px-3 text-gray-400 font-medium">Marks Range</th>
                                <th className="text-left py-2 px-3 text-gray-400 font-medium">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {gradeScale.map((grade, index) => (
                                <tr key={index} className="border-b border-dark-800">
                                  <td className="py-2 px-3 font-medium">{grade.grade}</td>
                                  <td className="py-2 px-3">{grade.points}</td>
                                  <td className="py-2 px-3">
                                    {grade.grade !== 'F' ? 
                                      `${grade.minMarks} - ${index > 0 ? gradeScale[index-1].minMarks - 1 : 100}` : 
                                      `${grade.minMarks} - ${gradeScale[index+1].minMarks - 1}`}
                                  </td>
                                  <td className="py-2 px-3">
                                    {grade.grade === 'F' ? (
                                      <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-500/30">
                                        Fail
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/30">
                                        Pass
                                      </Badge>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ktu">
              <Card className="glass-card border-dark-800 mb-6 animate-fade-in-up">
                <CardHeader className="bg-dark-900 border-b border-dark-800">
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>Course Type</span>
                    <div className="flex items-center space-x-3">
                      <Label 
                        htmlFor="credit-type" 
                        className={`text-sm cursor-pointer ${!isFourCredit ? "text-blue-400" : "text-gray-400"}`}
                      >
                        3-Credit
                      </Label>
                      <Switch 
                        id="credit-type"
                        checked={isFourCredit}
                        onCheckedChange={setIsFourCredit}
                      />
                      <Label 
                        htmlFor="credit-type" 
                        className={`text-sm cursor-pointer ${isFourCredit ? "text-blue-400" : "text-gray-400"}`}
                      >
                        4-Credit
                      </Label>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-gray-400 pt-2">
                    {isFourCredit ? 
                      "For courses with lab components (4-credit courses)" : 
                      "For theory-only courses (3-credit courses)"}
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card className="glass-card border-dark-800 animate-fade-in-up">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white flex items-center">
                        Series Exams
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
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
                  
                  <Card className="glass-card border-dark-800 animate-fade-in-up">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white flex items-center">
                        Assignments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-4">
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
                </div>
                
                <div className="space-y-6">
                  <Card className="glass-card border-dark-800 animate-fade-in-up">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white flex items-center">
                        Module Tests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
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
                  
                  {isFourCredit ? (
                    <Card className="glass-card border-dark-800 animate-fade-in-up">
                      <CardHeader className="bg-dark-900 border-b border-dark-800">
                        <CardTitle className="text-white flex items-center">
                          Lab Assessment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-4">
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
                  ) : (
                    <Card className="glass-card border-dark-800 animate-fade-in-up">
                      <CardHeader className="bg-dark-900 border-b border-dark-800">
                        <CardTitle className="text-white flex items-center">
                          Grace Marks
                        </CardTitle>
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
                </div>
              </div>
              
              <div className="flex gap-4 my-8">
                <Button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateKTUFinalMarks}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Final Marks
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
                <Card className="glass-card border-dark-800 mb-6 animate-fade-in">
                  <CardHeader className="bg-dark-900 border-b border-dark-800">
                    <CardTitle className="text-white">Results</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                        <span className="text-gray-300">Scaled Series Exam Marks</span>
                        <span className="text-green-400 font-medium">{scaledSeries.toFixed(2)}/{isFourCredit ? "30" : "15"}</span>
                      </div>
                      
                      <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                        <span className="text-gray-300">Scaled Assignment Marks</span>
                        <span className="text-green-400 font-medium">{scaledAssignments.toFixed(2)}/{isFourCredit ? "10" : "5"}</span>
                      </div>
                      
                      <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                        <span className="text-gray-300">Scaled Module Test Marks</span>
                        <span className="text-green-400 font-medium">{scaledModules.toFixed(2)}/{isFourCredit ? "10" : "5"}</span>
                      </div>
                      
                      {(isFourCredit && (labInternalMarks !== null || labExternalMarks !== null) && (labInternalMarks > 0 || labExternalMarks > 0)) && (
                        <>
                          <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                            <span className="text-gray-300">Lab Internal Marks</span>
                            <span className="text-green-400 font-medium">{labInternalMarks.toFixed(2)}/25</span>
                          </div>
                          <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                            <span className="text-gray-300">Lab External Marks</span>
                            <span className="text-green-400 font-medium">{labExternalMarks.toFixed(2)}/25</span>
                          </div>
                        </>
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
                      
                      <div className={`rounded-md p-4 flex items-center justify-center ${
                        isEligible ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
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
                              {gradeTableData.map((req, index) => (
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InternalMarks;
