
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, RefreshCw, Calculator as CalcIcon, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface SemesterInput {
  id: number;
  name: string;
  sgpa: string;
  credits: string;
}

const CGPA = () => {
  const { toast } = useToast();
  const [semesters, setSemesters] = useState<SemesterInput[]>([
    { id: 1, name: "Semester 1", sgpa: "", credits: "" },
    { id: 2, name: "Semester 2", sgpa: "", credits: "" },
  ]);
  const [targetCGPA, setTargetCGPA] = useState("");
  const [currentCGPA, setCurrentCGPA] = useState<number | null>(null);
  const [requiredSGPA, setRequiredSGPA] = useState<number | null>(null);
  const [eligibleCompanies, setEligibleCompanies] = useState<string[]>([]);

  // Add a new semester
  const addSemester = () => {
    const newId = semesters.length > 0 ? Math.max(...semesters.map(s => s.id)) + 1 : 1;
    setSemesters([...semesters, { id: newId, name: `Semester ${newId}`, sgpa: "", credits: "" }]);
  };

  // Remove a semester
  const removeSemester = (id: number) => {
    if (semesters.length <= 1) {
      toast({
        title: "Cannot remove all semesters",
        description: "At least one semester must remain for calculations",
        variant: "destructive",
      });
      return;
    }
    setSemesters(semesters.filter(semester => semester.id !== id));
  };

  // Handle input changes
  const handleChange = (id: number, field: keyof SemesterInput, value: string) => {
    setSemesters(semesters.map(semester => {
      if (semester.id === id) {
        return { ...semester, [field]: value };
      }
      return semester;
    }));
  };

  // Calculate CGPA
  const calculateCGPA = () => {
    // Validate inputs
    const invalidInputs = semesters.some(semester => {
      const sgpa = parseFloat(semester.sgpa);
      const credits = parseFloat(semester.credits);
      return (
        isNaN(sgpa) || isNaN(credits) ||
        sgpa < 0 || sgpa > 10 ||
        credits <= 0
      );
    });

    if (invalidInputs) {
      toast({
        title: "Invalid inputs",
        description: "Please ensure all SGPA values are between 0-10 and credits are positive numbers",
        variant: "destructive",
      });
      return;
    }

    let totalCreditsPoints = 0;
    let totalCredits = 0;

    semesters.forEach(semester => {
      const sgpa = parseFloat(semester.sgpa);
      const credits = parseFloat(semester.credits);
      
      totalCreditsPoints += sgpa * credits;
      totalCredits += credits;
    });

    const cgpa = totalCreditsPoints / totalCredits;
    setCurrentCGPA(parseFloat(cgpa.toFixed(2)));

    // Calculate what companies student is eligible for
    const companies: string[] = [];
    if (cgpa >= 9.0) {
      companies.push("Google", "Microsoft", "Amazon", "Apple", "Facebook");
    } else if (cgpa >= 8.0) {
      companies.push("IBM", "Intel", "Adobe", "Oracle", "Salesforce");
    } else if (cgpa >= 7.0) {
      companies.push("Infosys", "TCS", "Wipro", "Cognizant", "Accenture");
    } else if (cgpa >= 6.0) {
      companies.push("Capgemini", "Tech Mahindra", "HCL", "Mindtree");
    }

    setEligibleCompanies(companies);

    // Calculate required SGPA if target is set
    if (targetCGPA) {
      const targetValue = parseFloat(targetCGPA);
      if (!isNaN(targetValue) && targetValue > 0 && targetValue <= 10) {
        const remainingCredits = 30; // Assumption for avg credits per sem
        const requiredTotal = targetValue * (totalCredits + remainingCredits);
        const requiredSGPA = (requiredTotal - totalCreditsPoints) / remainingCredits;
        
        if (requiredSGPA <= 10 && requiredSGPA > 0) {
          setRequiredSGPA(parseFloat(requiredSGPA.toFixed(2)));
        } else if (requiredSGPA > 10) {
          toast({
            title: "Target CGPA not achievable",
            description: "The required SGPA exceeds 10.0, which is not possible",
            variant: "destructive",
          });
          setRequiredSGPA(null);
        } else {
          setRequiredSGPA(null);
        }
      }
    }
  };

  // Reset all inputs
  const resetInputs = () => {
    setSemesters([
      { id: 1, name: "Semester 1", sgpa: "", credits: "" },
      { id: 2, name: "Semester 2", sgpa: "", credits: "" },
    ]);
    setTargetCGPA("");
    setCurrentCGPA(null);
    setRequiredSGPA(null);
    setEligibleCompanies([]);
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
              Calculate your Cumulative Grade Point Average and plan your academic goals
            </p>
          </div>
          
          <Card className="glass-card border-dark-800 mb-8 overflow-hidden animate-fade-in-up">
            <CardHeader className="bg-dark-900 border-b border-dark-800">
              <CardTitle className="text-white flex items-center">
                <CalcIcon className="h-5 w-5 text-blue-500 mr-2" />
                Enter Your Semester Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {semesters.map((semester) => (
                <div key={semester.id} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{semester.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => removeSemester(semester.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">SGPA</label>
                      <Input
                        type="number"
                        placeholder="0.0 - 10.0"
                        className="bg-dark-800 border-dark-700 text-white"
                        min="0"
                        max="10"
                        step="0.01"
                        value={semester.sgpa}
                        onChange={(e) => handleChange(semester.id, "sgpa", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Credits</label>
                      <Input
                        type="number"
                        placeholder="e.g. 21"
                        className="bg-dark-800 border-dark-700 text-white"
                        min="1"
                        value={semester.credits}
                        onChange={(e) => handleChange(semester.id, "credits", e.target.value)}
                      />
                    </div>
                  </div>
                  {semester.id !== semesters[semesters.length - 1].id && (
                    <Separator className="my-4 bg-dark-800" />
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                className="w-full mt-4 border-dashed border-gray-600 text-gray-400 hover:text-blue-400 hover:border-blue-500 hover:bg-blue-500/5"
                onClick={addSemester}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Semester
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-dark-800 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="bg-dark-900 border-b border-dark-800">
              <CardTitle className="text-white">Target CGPA (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  What CGPA do you want to achieve?
                </label>
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
            </CardContent>
          </Card>
          
          <div className="flex gap-4 mb-8">
            <Button 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              onClick={calculateCGPA}
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
          
          {currentCGPA !== null && (
            <Card className="glass-card border-dark-800 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="bg-dark-900 border-b border-dark-800">
                <CardTitle className="text-white">Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg text-gray-300 mb-2">Your Current CGPA</h3>
                  <div className="text-4xl font-bold text-blue-500">{currentCGPA}</div>
                </div>
                
                {requiredSGPA !== null && (
                  <div className="mb-6">
                    <h3 className="text-lg text-gray-300 mb-2">Required SGPA in Next Semester</h3>
                    <div className="text-2xl font-bold text-white">
                      {requiredSGPA > 10 ? "Not Possible" : requiredSGPA}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      To achieve your target CGPA of {targetCGPA}
                    </p>
                  </div>
                )}
                
                {eligibleCompanies.length > 0 && (
                  <div>
                    <h3 className="text-lg text-gray-300 mb-2">
                      Companies You May Be Eligible For
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {eligibleCompanies.map((company) => (
                        <div
                          key={company}
                          className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm"
                        >
                          {company}
                        </div>
                      ))}
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
