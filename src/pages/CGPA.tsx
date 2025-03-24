
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Calculator as CalcIcon, AlertTriangle, GraduationCap, Building, ArrowRight, TrendingUp, Award, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";

// Company data with tiers
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

// Group companies by tier
Object.keys(companyTiers).forEach(tier => {
  companyTiers[tier].companies = companyData.filter(company => company.tier === tier);
});

// CGPA to grade mapping
const cgpaToGrade = [
  { grade: 'O', points: 10, minCGPA: 9.0, description: 'Outstanding' },
  { grade: 'A+', points: 9, minCGPA: 8.0, description: 'Excellent' },
  { grade: 'A', points: 8, minCGPA: 7.0, description: 'Very Good' },
  { grade: 'B+', points: 7, minCGPA: 6.0, description: 'Good' },
  { grade: 'C+', points: 6, minCGPA: 5.0, description: 'Average' },
  { grade: 'C', points: 5, minCGPA: 4.0, description: 'Below Average' }
];

// Colors for the charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];
const TIER_COLORS = {
  'S+': '#9b5de5',
  'A+': '#00bbf9',
  'A': '#00f5d4',
  'B': '#fee440',
  'C': '#f15bb5'
};

const CGPA = () => {
  const { toast } = useToast();
  
  // User inputs
  const [currentCGPA, setCurrentCGPA] = useState("");
  const [completedSemesters, setCompletedSemesters] = useState("4");
  const [targetCGPA, setTargetCGPA] = useState("");
  const [totalSemesters, setTotalSemesters] = useState("8");
  const [activeTab, setActiveTab] = useState("calculator");
  
  // Results
  const [requiredCGPA, setRequiredCGPA] = useState<number | null>(null);
  const [isAchievable, setIsAchievable] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [eligibleCompanies, setEligibleCompanies] = useState<any[]>([]);
  const [tierCounts, setTierCounts] = useState<{name: string, value: number}[]>([]);
  const [projectionData, setProjectionData] = useState<{semester: number, cgpa: number}[]>([]);

  // Generate companies by tier for visualization
  useEffect(() => {
    const currCGPA = parseFloat(currentCGPA);
    
    if (!isNaN(currCGPA) && currCGPA > 0 && currCGPA <= 10) {
      // Get all eligible companies
      const eligible = companyData.filter(company => currCGPA >= company.cgpa);
      setEligibleCompanies(eligible);
      
      // Count by tier
      const counts = Object.keys(companyTiers).map(tier => {
        const count = eligible.filter(company => company.tier === tier).length;
        return { name: tier, value: count };
      });
      setTierCounts(counts);
      
      // Generate projection data
      if (!isNaN(parseFloat(completedSemesters)) && !isNaN(parseFloat(totalSemesters)) && showResults && requiredCGPA) {
        const compSemesters = parseInt(completedSemesters);
        const totSemesters = parseInt(totalSemesters);
        const projData = [];
        
        // Add past semesters (flat line at current CGPA)
        for (let i = 1; i <= compSemesters; i++) {
          projData.push({ semester: i, cgpa: currCGPA });
        }
        
        // Add future semesters (increasing to reach target)
        if (isAchievable && requiredCGPA) {
          const remainingSemesters = totSemesters - compSemesters;
          for (let i = 1; i <= remainingSemesters; i++) {
            projData.push({ 
              semester: compSemesters + i, 
              cgpa: parseFloat((currCGPA + (requiredCGPA - currCGPA) * i / remainingSemesters).toFixed(2))
            });
          }
        }
        
        setProjectionData(projData);
      }
    }
  }, [currentCGPA, showResults, completedSemesters, totalSemesters, requiredCGPA, isAchievable]);

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
    
    toast({
      title: "Calculation Complete",
      description: "Your required CGPA has been calculated",
    });
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
    setEligibleCompanies([]);
    setTierCounts([]);
    setProjectionData([]);
  };

  // Find current grade based on CGPA
  const getCurrentGrade = (cgpa: number) => {
    for (let i = 0; i < cgpaToGrade.length; i++) {
      if (cgpa >= cgpaToGrade[i].minCGPA) {
        return cgpaToGrade[i];
      }
    }
    return null;
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-dark-700 p-3 rounded-md shadow-lg">
          <p className="text-gray-300">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              CGPA <span className="text-blue-500">Calculator</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Calculate the required CGPA in your remaining semesters to achieve your target and discover eligible companies
            </p>
          </div>
          
          <Tabs defaultValue="calculator" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="calculator">
                <CalcIcon className="h-4 w-4 mr-2" />
                Calculator
              </TabsTrigger>
              <TabsTrigger value="companies">
                <Building className="h-4 w-4 mr-2" />
                Companies
              </TabsTrigger>
              <TabsTrigger value="projections">
                <TrendingUp className="h-4 w-4 mr-2" />
                Projections
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <TabsContent value="calculator" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="glass-card border-dark-800 mb-8 overflow-hidden animate-fade-in-up h-full">
                  <CardHeader className="bg-dark-900 border-b border-dark-800">
                    <CardTitle className="text-white flex items-center">
                      <CalcIcon className="h-5 w-5 text-blue-500 mr-2" />
                      Enter Your Details
                    </CardTitle>
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
                      
                      <div className="flex gap-4 mt-6">
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
              </div>
              
              <div className="md:col-span-2">
                {showResults ? (
                  <Card className="glass-card border-dark-800 animate-fade-in-up h-full">
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                        
                        <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                          <div className="text-sm text-gray-400 mb-1">Current Grade</div>
                          <div className="text-xl font-medium text-white flex items-center">
                            {getCurrentGrade(parseFloat(currentCGPA)) ? (
                              <>
                                <Badge className="mr-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 py-1">
                                  {getCurrentGrade(parseFloat(currentCGPA))?.grade}
                                </Badge>
                                {getCurrentGrade(parseFloat(currentCGPA))?.description}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isAchievable && requiredCGPA && (
                        <div className="mt-6">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg text-gray-300">CGPA Visualization</h3>
                            <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-500/30">
                              {parseInt(totalSemesters) - parseInt(completedSemesters)} Semesters Remaining
                            </Badge>
                          </div>
                          
                          <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 h-56">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={projectionData}
                                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis 
                                  dataKey="semester" 
                                  label={{ value: 'Semester', position: 'insideBottom', offset: -5, fill: '#8884d8' }}
                                  stroke="rgba(255,255,255,0.3)"
                                />
                                <YAxis 
                                  domain={[
                                    Math.max(0, Math.floor(parseFloat(currentCGPA)) - 1), 
                                    Math.min(10, Math.ceil(Math.max(parseFloat(targetCGPA), parseFloat(currentCGPA))) + 1)
                                  ]}
                                  label={{ value: 'CGPA', angle: -90, position: 'insideLeft', fill: '#8884d8' }}
                                  stroke="rgba(255,255,255,0.3)"
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line 
                                  type="monotone" 
                                  dataKey="cgpa" 
                                  stroke="#8884d8" 
                                  strokeWidth={2}
                                  dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4, fill: '#2D2D3A' }}
                                  activeDot={{ stroke: '#8884d8', strokeWidth: 2, r: 6, fill: '#8884d8' }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="glass-card border-dark-800 animate-fade-in-up h-full">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white flex items-center">
                        <GraduationCap className="h-5 w-5 text-blue-500 mr-2" />
                        About CGPA Calculator
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <p className="text-gray-300">
                          The CGPA Calculator helps you determine what grades you need to achieve in your remaining semesters to reach your target CGPA.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <Card className="border-dark-700 bg-dark-800">
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                  <ArrowRight className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-md font-medium text-gray-200">Set Current Status</h4>
                                  <p className="text-sm text-gray-400 mt-1">
                                    Enter your current CGPA and how many semesters you've completed.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="border-dark-700 bg-dark-800">
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                  <ArrowRight className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-md font-medium text-gray-200">Define Your Target</h4>
                                  <p className="text-sm text-gray-400 mt-1">
                                    Specify your target CGPA and total number of semesters in your program.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="border-dark-700 bg-dark-800">
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                  <ArrowRight className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-md font-medium text-gray-200">Get Required CGPA</h4>
                                  <p className="text-sm text-gray-400 mt-1">
                                    Calculate the CGPA you need to maintain in your remaining semesters.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="border-dark-700 bg-dark-800">
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                  <ArrowRight className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-md font-medium text-gray-200">Explore Companies</h4>
                                  <p className="text-sm text-gray-400 mt-1">
                                    Discover companies you're eligible for based on your CGPA.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-4 mt-6">
                          <h4 className="text-blue-400 font-medium flex items-center">
                            <GraduationCap className="h-5 w-5 mr-2" />
                            KTU Grade Scale
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                            {cgpaToGrade.map((item, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Badge className="bg-dark-800 text-white">
                                  {item.grade} ({item.points})
                                </Badge>
                                <span className="text-sm text-gray-400">≥ {item.minCGPA}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            {showResults && isAchievable && requiredCGPA && (
              <Card className="glass-card border-dark-800 animate-fade-in-up">
                <CardHeader className="bg-dark-900 border-b border-dark-800">
                  <CardTitle className="text-white">Equivalent Grades</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg text-gray-300 mb-4">Required Grade Distribution</h3>
                      <div className="space-y-3">
                        <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                          <div className="flex justify-between">
                            <div>
                              <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 py-1">
                                O Grade (Outstanding)
                              </Badge>
                              <div className="text-sm text-gray-400 mt-1">
                                If all courses have O grade (≥ 90%)
                              </div>
                            </div>
                            <div className="text-xl font-semibold">10.0</div>
                          </div>
                        </div>
                        
                        <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                          <div className="flex justify-between">
                            <div>
                              <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 py-1">
                                A+ Grade (Excellent)
                              </Badge>
                              <div className="text-sm text-gray-400 mt-1">
                                If all courses have A+ grade (80-89%)
                              </div>
                            </div>
                            <div className="text-xl font-semibold">9.0</div>
                          </div>
                        </div>
                        
                        <div className={`bg-dark-800 p-4 rounded-lg border ${requiredCGPA <= 8.0 ? 'border-green-500/50' : 'border-dark-700'}`}>
                          <div className="flex justify-between">
                            <div>
                              <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 py-1">
                                A Grade (Very Good)
                              </Badge>
                              <div className="text-sm text-gray-400 mt-1">
                                If all courses have A grade (70-79%)
                              </div>
                            </div>
                            <div className={`text-xl font-semibold ${requiredCGPA <= 8.0 ? 'text-green-400' : ''}`}>8.0</div>
                          </div>
                          {requiredCGPA <= 8.0 && (
                            <div className="mt-2 text-sm text-green-400 flex items-center">
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Your required CGPA of {requiredCGPA} is achievable with this grade
                            </div>
                          )}
                        </div>
                        
                        <div className={`bg-dark-800 p-4 rounded-lg border ${requiredCGPA <= 7.0 && requiredCGPA > 6.0 ? 'border-green-500/50' : 'border-dark-700'}`}>
                          <div className="flex justify-between">
                            <div>
                              <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 py-1">
                                B+ Grade (Good)
                              </Badge>
                              <div className="text-sm text-gray-400 mt-1">
                                If all courses have B+ grade (60-69%)
                              </div>
                            </div>
                            <div className={`text-xl font-semibold ${requiredCGPA <= 7.0 && requiredCGPA > 6.0 ? 'text-green-400' : ''}`}>7.0</div>
                          </div>
                          {requiredCGPA <= 7.0 && requiredCGPA > 6.0 && (
                            <div className="mt-2 text-sm text-green-400 flex items-center">
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Your required CGPA of {requiredCGPA} is achievable with this grade
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg text-gray-300 mb-4">CGPA Progress Chart</h3>
                      <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 h-72 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Completed', value: parseFloat(completedSemesters) * parseFloat(currentCGPA) },
                                { 
                                  name: 'Remaining', 
                                  value: (parseInt(totalSemesters) - parseInt(completedSemesters)) * 
                                         (requiredCGPA || 0)
                                }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={5}
                              dataKey="value"
                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              <Cell fill="#3b82f6" />
                              <Cell fill="#10b981" />
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                          <div className="text-xs text-gray-400">Completed Weight</div>
                          <div className="text-lg font-medium text-blue-400">
                            {(parseFloat(completedSemesters) * parseFloat(currentCGPA)).toFixed(1)}
                          </div>
                        </div>
                        
                        <div className="bg-dark-800 p-3 rounded-lg border border-dark-700">
                          <div className="text-xs text-gray-400">Required Weight</div>
                          <div className="text-lg font-medium text-green-400">
                            {((parseInt(totalSemesters) - parseInt(completedSemesters)) * 
                              (requiredCGPA || 0)).toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="companies" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="glass-card border-dark-800 mb-8 overflow-hidden animate-fade-in-up h-full">
                  <CardHeader className="bg-dark-900 border-b border-dark-800">
                    <CardTitle className="text-white flex items-center">
                      <Building className="h-5 w-5 text-blue-500 mr-2" />
                      Company Eligibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="block text-sm text-gray-400 mb-1">Your CGPA</Label>
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
                      
                      {parseFloat(currentCGPA) > 0 && (
                        <div className="pt-4">
                          <div className="text-sm text-gray-400 mb-2">Current Grade</div>
                          <div className="flex items-center">
                            {getCurrentGrade(parseFloat(currentCGPA)) ? (
                              <>
                                <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 py-1 px-3">
                                  {getCurrentGrade(parseFloat(currentCGPA))?.grade}
                                </Badge>
                                <span className="ml-2 text-white">
                                  {getCurrentGrade(parseFloat(currentCGPA))?.description}
                                </span>
                              </>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </div>
                      )}
                      
                      <Separator className="my-2 bg-dark-800" />
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Eligibility Overview</div>
                        <div className="space-y-3">
                          {Object.keys(companyTiers).map((tier) => {
                            const isEligible = parseFloat(currentCGPA) >= companyTiers[tier].minCGPA;
                            return (
                              <div 
                                key={tier}
                                className={`p-3 rounded-md flex items-center justify-between ${
                                  isEligible 
                                    ? 'bg-green-500/10 border border-green-500/30' 
                                    : 'bg-dark-800 border border-dark-700'
                                }`}
                              >
                                <div>
                                  <Badge 
                                    className={`${
                                      tier === 'S+' 
                                        ? 'bg-purple-500/20 text-purple-400' 
                                        : tier === 'A+' 
                                          ? 'bg-blue-500/20 text-blue-400'
                                          : tier === 'A'
                                            ? 'bg-green-500/20 text-green-400'
                                            : tier === 'B'
                                              ? 'bg-yellow-500/20 text-yellow-400'
                                              : 'bg-pink-500/20 text-pink-400'
                                    }`}
                                  >
                                    {tier} Tier
                                  </Badge>
                                  <div className="text-xs text-gray-400 mt-1">
                                    Min. CGPA: {companyTiers[tier].minCGPA}
                                  </div>
                                </div>
                                <div>
                                  {isEligible ? (
                                    <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500/30">
                                      Eligible
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-900/20 text-red-400 border-red-500/30">
                                      Not Eligible
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {parseFloat(currentCGPA) > 0 && (
                        <div className="pt-4">
                          <div className="text-sm text-gray-400 mb-2">Eligible Companies</div>
                          <div className="text-2xl font-bold text-white">
                            {eligibleCompanies.length}
                          </div>
                          <div className="text-sm text-gray-400">
                            {eligibleCompanies.length > 0 
                              ? `You're eligible for ${eligibleCompanies.length} companies based on your CGPA` 
                              : 'Increase your CGPA to become eligible for companies'}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                {parseFloat(currentCGPA) > 0 ? (
                  <Card className="glass-card border-dark-800 animate-fade-in-up h-full">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white">Companies You Can Apply To</CardTitle>
                        <Badge className="bg-blue-500/20 text-blue-400">
                          CGPA: {currentCGPA}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-400">
                        Based on your current CGPA, you're eligible for the following companies
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={tierCounts}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({name, value}) => value > 0 ? `${name}: ${value}` : ''}
                                >
                                  {tierCounts.map((entry, index) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={Object.values(TIER_COLORS)[index % Object.values(TIER_COLORS).length]} 
                                    />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="mt-4">
                            <h4 className="text-gray-300 mb-3">Company Tiers Legend</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(TIER_COLORS).map(([tier, color]) => (
                                <div key={tier} className="flex items-center">
                                  <div 
                                    className="w-3 h-3 rounded-full mr-2" 
                                    style={{ backgroundColor: color }}
                                  ></div>
                                  <div className="text-sm text-gray-400">
                                    {tier} Tier ({companyTiers[tier].ctc})
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 mt-4">
                            <h4 className="text-gray-300 mb-3">Eligible Companies by Tier</h4>
                            <div className="space-y-2">
                              {Object.keys(companyTiers).map(tier => {
                                const eligibleCount = eligibleCompanies.filter(c => c.tier === tier).length;
                                const totalCount = companyTiers[tier].companies.length;
                                const percent = totalCount > 0 ? (eligibleCount / totalCount) * 100 : 0;
                                
                                return (
                                  <div key={tier} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-400">{tier} Tier</span>
                                      <span className="text-white">{eligibleCount}/{totalCount}</span>
                                    </div>
                                    <div className="w-full h-2 bg-dark-700 rounded-full">
                                      <div 
                                        className="h-2 rounded-full"
                                        style={{
                                          width: `${percent}%`,
                                          backgroundColor: TIER_COLORS[tier]
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          {Object.keys(companyTiers).map(tier => {
                            const tierEligibleCompanies = eligibleCompanies.filter(c => c.tier === tier);
                            if (tierEligibleCompanies.length === 0) return null;
                            
                            return (
                              <div key={tier} className="space-y-3">
                                <div className="flex items-center">
                                  <Badge 
                                    className={`
                                      ${tier === 'S+' 
                                        ? 'bg-purple-500/20 text-purple-400' 
                                        : tier === 'A+' 
                                          ? 'bg-blue-500/20 text-blue-400'
                                          : tier === 'A'
                                            ? 'bg-green-500/20 text-green-400'
                                            : tier === 'B'
                                              ? 'bg-yellow-500/20 text-yellow-400'
                                              : 'bg-pink-500/20 text-pink-400'
                                      } py-1 px-3
                                    `}
                                  >
                                    {tier} Tier Companies
                                  </Badge>
                                  <div className="text-gray-400 text-sm ml-2">
                                    {companyTiers[tier].ctc}
                                  </div>
                                </div>
                                
                                <Card className="border-dark-700 bg-dark-800">
                                  <CardContent className="p-4 max-h-60 overflow-y-auto">
                                    <div className="grid grid-cols-1 gap-2">
                                      {tierEligibleCompanies.map((company, i) => (
                                        <div 
                                          key={i} 
                                          className="flex items-center py-1 px-2 hover:bg-dark-700 rounded-md"
                                        >
                                          <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                                          <span className="text-sm text-gray-300">{company.name}</span>
                                          <Badge 
                                            className="ml-auto bg-dark-900 text-gray-400 text-xs"
                                          >
                                            {company.cgpa}+
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            );
                          })}
                          
                          {eligibleCompanies.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8">
                              <Award className="h-16 w-16 text-gray-700 mb-4" />
                              <h3 className="text-lg text-gray-400">No Eligible Companies Yet</h3>
                              <p className="text-sm text-gray-500 text-center mt-2">
                                Increase your CGPA to at least 6.0 to become eligible for companies
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="glass-card border-dark-800 animate-fade-in-up h-full">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white flex items-center">
                        <Building className="h-5 w-5 text-blue-500 mr-2" />
                        Company Eligibility Checker
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-center py-10">
                        <Building className="h-16 w-16 text-gray-700 mb-6" />
                        <h3 className="text-xl text-gray-300 mb-2">Enter Your CGPA to Check Eligibility</h3>
                        <p className="text-sm text-gray-400 text-center max-w-md">
                          Find out which companies you're eligible to apply to based on your current CGPA. Many companies have CGPA cutoffs as part of their recruitment criteria.
                        </p>
                        
                        <div className="w-full max-w-xs mt-6">
                          <Input
                            type="number"
                            placeholder="Enter your CGPA"
                            className="bg-dark-800 border-dark-700 text-white text-center text-lg"
                            min="0"
                            max="10"
                            step="0.01"
                            value={currentCGPA}
                            onChange={(e) => setCurrentCGPA(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-6 bg-dark-800" />
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {Object.keys(companyTiers).map(tier => (
                          <Card key={tier} className="border-dark-700 bg-dark-800">
                            <CardContent className="p-3 text-center">
                              <Badge 
                                className={`mb-2 ${
                                  tier === 'S+' 
                                    ? 'bg-purple-500/20 text-purple-400' 
                                    : tier === 'A+' 
                                      ? 'bg-blue-500/20 text-blue-400'
                                      : tier === 'A'
                                        ? 'bg-green-500/20 text-green-400'
                                        : tier === 'B'
                                          ? 'bg-yellow-500/20 text-yellow-400'
                                          : 'bg-pink-500/20 text-pink-400'
                                }`}
                              >
                                {tier} Tier
                              </Badge>
                              <div className="text-xs text-gray-400">
                                Min CGPA: {companyTiers[tier].minCGPA}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {companyTiers[tier].ctc}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="projections" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="glass-card border-dark-800 mb-8 overflow-hidden animate-fade-in-up h-full">
                  <CardHeader className="bg-dark-900 border-b border-dark-800">
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                      CGPA Projections
                    </CardTitle>
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
                      
                      <div className="flex gap-4 mt-6">
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
              </div>
              
              <div className="md:col-span-2">
                {showResults && projectionData.length > 0 ? (
                  <Card className="glass-card border-dark-800 animate-fade-in-up h-full">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white">CGPA Projection Over Semesters</CardTitle>
                        {isAchievable ? (
                          <Badge className="bg-green-500/20 text-green-400">
                            Target Achievable
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-400">
                            Target Not Achievable
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-gray-400">
                        {isAchievable 
                          ? `You need a CGPA of ${requiredCGPA} in your remaining semesters to reach your target of ${targetCGPA}`
                          : `Your target CGPA of ${targetCGPA} is not achievable within ${totalSemesters} semesters`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={projectionData}
                              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis 
                                dataKey="semester" 
                                label={{ value: 'Semester', position: 'insideBottom', offset: -5, fill: '#8884d8' }}
                                stroke="rgba(255,255,255,0.3)"
                              />
                              <YAxis 
                                domain={[
                                  Math.max(0, Math.floor(parseFloat(currentCGPA)) - 1), 
                                  Math.min(10, Math.ceil(Math.max(parseFloat(targetCGPA), parseFloat(currentCGPA))) + 1)
                                ]}
                                label={{ value: 'CGPA', angle: -90, position: 'insideLeft', fill: '#8884d8' }}
                                stroke="rgba(255,255,255,0.3)"
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Line 
                                type="monotone" 
                                dataKey="cgpa" 
                                stroke="#8884d8" 
                                strokeWidth={2}
                                dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4, fill: '#2D2D3A' }}
                                activeDot={{ stroke: '#8884d8', strokeWidth: 2, r: 6, fill: '#8884d8' }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                            <h4 className="text-md text-gray-300 mb-3">Semester CGPA Breakdown</h4>
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                              {projectionData.map((item, index) => (
                                <div 
                                  key={index} 
                                  className={`flex justify-between p-2 rounded-md ${
                                    index < parseInt(completedSemesters) 
                                      ? 'bg-dark-900' 
                                      : 'bg-blue-500/10 border border-blue-500/20'
                                  }`}
                                >
                                  <div className="text-gray-400">
                                    Semester {item.semester}
                                  </div>
                                  <div className="text-white font-medium">
                                    {item.cgpa.toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-md text-gray-300">Your Progress</h4>
                                <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-500/30">
                                  {completedSemesters}/{totalSemesters} Semesters
                                </Badge>
                              </div>
                              <div className="w-full bg-dark-900 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-500 h-2.5 rounded-full" 
                                  style={{ width: `${(parseInt(completedSemesters) / parseInt(totalSemesters)) * 100}%` }}
                                ></div>
                              </div>
                              <div className="text-sm text-gray-400 mt-2">
                                {((parseInt(completedSemesters) / parseInt(totalSemesters)) * 100).toFixed(0)}% complete
                              </div>
                            </div>
                            
                            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                              <h4 className="text-md text-gray-300 mb-2">Target vs Current</h4>
                              <div className="flex items-center space-x-3">
                                <div className="text-3xl font-bold text-white">
                                  {currentCGPA}
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-500" />
                                <div className={`text-3xl font-bold ${isAchievable ? 'text-green-500' : 'text-red-500'}`}>
                                  {targetCGPA}
                                </div>
                              </div>
                              <div className="text-sm text-gray-400 mt-2">
                                {isAchievable 
                                  ? `You need to improve by ${(parseFloat(targetCGPA) - parseFloat(currentCGPA)).toFixed(2)} points`
                                  : 'Target not achievable with given constraints'}
                              </div>
                            </div>
                            
                            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                              <h4 className="text-md text-gray-300 mb-2">Required Performance</h4>
                              <div className="text-3xl font-bold text-blue-500">
                                {isAchievable ? requiredCGPA : 'N/A'}
                              </div>
                              <div className="text-sm text-gray-400 mt-2">
                                {isAchievable 
                                  ? `Average CGPA needed in remaining ${parseInt(totalSemesters) - parseInt(completedSemesters)} semesters`
                                  : 'Try adjusting your target or extending total semesters'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="glass-card border-dark-800 animate-fade-in-up h-full">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="text-white flex items-center">
                        <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                        CGPA Projections
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-center py-10">
                        <TrendingUp className="h-16 w-16 text-gray-700 mb-6" />
                        <h3 className="text-xl text-gray-300 mb-2">Visualize Your CGPA Path</h3>
                        <p className="text-sm text-gray-400 text-center max-w-md">
                          Enter your details and calculate to see a projection of how your CGPA will need to change each semester to reach your target.
                        </p>
                        
                        <div className="w-full max-w-md mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border-dark-700 bg-dark-800">
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                  <ArrowRight className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-md font-medium text-gray-200">Semester-by-Semester View</h4>
                                  <p className="text-sm text-gray-400 mt-1">
                                    See how your CGPA needs to progress each semester.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="border-dark-700 bg-dark-800">
                            <CardContent className="p-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                  <ArrowRight className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-md font-medium text-gray-200">Track Achievability</h4>
                                  <p className="text-sm text-gray-400 mt-1">
                                    Know if your target is realistic given your current status.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CGPA;
