
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Calculator as CalcIcon, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const CGPA = () => {
  const { toast } = useToast();
  
  // User inputs
  const [currentCGPA, setCurrentCGPA] = useState("");
  const [completedSemesters, setCompletedSemesters] = useState("");
  const [targetCGPA, setTargetCGPA] = useState("");
  const [totalSemesters, setTotalSemesters] = useState("");
  
  // Results
  const [requiredCGPA, setRequiredCGPA] = useState<number | null>(null);
  const [isAchievable, setIsAchievable] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);

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
    setCompletedSemesters("");
    setTargetCGPA("");
    setTotalSemesters("");
    setRequiredCGPA(null);
    setIsAchievable(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              CGPA <span className="text-blue-500">Calculator</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Calculate the required CGPA in your remaining semesters to achieve your target
            </p>
          </div>
          
          <Card className="glass-card border-dark-800 mb-8 overflow-hidden animate-fade-in-up">
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
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-4 mb-8">
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
          
          {showResults && (
            <Card className="glass-card border-dark-800 animate-fade-in-up">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default CGPA;
