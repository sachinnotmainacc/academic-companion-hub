
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Calculator,
  Building2,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  BarChart as ChartIcon,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

// Type definitions
type CompanyTier = 'S+' | 'A+' | 'A' | 'B' | 'C';

interface Company {
  name: string;
  tier: CompanyTier;
  cgpa: number;
}

interface TierData {
  minCGPA: number;
  companies: string[];
  ctc: string;
  color: string;
}

interface TierInfo {
  [key: string]: TierData;
}

// Company data with tier categorization
const companyTiers: TierInfo = {
  'S+': { minCGPA: 8.0, companies: [], ctc: '₹30+ LPA', color: '#8884d8' },
  'A+': { minCGPA: 7.5, companies: [], ctc: '₹20-30 LPA', color: '#82ca9d' },
  'A': { minCGPA: 7.5, companies: [], ctc: '₹10-20 LPA', color: '#ffc658' },
  'B': { minCGPA: 7.0, companies: [], ctc: '₹5-10 LPA', color: '#ff8042' },
  'C': { minCGPA: 6.0, companies: [], ctc: 'Below ₹5 LPA', color: '#0088FE' }
};

// Company data
const companyData: Company[] = [
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

const CGPA = () => {
  const processedCompanyTiers = processCompanyData();
  
  // User inputs
  const [currentCGPA, setCurrentCGPA] = useState("");
  const [targetCGPA, setTargetCGPA] = useState("");
  
  // Dynamic semester input values
  const defaultTotalSemesters = 8;
  const minTotalSemesters = 2;
  const maxTotalSemesters = 12;
  const [totalSemesters, setTotalSemesters] = useState(defaultTotalSemesters);
  const [completedSemesters, setCompletedSemesters] = useState(4);
  const [showSemesterSettings, setShowSemesterSettings] = useState(false);
  
  // Results
  const [requiredCGPA, setRequiredCGPA] = useState<number | null>(null);
  const [isAchievable, setIsAchievable] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Chart data
  const [chartData, setChartData] = useState<any[]>([]);
  const [semesterChartData, setSemesterChartData] = useState<any[]>([]);
  const [eligibleCompanies, setEligibleCompanies] = useState<{[key: string]: string[]}>({});
  const [tierDistribution, setTierDistribution] = useState<{name: string, value: number, color: string}[]>([]);
  
  // Validation for semester inputs
  useEffect(() => {
    if (completedSemesters >= totalSemesters) {
      setCompletedSemesters(totalSemesters - 1);
    }
  }, [totalSemesters, completedSemesters]);
  
  // Calculate required CGPA
  const calculateRequiredCGPA = () => {
    // Validate inputs
    const currCGPA = parseFloat(currentCGPA);
    const targCGPA = parseFloat(targetCGPA);
    
    if (isNaN(currCGPA) || isNaN(targCGPA)) {
      toast.error("Please fill all fields with valid numbers");
      return;
    }
    
    if (currCGPA < 0 || currCGPA > 10) {
      toast.error("CGPA must be between 0 and 10");
      return;
    }
    
    if (targCGPA < 0 || targCGPA > 10) {
      toast.error("Target CGPA must be between 0 and 10");
      return;
    }
    
    if (completedSemesters <= 0) {
      toast.error("Completed semesters must be greater than 0");
      return;
    }
    
    if (completedSemesters >= totalSemesters) {
      toast.error("Completed semesters must be less than total semesters");
      return;
    }
    
    // Calculate required CGPA in remaining semesters
    const remainingSemesters = totalSemesters - completedSemesters;
    const currentCGPAWeight = currCGPA * completedSemesters;
    const targetCGPAWeight = targCGPA * totalSemesters;
    const remainingCGPAWeight = targetCGPAWeight - currentCGPAWeight;
    const requiredCGPAValue = remainingCGPAWeight / remainingSemesters;
    
    setRequiredCGPA(parseFloat(requiredCGPAValue.toFixed(2)));
    setIsAchievable(requiredCGPAValue <= 10);
    setShowResults(true);
    
    // Generate chart data
    generateChartData(currCGPA, targCGPA, requiredCGPAValue);
    
    // Generate semester-wise chart data
    generateSemesterChartData(currCGPA, requiredCGPAValue, completedSemesters, totalSemesters);
    
    // Find eligible companies
    findEligibleCompanies(currCGPA);
    
    toast.success("Calculation complete");
  };
  
  // Generate chart data for visualization
  const generateChartData = (
    current: number, 
    target: number, 
    required: number
  ) => {
    const data = [];
    
    // Add current CGPA point
    data.push({
      name: `Current CGPA`,
      cgpa: current,
      status: 'Current'
    });
    
    // Add required CGPA point
    data.push({
      name: `Required CGPA`,
      cgpa: required > 10 ? 10 : required,
      status: 'Required'
    });
    
    // Add target CGPA point
    data.push({
      name: `Target CGPA`,
      cgpa: target,
      status: 'Target'
    });
    
    setChartData(data);
  };
  
  // Generate semester-wise chart data
  const generateSemesterChartData = (
    current: number,
    required: number,
    completed: number,
    total: number
  ) => {
    const data = [];
    
    // Add data points for completed semesters (using current CGPA)
    for (let i = 1; i <= completed; i++) {
      data.push({
        semester: `Sem ${i}`,
        cgpa: current,
        type: 'Completed'
      });
    }
    
    // Add data points for remaining semesters (using required CGPA)
    for (let i = completed + 1; i <= total; i++) {
      data.push({
        semester: `Sem ${i}`,
        cgpa: required > 10 ? 10 : required,
        type: 'Remaining'
      });
    }
    
    setSemesterChartData(data);
  };
  
  // Find companies that the student is eligible for
  const findEligibleCompanies = (currCGPA: number) => {
    const eligible: {[key: string]: string[]} = {};
    let distribution: {name: string, value: number, color: string}[] = [];
    
    Object.keys(processedCompanyTiers).forEach(tier => {
      if (currCGPA >= processedCompanyTiers[tier].minCGPA) {
        eligible[tier] = processedCompanyTiers[tier].companies;
        distribution.push({
          name: tier,
          value: processedCompanyTiers[tier].companies.length,
          color: processedCompanyTiers[tier].color
        });
      }
    });
    
    setEligibleCompanies(eligible);
    setTierDistribution(distribution);
  };
  
  // Reset all inputs
  const resetInputs = () => {
    setCurrentCGPA("");
    setTargetCGPA("");
    setRequiredCGPA(null);
    setIsAchievable(null);
    setShowResults(false);
    setChartData([]);
    setSemesterChartData([]);
    setEligibleCompanies({});
    setTierDistribution([]);
    setTotalSemesters(defaultTotalSemesters);
    setCompletedSemesters(4);
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
          {payload[0].payload.type && (
            <p className="text-gray-300">{payload[0].payload.type}</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Count total eligible companies
  const countTotalEligibleCompanies = () => {
    let count = 0;
    Object.keys(eligibleCompanies).forEach(tier => {
      count += eligibleCompanies[tier].length;
    });
    return count;
  };
  
  // Count total companies
  const countTotalCompanies = () => {
    let count = 0;
    Object.keys(processedCompanyTiers).forEach(tier => {
      count += processedCompanyTiers[tier].companies.length;
    });
    return count;
  };
  
  // Update semester settings
  const updateTotalSemesters = (value: number) => {
    setTotalSemesters(Math.min(Math.max(value, minTotalSemesters), maxTotalSemesters));
  };
  
  const updateCompletedSemesters = (value: number) => {
    setCompletedSemesters(Math.min(Math.max(value, 1), totalSemesters - 1));
  };
  
  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-y-auto">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              CGPA <span className="text-blue-500">Calculator</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Calculate your required CGPA and see eligible companies for placement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Input Section */}
            <Card className="md:col-span-4 glass-card border-dark-800">
              <CardHeader className="bg-dark-900 border-b border-dark-800">
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 text-blue-500 mr-2" />
                    CGPA Calculator
                  </div>
                  <Dialog open={showSemesterSettings} onOpenChange={setShowSemesterSettings}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full border-dark-700 text-gray-400 hover:text-blue-400 hover:border-blue-500"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-dark-900 border-dark-700 text-white">
                      <DialogHeader>
                        <DialogTitle>Semester Settings</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Adjust the number of semesters in your program
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Total Semesters ({minTotalSemesters}-{maxTotalSemesters})</Label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              type="number" 
                              className="bg-dark-800 border-dark-700 text-white"
                              value={totalSemesters}
                              min={minTotalSemesters}
                              max={maxTotalSemesters}
                              onChange={(e) => updateTotalSemesters(parseInt(e.target.value))}
                            />
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="border-dark-700 text-gray-400"
                              onClick={() => updateTotalSemesters(totalSemesters - 1)}
                              disabled={totalSemesters <= minTotalSemesters}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="border-dark-700 text-gray-400"
                              onClick={() => updateTotalSemesters(totalSemesters + 1)}
                              disabled={totalSemesters >= maxTotalSemesters}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Completed Semesters</Label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              type="number" 
                              className="bg-dark-800 border-dark-700 text-white"
                              value={completedSemesters}
                              min={1}
                              max={totalSemesters - 1}
                              onChange={(e) => updateCompletedSemesters(parseInt(e.target.value))}
                            />
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="border-dark-700 text-gray-400"
                              onClick={() => updateCompletedSemesters(completedSemesters - 1)}
                              disabled={completedSemesters <= 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="border-dark-700 text-gray-400"
                              onClick={() => updateCompletedSemesters(completedSemesters + 1)}
                              disabled={completedSemesters >= totalSemesters - 1}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          className="border-dark-700 text-gray-300 hover:text-white"
                          onClick={() => setShowSemesterSettings(false)}
                        >
                          Done
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Current CGPA</Label>
                  <Input
                    type="number"
                    placeholder="Enter your current CGPA"
                    className="bg-dark-800 border-dark-700 text-white"
                    min="0"
                    max="10"
                    step="0.01"
                    value={currentCGPA}
                    onChange={(e) => setCurrentCGPA(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Target CGPA</Label>
                  <Input
                    type="number"
                    placeholder="Enter your target CGPA"
                    className="bg-dark-800 border-dark-700 text-white"
                    min="0"
                    max="10"
                    step="0.01"
                    value={targetCGPA}
                    onChange={(e) => setTargetCGPA(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Completed</Label>
                    <div className="py-2 px-3 bg-dark-800 rounded-md border border-dark-700 text-center">
                      {completedSemesters} <span className="text-xs text-gray-500">semesters</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Total</Label>
                    <div className="py-2 px-3 bg-dark-800 rounded-md border border-dark-700 text-center">
                      {totalSemesters} <span className="text-xs text-gray-500">semesters</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-2">
                  <Button 
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={calculateRequiredCGPA}
                  >
                    Calculate
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-400 hover:text-gray-300"
                    onClick={resetInputs}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                
                {showResults && (
                  <div className="mt-4 p-4 border border-dark-700 rounded-lg bg-dark-800/50">
                    <h3 className="text-lg text-white font-medium mb-2">Results</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-400">Required CGPA:</div>
                      <div className="text-xl font-bold text-blue-500">
                        {isAchievable ? (
                          requiredCGPA
                        ) : (
                          <span className="text-red-500">Not Achievable</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">Eligible Companies:</div>
                      <div className="text-lg font-medium text-white">
                        {countTotalEligibleCompanies()}/{countTotalCompanies()}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Chart Section */}
            <Card className="md:col-span-8 glass-card border-dark-800">
              <CardHeader className="bg-dark-900 border-b border-dark-800">
                <CardTitle className="text-white flex items-center">
                  <ChartIcon className="h-5 w-5 text-blue-500 mr-2" />
                  CGPA Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {semesterChartData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={semesterChartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="semester" stroke="#6b7280" />
                        <YAxis domain={[0, 10]} stroke="#6b7280" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="cgpa" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <ChartIcon className="h-12 w-12 mx-auto mb-2 opacity-40" />
                      <p>Enter your CGPA data and calculate to see visualization</p>
                    </div>
                  </div>
                )}
                
                {Object.keys(eligibleCompanies).length > 0 && (
                  <div className="mt-6">
                    <Separator className="my-4 bg-dark-800" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Company Distribution Chart */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Company Distribution</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={tierDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {tierDistribution.map((entry, index) => {
                                  return <Cell key={`cell-${index}`} fill={entry.color} />;
                                })}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      {/* CTC Tiers */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">CTC Tiers</h3>
                        <div className="space-y-3">
                          {Object.entries(processedCompanyTiers)
                            .sort((a, b) => {
                              const tierOrder = {'S+': 5, 'A+': 4, 'A': 3, 'B': 2, 'C': 1};
                              return (tierOrder[b[0] as CompanyTier] || 0) - (tierOrder[a[0] as CompanyTier] || 0);
                            })
                            .map(([tier, data]) => (
                            <div key={tier} className="p-3 rounded-lg bg-dark-800 border border-dark-700">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className={getTierColor(tier)}>
                                  {tier} Tier
                                </Badge>
                                <span className="text-white font-medium">{data.ctc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Company Section */}
            {Object.keys(eligibleCompanies).length > 0 && (
              <Card className="md:col-span-12 glass-card border-dark-800">
                <CardHeader className="bg-dark-900 border-b border-dark-800">
                  <CardTitle className="text-white flex items-center">
                    <Building2 className="h-5 w-5 text-blue-500 mr-2" />
                    Eligible Companies
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">Eligible Tiers</h3>
                        <Badge className="bg-dark-800 text-white">
                          {countTotalEligibleCompanies()}/{countTotalCompanies()}
                        </Badge>
                      </div>
                      <div className="flex flex-col space-y-4">
                        {Object.keys(eligibleCompanies)
                          .sort((a, b) => {
                            const tierOrder = {'S+': 5, 'A+': 4, 'A': 3, 'B': 2, 'C': 1};
                            return (tierOrder[b as CompanyTier] || 0) - (tierOrder[a as CompanyTier] || 0);
                          })
                          .map(tier => (
                          <div key={tier} className="p-3 rounded-lg bg-dark-800/50 border border-dark-700/50 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className={getTierColor(tier)}>
                                {tier}
                              </Badge>
                              <span className="text-white">{eligibleCompanies[tier].length} Companies</span>
                            </div>
                            <span className="text-gray-400">{processedCompanyTiers[tier].ctc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Company List</h3>
                      <ScrollArea className="h-[300px] rounded-md border border-dark-700 bg-dark-800/50 p-4">
                        <div className="space-y-6">
                          {Object.keys(eligibleCompanies)
                            .sort((a, b) => {
                              const tierOrder = {'S+': 5, 'A+': 4, 'A': 3, 'B': 2, 'C': 1};
                              return (tierOrder[b as CompanyTier] || 0) - (tierOrder[a as CompanyTier] || 0);
                            })
                            .map(tier => (
                            <div key={tier}>
                              <div className="flex items-center space-x-3 mb-2">
                                <Badge variant="outline" className={getTierColor(tier)}>
                                  {tier} Tier
                                </Badge>
                                <span className="text-gray-400 text-sm">{processedCompanyTiers[tier].ctc}</span>
                              </div>
                              <div className="space-y-1 pl-2 border-l-2 border-dark-700">
                                {eligibleCompanies[tier].map(company => (
                                  <div key={company} className="text-gray-300 py-1">
                                    {company}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CGPA;
