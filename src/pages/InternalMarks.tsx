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

/**
 * KTU INTERNAL MARKS CALCULATOR - SECTION GUIDE
 * --------------------------------------------
 * 
 * This component calculates internal marks for KTU courses and displays eligibility for SEE exam.
 * It also shows achievable grades based on current internal marks.
 * 
 * MAIN SECTIONS:
 * 
 * 1. GRADE SCALE DEFINITION (Lines 15-23)
 *    - Defines the KTU grading system (O, A+, A, etc.)
 * 
 * 2. STATE VARIABLES (Lines 30-60)
 *    - Mode toggle: isFourCredit (3-credit vs 4-credit courses)
 *    - Input values: series exams, assignments, modules, lab marks
 *    - Results: scaled marks, total marks, eligibility, grade table
 * 
 * 3. CALCULATION FUNCTIONS
 *    - calculateKTUFinalMarks: Main calculation function (Line 275)
 *    - calculateFourCreditMarks: 4-credit course calculations (Line 300)
 *    - calculateThreeCreditMarks: 3-credit course calculations (Line 365)
 *    - calculateRequiredSEEMarks: Calculates SEE marks needed for each grade (Line 425)
 * 
 * 4. UI SECTIONS
 *    - Course Type Toggle: Switch between 3 and 4-credit courses (Line 520)
 *    - Input Fields Section:
 *      - Series Exams Input (Line 550)
 *      - Assignment Input (Line 610)
 *      - Module Tests Input (Line 650)
 *      - Lab Marks Input (4-credit only) (Line 735)
 *      - Grace Marks Input (Line 770)
 *    - Calculate Button: Triggers calculation (Line 785)
 *    - Results Section: Only visible after calculation (Line 800)
 *      - Scaled marks breakdown (Line 810)
 *      - Total marks display (Line 850)
 *      - Eligibility status (Line 860)
 *      - Achievable Grades Table: Only visible if eligible (Line 870)
 *        THIS IS WHERE THE ACHIEVABLE GRADES ARE SHOWN
 * 
 * NOTE: The Achievable Grades table (Line 870) will ONLY appear when:
 * 1. You've clicked "Calculate Internal Marks" button AND
 * 2. Your internal marks meet the minimum requirement (45/100 for 4-credit or 20/50 for 3-credit)
 */

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

// Define the consistent grade table data type
type GradeTableData = { grade: string; points: number; marks: number; finalMarks: number; };

const InternalMarks = () => {
  const { toast } = useToast();
  
  // Mode toggle
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
  const [gradeTableData, setGradeTableData] = useState<GradeTableData[]>([]);
  
  // Safe parsing function with max limit
  const safeParseFloat = (value: string, maxValue: number = Infinity): number => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return 0;
    return Math.min(parsed, maxValue);
  };
  
  // Reset all values when mode changes
  useEffect(() => {
    resetCalculator();
  }, [isFourCredit]);
  
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
  
  const calculateRegularMode = () => {
    const series1Value = safeParseFloat(series1, 50);
    const series2Value = safeParseFloat(series2, 50);
    const series3Value = safeParseFloat(series3, 50);
    const assignment1Value = safeParseFloat(assignment1, 10);
    const assignment2Value = safeParseFloat(assignment2, 10);
    const module1Value = safeParseFloat(module1, 10);
    const module2Value = safeParseFloat(module2, 10);
    const module3Value = safeParseFloat(module3, 10);
    const graceValue = safeParseFloat(graceMarks, 10);
    
    // 1. Series Marks Scaling
    const seriesAvg = (series1Value + series2Value + series3Value) / 3;
    const scaledSeriesValue = (seriesAvg / 50) * 30;
    setScaledSeries(scaledSeriesValue);
    
    // 2. Assignment Marks Scaling
    const assignmentTotal = assignment1Value + assignment2Value;
    const scaledAssignmentsValue = (assignmentTotal / 20) * 10;
    setScaledAssignments(scaledAssignmentsValue);
    
    // 3. Module Marks Scaling
    const moduleTotal = module1Value + module2Value + module3Value;
    const scaledModulesValue = (moduleTotal / 30) * 10;
    setScaledModules(scaledModulesValue);
    
    // 4. Total Marks Calculation (Regular Mode)
    // Total Marks = Scaled Series + Scaled Assignments + Scaled Modules + Grace Marks
    const totalValue = scaledSeriesValue + scaledAssignmentsValue + scaledModulesValue + graceValue;
    setTotalMarks(totalValue);
    
    // 5. Eligibility Criteria (Regular Mode)
    // Eligibility = Total Marks ≥ 20
    const eligibleValue = totalValue >= 20;
    setIsEligible(eligibleValue);
    
    if (eligibleValue) {
      setEligibilityReason("All eligibility criteria met");
      // Calculate required SEE marks for regular mode
      calculateRegularSEEMarks(totalValue);
    } else {
      setEligibilityReason("Internal marks are below the minimum requirement of 20/50");
    }
  };
  
  // Calculate required SEE marks for Regular Mode
  const calculateRegularSEEMarks = (internalMarks: number) => {
    const maxInternalMarks = 50; // Regular mode is out of 50
    
    // Calculate required SEE marks for each grade
    const updatedRequirements: GradeTableData[] = [];
    
    gradeScale.forEach(({ grade, points, minMarks }) => {
      // Current percentage is internal marks as percentage of maxInternalMarks
      const currentPercentage = (internalMarks / maxInternalMarks) * 100;
      
      // For Regular Mode: Required SEE Marks = Ceiling((Minimum Grade Percentage - Current Percentage) × 2)
      const requiredSEE = Math.ceil((minMarks - currentPercentage) * 2);
      
      // Only include grades that are achievable (SEE marks <= 100 and > 0)
      if (requiredSEE <= 100 && requiredSEE > 0) {
        const finalMarks = currentPercentage + (requiredSEE / 2);
        updatedRequirements.push({
          grade,
          points,
          marks: requiredSEE,
          finalMarks
        });
      }
    });
    
    // Sort by grade value (higher grades first)
    updatedRequirements.sort((a, b) => {
      const gradeOrder = { 'O': 6, 'A+': 5, 'A': 4, 'B+': 3, 'C+': 2, 'C': 1, 'F': 0 };
      return (gradeOrder[a.grade as keyof typeof gradeOrder] || 0) - 
             (gradeOrder[b.grade as keyof typeof gradeOrder] || 0);
    }).reverse();
    
    setGradeTableData(updatedRequirements);
  };
  
  const calculateLabMode = () => {
    const series1Value = safeParseFloat(series1, 50);
    const series2Value = safeParseFloat(series2, 50);
    const series3Value = safeParseFloat(series3, 50);
    const assignment1Value = safeParseFloat(assignment1, 10);
    const assignment2Value = safeParseFloat(assignment2, 10);
    const module1Value = safeParseFloat(module1, 10);
    const module2Value = safeParseFloat(module2, 10);
    const module3Value = safeParseFloat(module3, 10);
    const labInternalValue = safeParseFloat(labInternal, 50);
    const labExternalValue = safeParseFloat(labExternal, 50);
    
    // Calculate scaled marks for internal components first (for eligibility)
    // 1. Series Marks Scaling
    const seriesAvg = (series1Value + series2Value + series3Value) / 3;
    const scaledSeriesValue = (seriesAvg / 50) * 30;
    setScaledSeries(scaledSeriesValue);
    
    // 2. Assignment Marks Scaling
    const assignmentTotal = assignment1Value + assignment2Value;
    const scaledAssignmentsValue = (assignmentTotal / 20) * 10;
    setScaledAssignments(scaledAssignmentsValue);
    
    // 3. Module Marks Scaling
    const moduleTotal = module1Value + module2Value + module3Value;
    const scaledModulesValue = (moduleTotal / 30) * 10;
    setScaledModules(scaledModulesValue);
    
    // Calculate total internal marks (out of 50 for eligibility check)
    const totalInternalValue = scaledSeriesValue + scaledAssignmentsValue + scaledModulesValue;
    
    // Lab components - Lab Marks Scaling
    // Lab Internal Marks
    const labInternalMarksValue = (labInternalValue / 50) * 25;
    setLabInternalMarks(labInternalMarksValue);
    
    // Lab External Marks
    const labExternalMarksValue = (labExternalValue / 50) * 25;
    setLabExternalMarks(labExternalMarksValue);
    
    // Calculate final total (out of 75) as per formula:
    // Final Total = (Total Internal Marks ÷ 2) + Lab Internal Scaled + Lab External Scaled
    const totalValue = (totalInternalValue / 2) + labInternalMarksValue + labExternalMarksValue;
    setTotalMarks(totalValue);
    
    // Check eligibility based on internal marks (must be >= 20 out of 50)
    const eligibleValue = totalInternalValue >= 20;
    setIsEligible(eligibleValue);
    
    if (eligibleValue) {
      setEligibilityReason("All eligibility criteria met");
      // Calculate required SEE marks for lab mode
      calculateLabSEEMarks(totalValue);
    } else {
      setEligibilityReason("Internal marks are below the minimum requirement of 20/50");
    }
  };
  
  // Calculate required SEE marks for Lab Mode
  const calculateLabSEEMarks = (internalMarks: number) => {
    // Lab mode has total marks out of 75
    
    // Calculate required SEE marks for each grade
    const updatedRequirements: GradeTableData[] = [];
    
    gradeScale.forEach(({ grade, points, minMarks }) => {
      // For Lab Mode: Required SEE Marks = Ceiling((Minimum Grade Percentage - (Current Total ÷ 75 × 50)) × 2)
      const currentScaledPercentage = (internalMarks / 75) * 50;
      const requiredSEE = Math.ceil((minMarks - currentScaledPercentage) * 2);
      
      // Only include grades that are achievable (SEE marks <= 100 and > 0)
      if (requiredSEE <= 100 && requiredSEE > 0) {
        const finalMarks = (internalMarks / 75 * 100) + (requiredSEE / 2);
        updatedRequirements.push({
          grade,
          points,
          marks: requiredSEE,
          finalMarks
        });
      }
    });
    
    // Sort by grade value (higher grades first)
    updatedRequirements.sort((a, b) => {
      const gradeOrder = { 'O': 6, 'A+': 5, 'A': 4, 'B+': 3, 'C+': 2, 'C': 1, 'F': 0 };
      return (gradeOrder[a.grade as keyof typeof gradeOrder] || 0) - 
             (gradeOrder[b.grade as keyof typeof gradeOrder] || 0);
    }).reverse();
    
    setGradeTableData(updatedRequirements);
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
    const series1Value = safeParseFloat(series1, 50);
    const series2Value = safeParseFloat(series2, 50);
    const series3Value = safeParseFloat(series3, 50);
    const assignment1Value = safeParseFloat(assignment1, 10);
    const assignment2Value = safeParseFloat(assignment2, 10);
    const module1Value = safeParseFloat(module1, 10);
    const module2Value = safeParseFloat(module2, 10);
    const module3Value = safeParseFloat(module3, 10);
    const graceValue = safeParseFloat(graceMarks, 10);
    const labIntValue = safeParseFloat(labInternal, 50);
    const labExtValue = safeParseFloat(labExternal, 50);
    
    // Calculate scaled series marks
    const seriesAvg = (series1Value + series2Value + series3Value) / 3;
    const scaledSeriesValue = (seriesAvg / 50) * 30;
    setScaledSeries(scaledSeriesValue);
    
    // Calculate scaled assignment marks
    const assignmentTotal = assignment1Value + assignment2Value;
    const scaledAssignmentsValue = (assignmentTotal / 20) * 10;
    setScaledAssignments(scaledAssignmentsValue);
    
    // Calculate scaled module test marks
    const moduleTotal = module1Value + module2Value + module3Value;
    const scaledModulesValue = (moduleTotal / 30) * 10;
    setScaledModules(scaledModulesValue);
    
    // Calculate lab marks
    let labInternalMarksValue = 0;
    let labExternalMarksValue = 0;
    
    if (labIntValue > 0 || labExtValue > 0) {
      // Lab Internal and External are each out of 50, scaled to 25
      labInternalMarksValue = (labIntValue / 50) * 25;
      labExternalMarksValue = (labExtValue / 50) * 25;
      
      setLabInternalMarks(labInternalMarksValue);
      setLabExternalMarks(labExternalMarksValue);
    }
    
    // Calculate total marks (out of 100)
    const total = scaledSeriesValue + scaledAssignmentsValue + scaledModulesValue + labInternalMarksValue + labExternalMarksValue + graceValue;
    setTotalMarks(total);
    
    // Check eligibility (minimum 45% of internal marks)
    /* ==== ELIGIBILITY CHECK (4-CREDIT COURSE) ====
     * This determines if:
     * 1. The student is eligible for the SEE exam
     * 2. Whether to show the Achievable Grades table
     * 
     * For 4-credit courses:
     * - Minimum required: 45/100 (45%)
     * - If marks are below this threshold, the Achievable Grades table will NOT appear
     */
    const minimumRequiredPercentage = 45;
    const maxInternalMarks = 100;
    const minimumMarks = (minimumRequiredPercentage / 100) * maxInternalMarks;
    const isEligibleValue = total >= minimumMarks;
    setIsEligible(isEligibleValue);
    
    if (isEligibleValue) {
      setEligibilityReason("All eligibility criteria met");
      // This function calculates what grades are achievable and what SEE marks are needed
      // Its results will be shown in the Achievable Grades table
      calculateRequiredSEEMarks(total, true);
    } else {
      setEligibilityReason(`Internal marks (${total.toFixed(2)}) are below the minimum requirement (${minimumMarks})`);
    }
  };
  
  // Calculate for 3-credit courses
  const calculateThreeCreditMarks = () => {
    const series1Value = safeParseFloat(series1, 50);
    const series2Value = safeParseFloat(series2, 50);
    const series3Value = safeParseFloat(series3, 50);
    const assignment1Value = safeParseFloat(assignment1, 10);
    const assignment2Value = safeParseFloat(assignment2, 10);
    const module1Value = safeParseFloat(module1, 10);
    const module2Value = safeParseFloat(module2, 10);
    const module3Value = safeParseFloat(module3, 10);
    const graceValue = safeParseFloat(graceMarks, 10);
    
    // Calculate scaled series marks using the precise formula
    const seriesAvg = (series1Value + series2Value + series3Value) / 3;
    const scaledSeriesValue = (seriesAvg / 50) * 30;
    setScaledSeries(scaledSeriesValue);
    
    // Calculate scaled assignment marks
    const assignmentTotal = assignment1Value + assignment2Value;
    const scaledAssignmentsValue = (assignmentTotal / 20) * 10;
    setScaledAssignments(scaledAssignmentsValue);
    
    // Calculate scaled module test marks
    const moduleTotal = module1Value + module2Value + module3Value;
    const scaledModulesValue = (moduleTotal / 30) * 10;
    setScaledModules(scaledModulesValue);
    
    // Calculate total marks (out of 50)
    const total = scaledSeriesValue + scaledAssignmentsValue + scaledModulesValue + graceValue;
    setTotalMarks(total);
    
    // Check eligibility (minimum 20 out of 50)
    /* ==== ELIGIBILITY CHECK (3-CREDIT COURSE) ====
     * This determines if:
     * 1. The student is eligible for the SEE exam
     * 2. Whether to show the Achievable Grades table
     * 
     * For 3-credit courses:
     * - Minimum required: 20/50 (40%)
     * - If marks are below this threshold, the Achievable Grades table will NOT appear
     */
    const isEligibleValue = total >= 20;
    setIsEligible(isEligibleValue);
    
    if (isEligibleValue) {
      setEligibilityReason("All eligibility criteria met");
      // This function calculates what grades are achievable and what SEE marks are needed
      // Its results will be shown in the Achievable Grades table
      calculateRequiredSEEMarks(total, false);
    } else {
      setEligibilityReason(`Internal marks (${total.toFixed(2)}) are below the minimum requirement (20/50)`);
    }
  };
  
  // Calculate required SEE marks for each grade
  const calculateRequiredSEEMarks = (internalMarks: number, isFourCredit: boolean) => {
    /* ==== ACHIEVABLE GRADES CALCULATION ====
     * This function calculates what SEE (Semester End Exam) marks 
     * are needed to achieve each possible grade.
     * 
     * The results populate the "Achievable Grades" table that appears
     * at the bottom of the results section.
     * 
     * This is only called when a student is eligible for the SEE exam
     * (internal marks meet minimum requirements).
     */
    const maxInternalMarks = isFourCredit ? 100 : 50;
    const maxSEEMarks = 100;
    
    // Calculate required SEE marks for each grade
    const updatedRequirements: GradeTableData[] = [];
    
    gradeScale.forEach(({ grade, points, minMarks }) => {
      // Calculate required SEE marks based on the formula:
      // For Regular Mode (3 & 4 credit): 
      // Required SEE Marks = Ceiling((Minimum Grade Percentage - Current Percentage) × 2)
      
      // Current percentage is internal marks as percentage of maxInternalMarks
      const currentPercentage = (internalMarks / maxInternalMarks) * 100;
      
      // Required SEE marks
      const requiredSEE = Math.ceil((minMarks - currentPercentage) * 2);
      
      // Only include grades that are achievable (SEE marks <= 100 and > 0)
      if (requiredSEE <= 100 && requiredSEE > 0) {
        // The final marks would be currentPercentage + (requiredSEE/2)
        const finalMarks = currentPercentage + (requiredSEE / 2);
        updatedRequirements.push({
          grade,
          points,
          marks: requiredSEE,
          finalMarks
        });
      }
    });
    
    // Sort by grade value (higher grades first)
    updatedRequirements.sort((a, b) => {
      const gradeOrder = { 'O': 6, 'A+': 5, 'A': 4, 'B+': 3, 'C+': 2, 'C': 1, 'F': 0 };
      return (gradeOrder[b.grade as keyof typeof gradeOrder] || 0) - 
             (gradeOrder[a.grade as keyof typeof gradeOrder] || 0);
    });
    
    // This sets the data that will appear in the Achievable Grades table
    setGradeTableData(updatedRequirements);
  };
  
  const generateGradeTable = (currentMarks: number, isFourCredit: boolean) => {
    const newGradeData: GradeTableData[] = [];
    
    gradeScale.forEach(({ grade, points, minMarks }) => {
      if (isFourCredit) {
        // For 4-credit courses, calculate required SEE marks
        // Current marks are out of 100
        const currentPercentage = (currentMarks / 100) * 100; // Already in percentage
        const requiredSEE = Math.ceil((minMarks - currentPercentage) * 2);
        
        // Only show grades that are achievable (SEE marks <= 100 and > 0)
        if (requiredSEE <= 100 && requiredSEE > 0) {
          const finalMarks = Math.min(100, currentPercentage + (Math.min(requiredSEE, 100) / 2));
          newGradeData.push({ grade, points, marks: requiredSEE, finalMarks });
        }
      } else {
        // 3-credit courses calculation
        const requiredSEE = Math.ceil((minMarks - (currentMarks / 50 * 100)) * 2);
        
        // Only show grades that are achievable (SEE marks <= 100 and > 0)
        if (requiredSEE <= 100 && requiredSEE > 0) {
          const finalMarks = Math.min(100, (currentMarks / 50 * 100) + (Math.min(requiredSEE, 100) / 2));
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
          
          <Tabs defaultValue="ktu" className="w-full">
            <TabsList className="grid grid-cols-1 mb-6">
              <TabsTrigger value="ktu" className="data-[state=active]:bg-blue-500">
                KTU Calculator
              </TabsTrigger>
            </TabsList>
            
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
                      "For courses with heavier credit weighting, usually with lab components" : 
                      "For standard theory courses"}
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

                  {isFourCredit && (
                    <Card className="glass-card border-dark-800 animate-fade-in-up mt-6">
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
                  )}
                </div>
              </div>
              
              {/* ==== CALCULATION BUTTONS SECTION ====
               * This is where you start the process to see achievable grades.
               * 
               * 1. Click "Calculate Internal Marks" button to:
               *    - Calculate your total internal marks
               *    - Check if you're eligible for the SEE exam
               *    - Display the achievable grades table (if eligible)
               * 
               * 2. The "Reset" button clears all values
               */}
              <div className="flex gap-4 my-8">
                <Button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => calculateKTUFinalMarks()}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Internal Marks
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
                    <CardTitle className="text-white flex items-center">
                      <Calculator className="h-5 w-5 text-blue-500 mr-2" />
                      Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                        <span className="text-gray-300">Scaled Series Exam Marks</span>
                        <span className="text-green-400 font-medium">{scaledSeries.toFixed(2)}/30</span>
                      </div>
                      
                      <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                        <span className="text-gray-300">Scaled Assignment Marks</span>
                        <span className="text-green-400 font-medium">{scaledAssignments.toFixed(2)}/10</span>
                      </div>
                      
                      <div className="bg-dark-800 rounded-md p-3 flex justify-between items-center">
                        <span className="text-gray-300">Scaled Module Test Marks</span>
                        <span className="text-green-400 font-medium">{scaledModules.toFixed(2)}/10</span>
                      </div>
                      
                      {isFourCredit && (
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
                      
                      {/* ===== ACHIEVABLE GRADES SECTION ===== 
                          This section ONLY appears when:
                          1. The user has clicked "Calculate Internal Marks" button
                          2. The calculated marks meet the eligibility criteria:
                             - For 4-credit courses: At least 45/100
                             - For 3-credit courses: At least 20/50
                          
                          If you don't see this section, you need to:
                          1. Enter higher marks in the input fields
                          2. Click the "Calculate Internal Marks" button again
                      */}
                      {isEligible && gradeTableData.length > 0 && (
                        <>
                          <Separator className="bg-dark-800 my-4" />
                          
                          {/* ACHIEVABLE GRADES TABLE - STARTS HERE */}
                          <div>
                            <h3 className="text-lg text-white mb-3">Achievable Grades</h3>
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
                                      <td className="px-4 py-3 text-sm text-white">{req.marks}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          {/* ACHIEVABLE GRADES TABLE - ENDS HERE */}
                        </>
                      )}
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
