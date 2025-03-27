import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Index from "@/pages/Index";
import InternalMarks from "@/pages/InternalMarks";
import Notes from "@/pages/Notes";
import Pomodoro from "@/pages/Pomodoro";
import CGPA from "@/pages/CGPA";
import PlacementDSA from "@/pages/PlacementDSA";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/internal-marks" element={<InternalMarks />} />
        {/* Redirect legacy URLs to the new internal-marks page */}
        <Route path="/ktu-calculator" element={<Navigate to="/internal-marks" replace />} />
        <Route path="/ktu-internal" element={<Navigate to="/internal-marks" replace />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/cgpa" element={<CGPA />} />
        <Route path="/placement-dsa" element={<PlacementDSA />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
