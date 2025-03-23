
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WeightageTemplate {
  name: string;
  test1: number;
  test2: number;
  assignments: number;
  attendance: number;
  lab: number;
  other: number;
}

const InternalMarks = () => {
  const { toast } = useToast();
  
  // Subject info
  const [subjectName, setSubjectName] = useState("");
  const [maxInternal, setMaxInternal] = useState("50");
  const [maxExternal, setMaxExternal] = useState("100");
  const [weightageRatio, setWeightageRatio] = useState("30:70");
  const [minPassPercentage, setMinPassPercentage] = useState("40");
  const [minAttendance, setMinAttendance] = useState("75");
  
  // Component marks
  const [test1, setTest1] = useState({ max: "25", obtained: "" });
  const [test2, setTest2] = useState({ max: "25", obtained: "" });
  const [assignments, setAssignments] = useState({ max: "10", obtained: "" });
  const [lab, setLab] = useState({ max: "10", obtained: "" });
  const [attendance, setAttendance] = useState("");
  const [other, setOther] = useState({ max: "5", obtained: "" });
  
  // Weightage
  const [test1Weight, setTest1Weight] = useState(30);
  const [test2Weight, setTest2Weight] = useState(30);
  const [assignmentsWeight, setAssignmentsWeight] = useState(20);
  const [labWeight, setLabWeight] = useState(10);
  const [attendanceWeight, setAttendanceWeight] = useState(10);
  const [otherWeight, setOtherWeight] = useState(0);
  
  // Target grade
  const [targetGrade, setTargetGrade] = useState("");
  
  // Results
  const [internalMarks, setInternalMarks] = useState<number | null>(null);
  const [internalPercentage, setInternalPercentage] = useState<number | null>(null);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [eligibilityReason, setEligibilityReason] = useState("");
  const [requiredExamMarks, setRequiredExamMarks] = useState<number | null>(null);
  
  // Weightage templates
  const weightageTemplates: WeightageTemplate[] = [
    {
      name: "Standard",
      test1: 30,
      test2: 30,
      assignments: 20,
      attendance: 10,
      lab: 10,
      other: 0
    },
    {
      name: "Test Heavy",
      test1: 40,
      test2: 40,
      assignments: 10,
      attendance: 5,
      lab: 5,
      other: 0
    },
    {
      name: "Lab Focused",
      test1: 25,
      test2: 25,
      assignments: 15,
      attendance: 10,
      lab: 25,
      other: 0
    },
    {
      name: "Balanced",
      test1: 25,
      test2: 25,
      assignments: 25,
      attendance: 15,
      lab: 10,
      other: 0
    }
  ];
  
  // Apply template
  const applyTemplate = (template: WeightageTemplate) => {
    setTest1Weight(template.test1);
    setTest2Weight(template.test2);
    setAssignmentsWeight(template.assignments);
    setLabWeight(template.lab);
    setAttendanceWeight(template.attendance);
    setOtherWeight(template.other);
  };
  
  // Validate that weights sum to 100%
  useEffect(() => {
    const totalWeight = test1Weight + test2Weight + assignmentsWeight + labWeight + attendanceWeight + otherWeight;
    if (totalWeight !== 100) {
      const difference = 100 - totalWeight;
      if (difference > 0) {
        // Add the difference to the first non-zero component
        if (test1Weight > 0) setTest1Weight(test1Weight + difference);
        else if (test2Weight > 0) setTest2Weight(test2Weight + difference);
        else if (assignmentsWeight > 0) setAssignmentsWeight(assignmentsWeight + difference);
        else if (labWeight > 0) setLabWeight(labWeight + difference);
        else if (attendanceWeight > 0) setAttendanceWeight(attendanceWeight + difference);
        else if (otherWeight > 0) setOtherWeight(otherWeight + difference);
      }
    }
  }, [test1Weight, test2Weight, assignmentsWeight, labWeight, attendanceWeight, otherWeight]);
  
  // Calculate internal assessment
  const calculateInternal = () => {
    // Validate inputs
    if (!subjectName) {
      toast({
        title: "Missing subject name",
        description: "Please enter a subject name",
        variant: "destructive",
      });
      return;
    }
    
    const maxInternalVal = parseFloat(maxInternal);
    const maxExternalVal = parseFloat(maxExternal);
    const attendanceVal = parseFloat(attendance);
    const minAttendanceVal = parseFloat(minAttendance);
    
    if (isNaN(maxInternalVal) || isNaN(maxExternalVal) || isNaN(attendanceVal) || isNaN(minAttendanceVal)) {
      toast({
        title: "Invalid inputs",
        description: "Please ensure all fields have valid numerical values",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate normalized component scores
    const test1Score = test1.obtained ? (parseFloat(test1.obtained) / parseFloat(test1.max)) * (test1Weight / 100) : 0;
    const test2Score = test2.obtained ? (parseFloat(test2.obtained) / parseFloat(test2.max)) * (test2Weight / 100) : 0;
    const assignmentsScore = assignments.obtained ? (parseFloat(assignments.obtained) / parseFloat(assignments.max)) * (assignmentsWeight / 100) : 0;
    const labScore = lab.obtained ? (parseFloat(lab.obtained) / parseFloat(lab.max)) * (labWeight / 100) : 0;
    const attendanceScore = (attendanceVal / 100) * (attendanceWeight / 100);
    const otherScore = other.obtained ? (parseFloat(other.obtained) / parseFloat(other.max)) * (otherWeight / 100) : 0;
    
    // Calculate total internal score (0-1 scale)
    const totalScore = test1Score + test2Score + assignmentsScore + labScore + attendanceScore + otherScore;
    
    // Convert to actual marks
    const internalMarksValue = totalScore * maxInternalVal;
    setInternalMarks(parseFloat(internalMarksValue.toFixed(2)));
    
    // Calculate percentage
    const internalPercentageValue = (internalMarksValue / maxInternalVal) * 100;
    setInternalPercentage(parseFloat(internalPercentageValue.toFixed(2)));
    
    // Check eligibility
    const minInternalPercentage = parseFloat(minPassPercentage);
    const isInternalEligible = internalPercentageValue >= minInternalPercentage;
    const isAttendanceEligible = attendanceVal >= minAttendanceVal;
    
    setIsEligible(isInternalEligible && isAttendanceEligible);
    
    if (!isInternalEligible && !isAttendanceEligible) {
      setEligibilityReason("Both internal marks and attendance are below the minimum requirement");
    } else if (!isInternalEligible) {
      setEligibilityReason("Internal marks are below the minimum requirement");
    } else if (!isAttendanceEligible) {
      setEligibilityReason("Attendance is below the minimum requirement");
    } else {
      setEligibilityReason("All eligibility criteria met");
    }
    
    // Calculate required exam marks if target grade is set
    if (targetGrade) {
      const targetPercentage = parseFloat(targetGrade);
      if (!isNaN(targetPercentage)) {
        // Extract internal:external ratio
        const ratioParts = weightageRatio.split(":");
        const internalWeight = parseInt(ratioParts[0]) / 100;
        const externalWeight = parseInt(ratioParts[1]) / 100;
        
        // Calculate required external marks
        const internalContribution = (internalMarksValue / maxInternalVal) * internalWeight * 100;
        const requiredExternalContribution = targetPercentage - internalContribution;
        const requiredExternalPercentage = requiredExternalContribution / externalWeight;
        const requiredExternalMarks = (requiredExternalPercentage / 100) * maxExternalVal;
        
        if (requiredExternalMarks <= maxExternalVal && requiredExternalMarks >= 0) {
          setRequiredExamMarks(parseFloat(requiredExternalMarks.toFixed(2)));
        } else if (requiredExternalMarks > maxExternalVal) {
          setRequiredExamMarks(null);
          toast({
            title: "Target grade not achievable",
            description: "The required exam marks exceed the maximum possible score",
            variant: "destructive",
          });
        } else {
          setRequiredExamMarks(0);
        }
      }
    }
  };
  
  // Reset all inputs
  const resetInputs = () => {
    setSubjectName("");
    setMaxInternal("50");
    setMaxExternal("100");
    setWeightageRatio("30:70");
    setMinPassPercentage("40");
    setMinAttendance("75");
    
    setTest1({ max: "25", obtained: "" });
    setTest2({ max: "25", obtained: "" });
    setAssignments({ max: "10", obtained: "" });
    setLab({ max: "10", obtained: "" });
    setAttendance("");
    setOther({ max: "5", obtained: "" });
    
    setTest1Weight(30);
    setTest2Weight(30);
    setAssignmentsWeight(20);
    setLabWeight(10);
    setAttendanceWeight(10);
    setOtherWeight(0);
    
    setTargetGrade("");
    
    setInternalMarks(null);
    setInternalPercentage(null);
    setIsEligible(null);
    setEligibilityReason("");
    setRequiredExamMarks(null);
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="glass-card border-dark-800 col-span-3 md:col-span-2 animate-fade-in-up">
              <CardHeader className="bg-dark-900 border-b border-dark-800">
                <CardTitle className="text-white">Subject Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Subject Name</label>
                    <Input
                      placeholder="e.g. Data Structures"
                      className="bg-dark-800 border-dark-700 text-white"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Maximum Internal Marks</label>
                      <Input
                        type="number"
                        placeholder="e.g. 50"
                        className="bg-dark-800 border-dark-700 text-white"
                        value={maxInternal}
                        onChange={(e) => setMaxInternal(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Maximum External Marks</label>
                      <Input
                        type="number"
                        placeholder="e.g. 100"
                        className="bg-dark-800 border-dark-700 text-white"
                        value={maxExternal}
                        onChange={(e) => setMaxExternal(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Internal:External Ratio</label>
                      <Select value={weightageRatio} onValueChange={setWeightageRatio}>
                        <SelectTrigger className="bg-dark-800 border-dark-700 text-white">
                          <SelectValue placeholder="Select ratio" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-800 border-dark-700 text-white">
                          <SelectItem value="20:80">20:80</SelectItem>
                          <SelectItem value="25:75">25:75</SelectItem>
                          <SelectItem value="30:70">30:70</SelectItem>
                          <SelectItem value="40:60">40:60</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Minimum Passing Percentage</label>
                      <Input
                        type="number"
                        placeholder="e.g. 40"
                        className="bg-dark-800 border-dark-700 text-white"
                        value={minPassPercentage}
                        onChange={(e) => setMinPassPercentage(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Minimum Attendance Required (%)</label>
                    <Input
                      type="number"
                      placeholder="e.g. 75"
                      className="bg-dark-800 border-dark-700 text-white"
                      value={minAttendance}
                      onChange={(e) => setMinAttendance(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-dark-800 col-span-3 md:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="bg-dark-900 border-b border-dark-800">
                <CardTitle className="text-white">Weightage Templates</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {weightageTemplates.map((template) => (
                    <Button
                      key={template.name}
                      variant="outline"
                      className="w-full justify-start border-dark-700 text-gray-300 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500"
                      onClick={() => applyTemplate(template)}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="glass-card border-dark-800 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="bg-dark-900 border-b border-dark-800">
              <CardTitle className="text-white">Assessment Components</CardTitle>
              <CardDescription className="text-gray-400">
                Enter your marks for each component
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Test 1</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Maximum Marks</div>
                        <Input
                          type="number"
                          className="bg-dark-800 border-dark-700 text-white"
                          value={test1.max}
                          onChange={(e) => setTest1({ ...test1, max: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Obtained Marks</div>
                        <Input
                          type="number"
                          className="bg-dark-800 border-dark-700 text-white"
                          value={test1.obtained}
                          onChange={(e) => setTest1({ ...test1, obtained: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Weightage (%)</label>
                    <div className="pt-7">
                      <Slider
                        value={[test1Weight]}
                        max={100}
                        step={5}
                        onValueChange={(value) => setTest1Weight(value[0])}
                      />
                      <div className="text-center mt-1 text-sm text-gray-400">{test1Weight}%</div>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-dark-800" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Test 2</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Maximum Marks</div>
                        <Input
                          type="number"
                          className="bg-dark-800 border-dark-700 text-white"
                          value={test2.max}
                          onChange={(e) => setTest2({ ...test2, max: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Obtained Marks</div>
                        <Input
                          type="number"
                          className="bg-dark-800 border-dark-700 text-white"
                          value={test2.obtained}
                          onChange={(e) => setTest2({ ...test2, obtained: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Weightage (%)</label>
                    <div className="pt-7">
                      <Slider
                        value={[test2Weight]}
                        max={100}
                        step={5}
                        onValueChange={(value) => setTest2Weight(value[0])}
                      />
                      <div className="text-center mt-1 text-sm text-gray-400">{test2Weight}%</div>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-dark-800" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Assignments/Quizzes</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Maximum Marks</div>
                        <Input
                          type="number"
                          className="bg-dark-800 border-dark-700 text-white"
                          value={assignments.max}
                          onChange={(e) => setAssignments({ ...assignments, max: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Obtained Marks</div>
                        <Input
                          type="number"
                          className="bg-dark-800 border-dark-700 text-white"
                          value={assignments.obtained}
                          onChange={(e) => setAssignments({ ...assignments, obtained: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Weightage (%)</label>
                    <div className="pt-7">
                      <Slider
                        value={[assignmentsWeight]}
                        max={100}
                        step={5}
                        onValueChange={(value) => setAssignmentsWeight(value[0])}
                      />
                      <div className="text-center mt-1 text-sm text-gray-400">{assignmentsWeight}%</div>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-dark-800" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Lab Performance</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Maximum Marks</div>
                        <Input
                          type="number"
                          className="bg-dark-800 border-dark-700 text-white"
                          value={lab.max}
                          onChange={(e) => setLab({ ...lab, max: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Obtained Marks</div>
                        <Input
                          type="number"
                          className="bg-dark-800 border-dark-700 text-white"
                          value={lab.obtained}
                          onChange={(e) => setLab({ ...lab, obtained: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Weightage (%)</label>
                    <div className="pt-7">
                      <Slider
                        value={[labWeight]}
                        max={100}
                        step={5}
                        onValueChange={(value) => setLabWeight(value[0])}
                      />
                      <div className="text-center mt-1 text-sm text-gray-400">{labWeight}%</div>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-dark-800" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Attendance Percentage</label>
                    <Input
                      type="number"
                      placeholder="0-100"
                      className="bg-dark-800 border-dark-700 text-white"
                      min="0"
                      max="100"
                      value={attendance}
                      onChange={(e) => setAttendance(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Weightage (%)</label>
                    <div className="pt-7">
                      <Slider
                        value={[attendanceWeight]}
                        max={100}
                        step={5}
                        onValueChange={(value) => setAttendanceWeight(value[0])}
                      />
                      <div className="text-center mt-1 text-sm text-gray-400">{attendanceWeight}%</div>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-dark-800" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Other Components (Optional)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Maximum Marks</div>
                        <Input
                          type="number"
                          className="bg-dark-800 border-dark-700 text-white"
                          value={other.max}
                          onChange={(e) => setOther({ ...other, max: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Obtained Marks</div>
                        <Input
                          type="number"
                          className="bg-dark-800 border-dark-700 text-white"
                          value={other.obtained}
                          onChange={(e) => setOther({ ...other, obtained: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Weightage (%)</label>
                    <div className="pt-7">
                      <Slider
                        value={[otherWeight]}
                        max={100}
                        step={5}
                        onValueChange={(value) => setOtherWeight(value[0])}
                      />
                      <div className="text-center mt-1 text-sm text-gray-400">{otherWeight}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-dark-800 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="bg-dark-900 border-b border-dark-800">
              <CardTitle className="text-white">Target Grade (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Target Final Percentage
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 80"
                  className="bg-dark-800 border-dark-700 text-white"
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-4 mb-8">
            <Button 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={calculateInternal}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-400 hover:text-gray-300"
              onClick={resetInputs}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          {internalMarks !== null && (
            <Card className="glass-card border-dark-800 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader className="bg-dark-900 border-b border-dark-800">
                <CardTitle className="text-white">Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg text-gray-300 mb-3">Internal Assessment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Marks</div>
                        <div className="text-3xl font-bold text-white">
                          {internalMarks} <span className="text-sm text-gray-500">/ {maxInternal}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Percentage</div>
                        <div className="text-3xl font-bold text-white">{internalPercentage}%</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress 
                        value={internalPercentage} 
                        className={cn(
                          "h-2 bg-dark-800",
                          internalPercentage! < 40 ? "bg-red-500" : 
                          internalPercentage! < 60 ? "bg-yellow-500" : 
                          "bg-blue-500"
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator className="bg-dark-800" />
                  
                  <div>
                    <h3 className="text-lg text-gray-300 mb-3">Exam Eligibility</h3>
                    <div className="flex items-center gap-3 mb-2">
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
                    </div>
                    <div className="text-sm text-gray-400">{eligibilityReason}</div>
                  </div>
                  
                  {requiredExamMarks !== null && (
                    <>
                      <Separator className="bg-dark-800" />
                      
                      <div>
                        <h3 className="text-lg text-gray-300 mb-3">Required Final Exam Marks</h3>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-white">
                            {requiredExamMarks} <span className="text-sm text-gray-500">/ {maxExternal}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            {requiredExamMarks / parseFloat(maxExternal) > 0.8 ? (
                              <div className="text-red-400 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Difficult to achieve
                              </div>
                            ) : requiredExamMarks / parseFloat(maxExternal) > 0.6 ? (
                              <div className="text-yellow-400 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Challenging but possible
                              </div>
                            ) : (
                              <div className="text-green-400 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Achievable
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          To achieve your target grade of {targetGrade}%
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
