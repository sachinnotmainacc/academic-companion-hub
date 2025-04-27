import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import Index from "@/pages/Index";
import InternalMarks from "@/pages/InternalMarks";
import Notes from "@/pages/Notes";
import Pomodoro from "@/pages/Pomodoro";
import CGPA from "@/pages/CGPA";
import PlacementDSA from "@/pages/PlacementDSA";
import Courses from "@/pages/Courses";
import NotFound from "@/pages/NotFound";
import AdminDashboard from "@/pages/AdminDashboard";
import EmailPerks from "@/pages/EmailPerks";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/internal-marks" element={<InternalMarks />} />
        <Route path="/ktu-calculator" element={<Navigate to="/internal-marks" replace />} />
        <Route path="/ktu-internal" element={<Navigate to="/internal-marks" replace />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/cgpa" element={<CGPA />} />
        <Route path="/placement-dsa" element={<PlacementDSA />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/email-perks" element={<EmailPerks />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
