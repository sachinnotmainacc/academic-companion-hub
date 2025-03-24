
import React from "react";
import FeatureCard from "@/components/ui/FeatureCard";
import { Calculator, BookOpen, Clock, Youtube } from "lucide-react";

const Features: React.FC = () => {
  return (
    <section id="features" className="pt-20 pb-20 md:pt-28 md:pb-28 bg-dark-900 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Incredible <span className="text-blue-500">Features</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tools designed to make your academic life easier and help you excel in your studies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="KTU Calculator"
            description="Calculate your KTU marks and grade based on the examination pattern."
            icon={Calculator}
            href="/ktu-calculator"
            className="bg-gradient-to-br from-green-500/10 to-green-700/10 hover:from-green-500/20 hover:to-green-700/20"
            style={{ animationDelay: "0.1s" }}
          />
          
          <FeatureCard
            title="CGPA Calculator"
            description="Calculate your CGPA and predict what grades you need to achieve your target."
            icon={Calculator}
            href="/cgpa"
            className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 hover:from-blue-500/20 hover:to-blue-700/20"
            style={{ animationDelay: "0.2s" }}
          />
          
          <FeatureCard
            title="Study Notes"
            description="Access study notes for various subjects and courses."
            icon={BookOpen}
            href="/notes"
            className="bg-gradient-to-br from-red-500/10 to-red-700/10 hover:from-red-500/20 hover:to-red-700/20"
            style={{ animationDelay: "0.3s" }}
          />
          
          <FeatureCard
            title="Pomodoro Timer"
            description="Focus on your studies with this customizable pomodoro timer."
            icon={Clock}
            href="/pomodoro"
            className="bg-gradient-to-br from-yellow-500/10 to-yellow-700/10 hover:from-yellow-500/20 hover:to-yellow-700/20"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
      
      {/* Background gradient */}
      <div className="absolute -bottom-48 left-1/2 transform -translate-x-1/2 w-3/4 h-80 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
    </section>
  );
};

export default Features;
