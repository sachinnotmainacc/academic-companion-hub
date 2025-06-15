
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import ScrollToTop from "@/components/ScrollToTop";

import Index from "@/pages/Index";
import Notes from "@/pages/Notes";
import Pomodoro from "@/pages/Pomodoro";
import CGPA from "@/pages/CGPA";
import PlacementDSA from "@/pages/PlacementDSA";
import Projects from "@/pages/Projects";
import Courses from "@/pages/Courses";
import NotFound from "@/pages/NotFound";
import AdminDashboard from "@/pages/AdminDashboard";
import EmailPerks from "@/pages/EmailPerks";
import Typing from "@/pages/Typing";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/cgpa" element={<CGPA />} />
        <Route path="/placement-dsa" element={<PlacementDSA />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/typing" element={<Typing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/email-perks" element={<EmailPerks />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
