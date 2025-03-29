
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Shield, Upload, BookOpen, PlusCircle, FileText, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/admin/AuthModal";
import { PDFUploader } from "@/components/admin/PDFUploader";
import { SubjectManager } from "@/components/admin/SubjectManager";
import { PDFList } from "@/components/admin/PDFList";

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [activeTab, setActiveTab] = useState<"upload" | "manage" | "view">("upload");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated in this session
    const authStatus = sessionStorage.getItem("adminAuth");
    if (authStatus === "authenticated") {
      setIsAuthenticated(true);
      setShowAuthModal(false);
    }
  }, []);

  const handleLogin = (id: string, password: string) => {
    if (id === "sachinskyte" && password === "sachin9986") {
      setIsAuthenticated(true);
      setShowAuthModal(false);
      sessionStorage.setItem("adminAuth", "authenticated");
      toast.success("Logged in successfully");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAuthModal(true);
    sessionStorage.removeItem("adminAuth");
    toast.info("Logged out");
  };

  if (!isAuthenticated) {
    return <AuthModal isOpen={showAuthModal} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className={`cursor-pointer transition-all ${activeTab === "upload" ? "border-primary bg-primary/5" : ""}`} 
            onClick={() => setActiveTab("upload")}>
            <CardContent className="p-6 flex items-center gap-4">
              <Upload className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Upload PDFs</h3>
                <p className="text-sm text-muted-foreground">Upload new PDF resources</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer transition-all ${activeTab === "manage" ? "border-primary bg-primary/5" : ""}`}
            onClick={() => setActiveTab("manage")}>
            <CardContent className="p-6 flex items-center gap-4">
              <PlusCircle className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Manage Subjects</h3>
                <p className="text-sm text-muted-foreground">Add or edit subjects</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer transition-all ${activeTab === "view" ? "border-primary bg-primary/5" : ""}`}
            onClick={() => setActiveTab("view")}>
            <CardContent className="p-6 flex items-center gap-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">View Uploads</h3>
                <p className="text-sm text-muted-foreground">See all uploaded PDFs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-lg border p-6">
          {activeTab === "upload" && <PDFUploader />}
          {activeTab === "manage" && <SubjectManager />}
          {activeTab === "view" && <PDFList />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
