
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

// Company data with tier categorization
const companyTiers = {
  'S+': { minCGPA: 8.0, companies: [], ctc: '₹30+ LPA' },
  'A+': { minCGPA: 7.5, companies: [], ctc: '₹20-30 LPA' },
  'A': { minCGPA: 7.5, companies: [], ctc: '₹10-20 LPA' },
  'B': { minCGPA: 7.0, companies: [], ctc: '₹5-10 LPA' },
  'C': { minCGPA: 6.0, companies: [], ctc: 'Below ₹5 LPA' }
};

// Company data
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
  const [totalSemesters] = useState("8"); // Fixed to 8 semesters
  
  // Results
  const [requiredCGPA, setRequiredCGPA] = useState<number | null>(null);
  const [isAchievable, setIsAchievable] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Chart data
  const [chartData, setChartData] = useState<any[]>([]);
  const [eligibleCompanies, setEligibleCompanies] = useState<{[key: string]: string[]}>({});
  
  // Calculate required CGPA
  const calculateRequiredCGPA = () => {
    // Validate inputs
    const currCGPA = parseFloat(currentCGPA);
    const compSemesters = parseInt(completedSemesters);
    const targCGPA = parseFloat(targetCGPA);
    const totSemesters = parseInt(totalSemesters);
    
    if (isNaN(currCGPA) || isNaN(compSemesters) || isNaN(targCGPA)) {
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
    
    if (compSemesters <= 0) {
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
    setRequiredCGPA(null);
    setIsAchievable(null);
    setShowResults(false);
    setChartData([]);
    setEligibleCompanies({});
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              CGPA <span className="text-blue-500">Calculator</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Calculate your required CGPA, visualize your progress, and see which companies you're eligible for
            </p>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Calculator */}
            <div className="lg:col-span-1">
              <Card className="glass-card border-dark-800 overflow-hidden animate-fade-in-up">
                <CardHeader className="bg-dark-900 border-b border-dark-800">
                  <CardTitle className="text-white flex items-center">
                    <CalcIcon className="h-5 w-5 text-blue-500 mr-2" />
                    CGPA Calculator
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Calculate your required CGPA for future semesters
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
                        max="7"
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
                    
                    <div className="text-sm text-gray-400 py-1 px-2 bg-dark-800/50 rounded">
                      Total Semesters: 8 (Fixed)
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
                  
                  {showResults && (
                    <div className="mt-6 p-4 border border-dark-700 rounded-lg bg-dark-800/50">
                      <h3 className="text-lg text-white font-medium mb-2">Results</h3>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-400">Required CGPA:</div>
                        <div className="text-xl font-bold text-blue-500">
                          {isAchievable ? (
                            requiredCGPA
                          ) : (
                            <span className="text-red-500">Not Achievable</span>
                          )}
                        </div>
                      </div>
                      
                      {!isAchievable && (
                        <div className="flex items-start mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-md">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-red-400">
                            The required CGPA exceeds the maximum possible CGPA (10.0)
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Middle Column - Visualization */}
            <div className="lg:col-span-1">
              <Card className="glass-card border-dark-800 h-full animate-fade-in-up">
                <CardHeader className="bg-dark-900 border-b border-dark-800">
                  <CardTitle className="text-white flex items-center">
                    <BarChart className="h-5 w-5 text-blue-500 mr-2" />
                    CGPA Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {chartData.length > 0 ? (
                    <div className="h-64">
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
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <BarChart className="h-12 w-12 mx-auto mb-2 opacity-40" />
                        <p>Enter your CGPA data and calculate to see visualization</p>
                      </div>
                    </div>
                  )}
                  
                  {showResults && requiredCGPA && (
                    <div className="mt-4">
                      <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                        <p className="text-sm text-gray-300">
                          To achieve your target CGPA of {targetCGPA}, you need to maintain a CGPA of {requiredCGPA} in your remaining {
                            parseInt(totalSemesters) - parseInt(completedSemesters)
                          } semesters.
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-300 mb-2">Equivalent Grade</h3>
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
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Companies */}
            <div className="lg:col-span-1">
              <Card className="glass-card border-dark-800 h-full animate-fade-in-up">
                <CardHeader className="bg-dark-900 border-b border-dark-800">
                  <CardTitle className="text-white flex items-center">
                    <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                    Eligible Companies
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Based on your current CGPA
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {Object.keys(eligibleCompanies).length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <div className="p-6 space-y-4">
                        {Object.keys(eligibleCompanies).sort().reverse().map(tier => (
                          <div key={tier} className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className={getTierColor(tier)}>
                                {tier} Tier
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {processedCompanyTiers[tier].ctc}
                              </span>
                            </div>
                            <div className="bg-dark-800 rounded-lg border border-dark-700 p-3">
                              <div className="flex flex-wrap gap-2">
                                {eligibleCompanies[tier].map(company => (
                                  <Badge key={company} variant="outline" className="bg-dark-700 text-gray-300 text-xs">
                                    {company}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="pt-2">
                          <div className="text-xs text-gray-400 mb-2">Tier Information:</div>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Badge variant="outline" className="text-purple-400 bg-purple-500/20 border-purple-500/30 mr-2">
                                S+
                              </Badge>
                              <span className="text-xs text-gray-300">Min CGPA: 8.0</span>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="text-blue-400 bg-blue-500/20 border-blue-500/30 mr-2">
                                A+
                              </Badge>
                              <span className="text-xs text-gray-300">Min CGPA: 7.5</span>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="text-green-400 bg-green-500/20 border-green-500/30 mr-2">
                                A
                              </Badge>
                              <span className="text-xs text-gray-300">Min CGPA: 7.5</span>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="text-yellow-400 bg-yellow-500/20 border-yellow-500/30 mr-2">
                                B
                              </Badge>
                              <span className="text-xs text-gray-300">Min CGPA: 7.0</span>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="text-orange-400 bg-orange-500/20 border-orange-500/30 mr-2">
                                C
                              </Badge>
                              <span className="text-xs text-gray-300">Min CGPA: 6.0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="p-6 flex items-center justify-center h-[400px] text-gray-500">
                      <div className="text-center">
                        <Building2 className="h-12 w-12 mx-auto mb-2 opacity-40" />
                        <p>Enter your CGPA and calculate to see eligible companies</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CGPA;
