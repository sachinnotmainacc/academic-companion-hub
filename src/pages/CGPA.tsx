
import { useState } from "react";
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
  ArrowUpRight,
  BarChart as ChartIcon,
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
} from "recharts";

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
  const processedCompanyTiers = processCompanyData();
  
  // User inputs
  const [currentCGPA, setCurrentCGPA] = useState("");
  const [targetCGPA, setTargetCGPA] = useState("");
  
  // Fixed values
  const totalSemesters = 8;
  const [completedSemesters, setCompletedSemesters] = useState(4);
  
  // Results
  const [requiredCGPA, setRequiredCGPA] = useState<number | null>(null);
  const [isAchievable, setIsAchievable] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Chart data
  const [chartData, setChartData] = useState<any[]>([]);
  const [eligibleCompanies, setEligibleCompanies] = useState<{[key: string]: string[]}>({});
  const [tierDistribution, setTierDistribution] = useState<{name: string, value: number}[]>([]);
  
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
  
  // Find companies that the student is eligible for
  const findEligibleCompanies = (currCGPA: number) => {
    const eligible: {[key: string]: string[]} = {};
    let distribution: {name: string, value: number}[] = [];
    
    Object.keys(processedCompanyTiers).forEach(tier => {
      if (currCGPA >= processedCompanyTiers[tier].minCGPA) {
        eligible[tier] = processedCompanyTiers[tier].companies;
        distribution.push({
          name: tier,
          value: processedCompanyTiers[tier].companies.length
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
    setEligibleCompanies({});
    setTierDistribution([]);
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
  
  return (
    <div className="min-h-screen bg-dark-950 text-white">
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
                <CardTitle className="text-white flex items-center">
                  <Calculator className="h-5 w-5 text-blue-500 mr-2" />
                  CGPA Calculator
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
                
                <div className="flex items-center justify-between text-sm text-gray-400 py-2 px-3 bg-dark-800/50 rounded">
                  <span>Completed Semesters:</span>
                  <span className="font-medium text-white">{completedSemesters}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 py-2 px-3 bg-dark-800/50 rounded">
                  <span>Total Semesters:</span>
                  <span className="font-medium text-white">{totalSemesters}</span>
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
                {chartData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                      >
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis domain={[0, 10]} stroke="#6b7280" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="cgpa" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
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
                                {tierDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
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
                          <div className="p-3 rounded-lg bg-dark-800 border border-dark-700">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-purple-400 bg-purple-500/20 border-purple-500/30">
                                S+ Tier
                              </Badge>
                              <span className="text-white font-medium">₹30+ LPA</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-800 border border-dark-700">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-blue-400 bg-blue-500/20 border-blue-500/30">
                                A+ Tier
                              </Badge>
                              <span className="text-white font-medium">₹20-30 LPA</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-800 border border-dark-700">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-green-400 bg-green-500/20 border-green-500/30">
                                A Tier
                              </Badge>
                              <span className="text-white font-medium">₹10-20 LPA</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-800 border border-dark-700">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-yellow-400 bg-yellow-500/20 border-yellow-500/30">
                                B Tier
                              </Badge>
                              <span className="text-white font-medium">₹5-10 LPA</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-dark-800 border border-dark-700">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-orange-400 bg-orange-500/20 border-orange-500/30">
                                C Tier
                              </Badge>
                              <span className="text-white font-medium">Below ₹5 LPA</span>
                            </div>
                          </div>
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
                        <h3 className="text-lg font-medium text-white">Eligible Companies</h3>
                        <Badge className="bg-dark-800 text-white">
                          {countTotalEligibleCompanies()}/{countTotalCompanies()}
                        </Badge>
                      </div>
                      <div className="flex flex-col space-y-4">
                        {Object.keys(eligibleCompanies).sort().reverse().map(tier => (
                          <div key={tier} className="flex items-center space-x-3">
                            <Badge variant="outline" className={getTierColor(tier)}>
                              {tier}
                            </Badge>
                            <div className="text-lg font-medium text-white">
                              {eligibleCompanies[tier].length}
                            </div>
                            <div className="text-sm text-gray-400">
                              {processedCompanyTiers[tier].ctc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Company List</h3>
                      <ScrollArea className="h-[300px] rounded-md border border-dark-700">
                        <div className="p-4 space-y-6">
                          {Object.keys(eligibleCompanies).sort().reverse().map(tier => (
                            <div key={tier}>
                              <div className="flex items-center mb-2">
                                <Badge variant="outline" className={getTierColor(tier)}>
                                  {tier} Tier
                                </Badge>
                                <span className="ml-2 text-sm text-gray-400">
                                  {processedCompanyTiers[tier].ctc}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {eligibleCompanies[tier].map(company => (
                                  <Badge key={company} variant="outline" className="bg-dark-800 text-gray-300">
                                    {company}
                                  </Badge>
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
