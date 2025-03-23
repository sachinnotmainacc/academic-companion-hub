
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Index from "@/pages/Index";
import CGPA from "@/pages/CGPA";
import InternalMarks from "@/pages/InternalMarks";
import KTUCalculator from "@/pages/KTUCalculator"; // Add the new page
import Notes from "@/pages/Notes";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cgpa" element={<CGPA />} />
        <Route path="/internal-marks" element={<InternalMarks />} />
        <Route path="/ktu-calculator" element={<KTUCalculator />} /> {/* Add the new route */}
        <Route path="/notes" element={<Notes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
