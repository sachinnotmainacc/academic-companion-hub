
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Calculator as CalcIcon, AlertTriangle, BarChart, Building2, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

// Company data with tier categorization
const companyTiers = {
  'S+': { minCGPA: 8.0, companies: [], ctc: '₹30+ LPA' },
  'A+': { minCGPA: 7.5, companies: [], ctc: '₹20-30 LPA' },
  'A': { minCGPA: 7.5, companies: [], ctc: '₹10-20 LPA' },
  'B': { minCGPA: 7.0, companies: [], ctc: '₹5-10 LPA' },
  'C': { minCGPA: 6.0, companies: [], ctc: 'Below ₹5 LPA' }
};

const companyData = [
  // S+ Tier Companies (₹30+ LPA)
  { name: 'McKinsey & Company', tier: 'S+', cgpa: 8.0 },
  { name: 'Boston Consulting Group', tier: 'S+', cgpa: 8.0 },
  { name: 'Bain & Company', tier: 'S+', cgpa: 8.0 },
  { name: 'Goldman Sachs', tier: 'S+', cgpa: 8.0 },
  { name: 'Morgan Stanley', tier: 'S+', cgpa: 8.0 },
  { name: 'Tower Research Capital', tier: 'S+', cgpa: 8.0 },
  { name: 'Jane Street', tier: 'S+', cgpa: 8.0 },
  { name: 'Google', tier: 'S+', cgpa: 8.0 },
  { name: 'Facebook', tier: 'S+', cgpa: 8.0 },
  { name: 'Apple', tier: 'S+', cgpa: 8.0 },
  { name: 'Microsoft', tier: 'S+', cgpa: 7.5 },
  { name: 'Amazon (for select roles)', tier: 'S+', cgpa: 7.5 },
  { name: 'Uber (for select roles)', tier: 'S+', cgpa: 7.5 },
  { name: 'DE Shaw & Co.', tier: 'S+', cgpa: 8.0 },
  { name: 'WorldQuant', tier: 'S+', cgpa: 8.0 },
  { name: 'BlackRock', tier: 'S+', cgpa: 7.5 },
  
  // A+ Tier Companies (₹20-30 LPA)
  { name: 'Adobe', tier: 'A+', cgpa: 7.5 },
  { name: 'Oracle', tier: 'A+', cgpa: 7.5 },
  { name: 'SAP Labs', tier: 'A+', cgpa: 7.5 },
  { name: 'Cisco Systems', tier: 'A+', cgpa: 7.5 },
  { name: 'Qualcomm', tier: 'A+', cgpa: 7.5 },
  { name: 'Intel', tier: 'A+', cgpa: 7.5 },
  { name: 'Samsung R&D', tier: 'A+', cgpa: 7.5 },
  { name: 'Flipkart', tier: 'A+', cgpa: 7.5 },
  { name: 'Myntra', tier: 'A+', cgpa: 7.5 },
  { name: 'Ola Cabs', tier: 'A+', cgpa: 7.5 },
  { name: 'Paytm', tier: 'A+', cgpa: 7.5 },
  { name: 'Zomato', tier: 'A+', cgpa: 7.5 },
  { name: 'Swiggy', tier: 'A+', cgpa: 7.5 },
  { name: 'Infosys (for select roles)', tier: 'A+', cgpa: 7.5 },
  { name: 'Wipro (for select roles)', tier: 'A+', cgpa: 7.5 },
  { name: 'Tata Consultancy Services (for select roles)', tier: 'A+', cgpa: 7.5 },
  { name: 'Reliance Industries (for select roles)', tier: 'A+', cgpa: 7.5 },

  // A Tier Companies (₹10-20 LPA)
  { name: 'IBM India', tier: 'A', cgpa: 7.5 },
  { name: 'HCL Technologies', tier: 'A', cgpa: 7.5 },
  { name: 'Tech Mahindra', tier: 'A', cgpa: 7.5 },
  { name: 'Cognizant', tier: 'A', cgpa: 7.5 },
  { name: 'Capgemini', tier: 'A', cgpa: 7.5 },
  { name: 'Mindtree', tier: 'A', cgpa: 7.0 },
  { name: 'Mphasis', tier: 'A', cgpa: 7.0 },
  { name: 'Hexaware Technologies', tier: 'A', cgpa: 7.0 },
  { name: 'Birlasoft', tier: 'A', cgpa: 7.0 },
  { name: 'Cyient', tier: 'A', cgpa: 7.0 },
  { name: 'KPIT Technologies', tier: 'A', cgpa: 7.0 },
  { name: 'L&T Infotech', tier: 'A', cgpa: 7.5 },
  { name: 'Sonata Software', tier: 'A', cgpa: 7.0 },
  { name: 'Sasken Technologies', tier: 'A', cgpa: 7.0 },
  
  // B Tier Companies (₹5-10 LPA)
  { name: 'Small startups or entry-level roles in various industries', tier: 'B', cgpa: 6.0 },
  { name: 'ABC Tech Solutions', tier: 'B', cgpa: 6.0 },
  { name: 'XYZ Innovations', tier: 'B', cgpa: 6.0 },
  { name: 'PQR Software', tier: 'B', cgpa: 6.0 },
  { name: 'Startup A', tier: 'B', cgpa: 6.0 },
  { name: 'Tech Co.', tier: 'B', cgpa: 6.0 },
  { name: 'Data Systems', tier: 'B', cgpa: 6.0 },
  { name: 'Future Tech', tier: 'B', cgpa: 6.0 },
  { name: 'Innovate Solutions', tier: 'B', cgpa: 6.0 },
  { name: 'Creative Labs', tier: 'B', cgpa: 6.0 },
  { name: 'WNS Global Services', tier: 'B', cgpa: 7.5 },
  { name: 'EXL Service', tier: 'B', cgpa: 7.5 },
  { name: 'Genpact', tier: 'B', cgpa: 7.5 },
  { name: 'Hinduja Global Solutions', tier: 'B', cgpa: 7.5 },

  // C Tier Companies (Below ₹5 LPA)
  { name: 'Firstsource Solutions', tier: 'C', cgpa: 6.0 },
  { name: 'Concentrix', tier: 'C', cgpa: 6.0 },
  { name: 'Sutherland Global Services', tier: 'C', cgpa: 6.0 },
  { name: 'Teleperformance', tier: 'C', cgpa: 6.0 },
  { name: 'Infosys BPM', tier: 'C', cgpa: 6.0 },
  { name: 'Wipro BPS', tier: 'C', cgpa: 6.0 },
  { name: 'TCS BPS', tier: 'C', cgpa: 6.0 },
  { name: 'HGS', tier: 'C', cgpa: 6.0 },
  { name: 'Tech Mahindra BPS', tier: 'C', cgpa: 6.0 },
  { name: 'Accenture Operations', tier: 'C', cgpa: 6.0 },
  { name: 'Capgemini BPO', tier: 'C', cgpa: 6.0 },
  { name: 'Genpact Headstrong', tier: 'C', cgpa: 6.0 },
  { name: 'IBM Global Process Services', tier: 'C', cgpa: 6.0 },
  { name: 'Cognizant BPS', tier: 'C', cgpa: 6.0 },
  { name: 'Dell International Services', tier: 'C', cgpa: 6.0 },
  { name: 'Wipro Technologies', tier: 'C', cgpa: 6.0 },
  { name: 'Tata Elxsi', tier: 'C', cgpa: 6.0 },
  { name: 'Sasken Communication Technologies', tier: 'C', cgpa: 6.0 },
  { name: 'Mphasis Limited', tier: 'C', cgpa: 6.0 },
  { name: 'Oracle Financial Services Software', tier: 'C', cgpa: 6.0 },
  { name: 'Siemens Information Systems', tier: 'C', cgpa: 6.0 },
  { name: 'Robert Bosch Engineering', tier: 'C', cgpa: 6.0 },
  { name: 'Honeywell Technology Solutions', tier: 'C', cgpa: 6.0 },
  { name: 'GE India Technology Centre', tier: 'C', cgpa: 6.0 }
];

// Process company data for display and filtering
const processCompanyData = () => {
  const tierData = {...companyTiers};
  
  companyData.forEach(company => {
    if (tierData[company.tier]) {
      if (!tierData[company.tier].companies.includes(company.name)) {
        tierData[company.tier].companies.push(company.name);
      }
    }
  });
  
  return tierData;
};

// Pie chart colors
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

const CGPA = () => {
  const { toast } = useToast();
  const processedCompanyTiers = processCompanyData();
  
  // User inputs
  const [currentCGPA, setCurrentCGPA] = useState("");
  const [completedSemesters, setCompletedSemesters] = useState("4");
  const [targetCGPA, setTargetCGPA] = useState("");
  const [totalSemesters, setTotalSemesters] = useState("8");
  
  // Results
  const [requiredCGPA, setRequiredCGPA] = useState<number | null>(null);
  const [isAchievable, setIsAchievable] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Chart data
  const [chartData, setChartData] = useState<any[]>([]);
  const [semesterValues, setSemesterValues] = useState<{[key: string]: string}>({});
  const [eligibleCompanies, setEligibleCompanies] = useState<{[key: string]: string[]}>({});
  const [activeTab, setActiveTab] = useState("calculator");
  
  // Initialize semester values
  useEffect(() => {
    const initialSemesterValues: {[key: string]: string} = {};
    for (let i = 1; i <= 8; i++) {
      initialSemesterValues[`sem${i}`] = "";
    }
    setSemesterValues(initialSemesterValues);
  }, []);
  
  // Calculate required CGPA
  const calculateRequiredCGPA = () => {
    // Validate inputs
    const currCGPA = parseFloat(currentCGPA);
    const compSemesters = parseInt(completedSemesters);
    const targCGPA = parseFloat(targetCGPA);
    const totSemesters = parseInt(totalSemesters);
    
    if (isNaN(currCGPA) || isNaN(compSemesters) || isNaN(targCGPA) || isNaN(totSemesters)) {
      toast({
        title: "Invalid inputs",
        description: "Please fill all fields with valid numbers",
        variant: "destructive",
      });
      return;
    }
    
    if (currCGPA < 0 || currCGPA > 10) {
      toast({
        title: "Invalid CGPA",
        description: "CGPA must be between 0 and 10",
        variant: "destructive",
      });
      return;
    }
    
    if (targCGPA < 0 || targCGPA > 10) {
      toast({
        title: "Invalid Target CGPA",
        description: "Target CGPA must be between 0 and 10",
        variant: "destructive",
      });
      return;
    }
    
    if (compSemesters <= 0 || totSemesters <= 0) {
      toast({
        title: "Invalid semester count",
        description: "Semester count must be greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    if (compSemesters >= totSemesters) {
      toast({
        title: "Invalid semester count",
        description: "Total semesters must be greater than completed semesters",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate required CGPA in remaining semesters
    const remainingSemesters = totSemesters - compSemesters;
    const currentCGPAWeight = currCGPA * compSemesters;
    const targetCGPAWeight = targCGPA * totSemesters;
    const remainingCGPAWeight = targetCGPAWeight - currentCGPAWeight;
    const requiredCGPAValue = remainingCGPAWeight / remainingSemesters;
    
    setRequiredCGPA(parseFloat(requiredCGPAValue.toFixed(2)));
    setIsAchievable(requiredCGPAValue <= 10);
    setShowResults(true);
    
    // Generate chart data
    generateChartData(currCGPA, targCGPA, compSemesters, totSemesters, requiredCGPAValue);
    
    // Find eligible companies
    findEligibleCompanies(currCGPA);
    
    toast({
      title: "Calculation Complete",
      description: "Your required CGPA has been calculated",
    });
  };
  
  // Generate chart data for visualization
  const generateChartData = (
    current: number, 
    target: number, 
    completed: number, 
    total: number, 
    required: number
  ) => {
    const data = [];
    
    // Add current CGPA point
    data.push({
      name: `Semester ${completed}`,
      cgpa: current,
      status: 'Current'
    });
    
    // Add projections for future semesters
    for (let i = completed + 1; i <= total; i++) {
      data.push({
        name: `Semester ${i}`,
        cgpa: target,
        status: 'Projected',
        requiredPerSem: required
      });
    }
    
    setChartData(data);
  };
  
  // Find companies that the student is eligible for
  const findEligibleCompanies = (currCGPA: number) => {
    const eligible: {[key: string]: string[]} = {};
    
    Object.keys(processedCompanyTiers).forEach(tier => {
      if (currCGPA >= processedCompanyTiers[tier].minCGPA) {
        eligible[tier] = processedCompanyTiers[tier].companies;
      }
    });
    
    setEligibleCompanies(eligible);
  };
  
  // Reset all inputs
  const resetInputs = () => {
    setCurrentCGPA("");
    setCompletedSemesters("4");
    setTargetCGPA("");
    setTotalSemesters("8");
    setRequiredCGPA(null);
    setIsAchievable(null);
    setShowResults(false);
    setChartData([]);
    setEligibleCompanies({});
    
    // Reset semester values
    const resetSemesterValues: {[key: string]: string} = {};
    for (let i = 1; i <= 8; i++) {
      resetSemesterValues[`sem${i}`] = "";
    }
    setSemesterValues(resetSemesterValues);
  };
  
  // Calculate CGPA from semester values
  const calculateCGPAFromSemesters = () => {
    let totalPoints = 0;
    let totalSems = 0;
    
    for (let i = 1; i <= 8; i++) {
      const value = semesterValues[`sem${i}`];
      if (value && !isNaN(parseFloat(value))) {
        totalPoints += parseFloat(value);
        totalSems++;
      }
    }
    
    if (totalSems === 0) {
      toast({
        title: "No data",
        description: "Please enter at least one semester's SGPA",
        variant: "destructive",
      });
      return;
    }
    
    const calculatedCGPA = totalPoints / totalSems;
    setCurrentCGPA(calculatedCGPA.toFixed(2));
    setCompletedSemesters(totalSems.toString());
    
    toast({
      title: "CGPA Calculated",
      description: `Your current CGPA is ${calculatedCGPA.toFixed(2)} based on ${totalSems} semesters`,
    });
    
    // Find eligible companies
    findEligibleCompanies(calculatedCGPA);
  };
  
  // Get color by tier
  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'S+': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'A+': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'A': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'B': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'C': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 p-3 rounded-md border border-dark-700 shadow-md">
          <p className="text-gray-200 font-medium">{label}</p>
          <p className="text-blue-400">CGPA: {payload[0].value.toFixed(2)}</p>
          {payload[0].payload.requiredPerSem && (
            <p className="text-green-400">Required: {payload[0].payload.requiredPerSem.toFixed(2)}</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Prepare tier distribution data for pie chart
  const prepareTierDistributionData = () => {
    const distribution = [
      { name: 'S+ Tier', value: Object.keys(eligibleCompanies).includes('S+') ? eligibleCompanies['S+'].length : 0 },
      { name: 'A+ Tier', value: Object.keys(eligibleCompanies).includes('A+') ? eligibleCompanies['A+'].length : 0 },
      { name: 'A Tier', value: Object.keys(eligibleCompanies).includes('A') ? eligibleCompanies['A'].length : 0 },
      { name: 'B Tier', value: Object.keys(eligibleCompanies).includes('B') ? eligibleCompanies['B'].length : 0 },
      { name: 'C Tier', value: Object.keys(eligibleCompanies).includes('C') ? eligibleCompanies['C'].length : 0 }
    ].filter(item => item.value > 0);
    
    return distribution;
  };
  
  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              CGPA <span className="text-blue-500">Calculator</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Calculate your required CGPA, visualize your progress, and see which companies you're eligible for
            </p>
          </div>
          
          <Tabs defaultValue="calculator" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="calculator" className="data-[state=active]:bg-blue-500">
                Calculator
              </TabsTrigger>
              <TabsTrigger value="semester" className="data-[state=active]:bg-blue-500">
                Semester Input
              </TabsTrigger>
              <TabsTrigger value="companies" className="data-[state=active]:bg-blue-500">
                Company Eligibility
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Card className="glass-card border-dark-800 overflow-hidden animate-fade-in-up">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white flex items-center">
                        <CalcIcon className="h-5 w-5 text-blue-500 mr-2" />
                        CGPA Calculator
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Calculate the CGPA required in future semesters
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="block text-sm text-gray-400 mb-1">Current CGPA</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 7.5"
                            className="bg-dark-800 border-dark-700 text-white"
                            min="0"
                            max="10"
                            step="0.01"
                            value={currentCGPA}
                            onChange={(e) => setCurrentCGPA(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label className="block text-sm text-gray-400 mb-1">Completed Semesters</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 4"
                            className="bg-dark-800 border-dark-700 text-white"
                            min="1"
                            value={completedSemesters}
                            onChange={(e) => setCompletedSemesters(e.target.value)}
                          />
                        </div>
                        
                        <Separator className="my-2 bg-dark-800" />
                        
                        <div>
                          <Label className="block text-sm text-gray-400 mb-1">Target CGPA</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 8.5"
                            className="bg-dark-800 border-dark-700 text-white"
                            min="0"
                            max="10"
                            step="0.01"
                            value={targetCGPA}
                            onChange={(e) => setTargetCGPA(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label className="block text-sm text-gray-400 mb-1">Total Semesters</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 8"
                            className="bg-dark-800 border-dark-700 text-white"
                            min="1"
                            value={totalSemesters}
                            onChange={(e) => setTotalSemesters(e.target.value)}
                          />
                        </div>
                        
                        <div className="flex gap-4 pt-2">
                          <Button 
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={calculateRequiredCGPA}
                          >
                            <CalcIcon className="h-4 w-4 mr-2" />
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
                      </div>
                    </CardContent>
                  </Card>
                  
                  {showResults && (
                    <Card className="glass-card border-dark-800 animate-fade-in-up mt-6">
                      <CardHeader className="bg-dark-900 border-b border-dark-800">
                        <CardTitle className="text-white">Results</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="mb-6">
                          <h3 className="text-lg text-gray-300 mb-2">Required CGPA in Remaining Semesters</h3>
                          <div className="text-4xl font-bold text-blue-500">
                            {isAchievable ? (
                              requiredCGPA
                            ) : (
                              <span className="text-red-500">Not Achievable</span>
                            )}
                          </div>
                          
                          {isAchievable ? (
                            <p className="text-sm text-gray-400 mt-2">
                              You need to maintain a CGPA of {requiredCGPA} in your remaining {
                                parseInt(totalSemesters) - parseInt(completedSemesters)
                              } semesters to achieve your target CGPA of {targetCGPA}.
                            </p>
                          ) : (
                            <div className="flex items-start mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-red-400 font-medium">Goal Not Achievable</p>
                                <p className="text-sm text-gray-400 mt-1">
                                  The required CGPA ({requiredCGPA}) exceeds the maximum possible CGPA (10.0). 
                                  Consider adjusting your target or extending your academic timeline.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                            <div className="text-sm text-gray-400 mb-1">Current Status</div>
                            <div className="text-xl font-medium text-white">
                              {currentCGPA} CGPA
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              After {completedSemesters} semesters
                            </div>
                          </div>
                          
                          <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                            <div className="text-sm text-gray-400 mb-1">Target</div>
                            <div className="text-xl font-medium text-white">
                              {targetCGPA} CGPA
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              By {totalSemesters} semesters
                            </div>
                          </div>
                        </div>
                        
                        {isAchievable && requiredCGPA && (
                          <div className="mt-6">
                            <h3 className="text-lg text-gray-300 mb-2">Equivalent Grades</h3>
                            <div className="flex flex-wrap gap-2">
                              {requiredCGPA >= 9.0 ? (
                                <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 py-1">
                                  O Grade (Outstanding)
                                </Badge>
                              ) : requiredCGPA >= 8.0 ? (
                                <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 py-1">
                                  A+ Grade (Excellent)
                                </Badge>
                              ) : requiredCGPA >= 7.0 ? (
                                <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 py-1">
                                  A Grade (Very Good)
                                </Badge>
                              ) : requiredCGPA >= 6.0 ? (
                                <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 py-1">
                                  B+ Grade (Good)
                                </Badge>
                              ) : requiredCGPA >= 5.0 ? (
                                <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 py-1">
                                  C+ Grade (Average)
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 py-1">
                                  C Grade (Below Average)
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {showResults && chartData.length > 0 && (
                  <div>
                    <Card className="glass-card border-dark-800 h-full animate-fade-in-up">
                      <CardHeader className="bg-dark-900 border-b border-dark-800">
                        <CardTitle className="text-white flex items-center">
                          <BarChart className="h-5 w-5 text-blue-500 mr-2" />
                          CGPA Visualization
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="mb-6">
                          <h3 className="text-lg text-gray-300 mb-2">CGPA Projection</h3>
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsBarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                              >
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis domain={[0, 10]} stroke="#6b7280" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="cgpa" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                              </RechartsBarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                          <div className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-white font-medium">Understanding Your Projection</p>
                              <p className="text-sm text-gray-400 mt-1">
                                To achieve your target CGPA of {targetCGPA}, you need to maintain a CGPA of {requiredCGPA} in each of your remaining {
                                  parseInt(totalSemesters) - parseInt(completedSemesters)
                                } semesters.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="semester">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card border-dark-800 animate-fade-in-up">
                  <CardHeader className="bg-dark-900 border-b border-dark-800">
                    <CardTitle className="text-white">Semester-wise GPA Input</CardTitle>
                    <CardDescription className="text-gray-400">
                      Enter your semester-wise SGPA to calculate your current CGPA
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {Array.from({length: 8}, (_, i) => i + 1).map(sem => (
                        <div key={sem}>
                          <Label className="block text-sm text-gray-400 mb-1">Semester {sem}</Label>
                          <Input
                            type="number"
                            placeholder={`SGPA ${sem}`}
                            className="bg-dark-800 border-dark-700 text-white"
                            min="0"
                            max="10"
                            step="0.01"
                            value={semesterValues[`sem${sem}`]}
                            onChange={(e) => setSemesterValues({...semesterValues, [`sem${sem}`]: e.target.value})}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-4 mt-6">
                      <Button 
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={calculateCGPAFromSemesters}
                      >
                        <CalcIcon className="h-4 w-4 mr-2" />
                        Calculate CGPA
                      </Button>
                    </div>
                    
                    {currentCGPA && (
                      <div className="mt-6 p-4 bg-dark-800 rounded-lg border border-dark-700">
                        <div className="text-lg font-medium text-white">
                          Your Current CGPA: <span className="text-blue-500">{currentCGPA}</span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          Based on {completedSemesters} completed semesters
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {Object.keys(eligibleCompanies).length > 0 && (
                  <Card className="glass-card border-dark-800 animate-fade-in-up h-full">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white flex items-center">
                        <Building2 className="h-5 w-5 text-blue-500 mr-2" />
                        Company Tier Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={prepareTierDistributionData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {prepareTierDistributionData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-center mt-4 text-gray-400 text-sm">
                        Distribution of eligible companies across different tiers based on your CGPA of {currentCGPA}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="companies">
              <Card className="glass-card border-dark-800 animate-fade-in-up">
                <CardHeader className="bg-dark-900 border-b border-dark-800">
                  <CardTitle className="text-white flex items-center">
                    <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                    Companies You're Eligible For
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Based on your current CGPA of {currentCGPA || "0.00"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {!currentCGPA && (
                    <div className="bg-dark-800 p-4 rounded-lg border border-dark-700 text-center">
                      <p className="text-gray-400">
                        Please calculate your CGPA first to see eligible companies
                      </p>
                      <Button 
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => setActiveTab("calculator")}
                      >
                        Go to Calculator
                      </Button>
                    </div>
                  )}
                  
                  {Object.keys(eligibleCompanies).length > 0 ? (
                    <div className="space-y-6">
                      {Object.keys(eligibleCompanies).sort().reverse().map(tier => (
                        <div key={tier} className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                          <div className="flex items-center mb-2">
                            <Badge variant="outline" className={getTierColor(tier)}>
                              {tier} Tier
                            </Badge>
                            <span className="ml-2 text-sm text-gray-400">
                              {processedCompanyTiers[tier].ctc} • Minimum CGPA: {processedCompanyTiers[tier].minCGPA}
                            </span>
                          </div>
                          <div className="bg-dark-800 rounded-lg border border-dark-700 p-4">
                            <div className="flex flex-wrap gap-2">
                              {eligibleCompanies[tier].map(company => (
                                <Badge key={company} variant="outline" className="bg-dark-700 text-gray-300">
                                  {company}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : currentCGPA ? (
                    <div className="flex items-start p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-400 font-medium">No Eligible Companies Found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Your current CGPA of {currentCGPA} doesn't meet the minimum requirements for the companies in our database. 
                          Focus on improving your CGPA to unlock more opportunities.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
              
              {Object.keys(eligibleCompanies).length > 0 && (
                <Card className="glass-card border-dark-800 animate-fade-in-up mt-6">
                  <CardHeader className="bg-dark-900 border-b border-dark-800">
                    <CardTitle className="text-white">Tier Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                        <div className="flex items-center">
                          <Badge variant="outline" className="text-purple-400 bg-purple-500/20 border-purple-500/30">
                            S+ Tier
                          </Badge>
                          <span className="ml-2 font-medium text-white">Top Tech & Finance Companies</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          Elite tech giants and high-frequency trading firms offering excellent compensation and benefits.
                          Typically requires CGPA of 8.0 or higher.
                        </p>
                      </div>
                      
                      <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                        <div className="flex items-center">
                          <Badge variant="outline" className="text-blue-400 bg-blue-500/20 border-blue-500/30">
                            A+ Tier
                          </Badge>
                          <span className="ml-2 font-medium text-white">Premium Companies</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          Well-established tech companies and successful startups with excellent growth opportunities.
                          Typically requires CGPA of 7.5 or higher.
                        </p>
                      </div>
                      
                      <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                        <div className="flex items-center">
                          <Badge variant="outline" className="text-green-400 bg-green-500/20 border-green-500/30">
                            A Tier
                          </Badge>
                          <span className="ml-2 font-medium text-white">Good Companies</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          Solid tech companies and reputable IT service providers with good work-life balance.
                          Typically requires CGPA of 7.0-7.5.
                        </p>
                      </div>
                      
                      <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                        <div className="flex items-center">
                          <Badge variant="outline" className="text-yellow-400 bg-yellow-500/20 border-yellow-500/30">
                            B Tier
                          </Badge>
                          <span className="ml-2 font-medium text-white">Mid-Tier Companies</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          Mid-sized companies and startups offering decent packages and learning opportunities.
                          Typically requires CGPA of 6.0-7.0.
                        </p>
                      </div>
                      
                      <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                        <div className="flex items-center">
                          <Badge variant="outline" className="text-orange-400 bg-orange-500/20 border-orange-500/30">
                            C Tier
                          </Badge>
                          <span className="ml-2 font-medium text-white">Entry-Level Companies</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          Services and BPO companies that hire in bulk, often with lower compensation packages.
                          Typically requires CGPA of 6.0 or higher.
                        </p>
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

export default CGPA;
