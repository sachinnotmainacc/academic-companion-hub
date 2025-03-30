
import React from "react";
import { BookOpen, Calculator, Clock, Code, BookMarked, Map } from "lucide-react";
import FeatureCard from "@/components/ui/FeatureCard";

const Features = () => {
  const features = [
    {
      title: "Study Notes",
      description: "Access comprehensive study notes and resources for your academic subjects.",
      icon: BookOpen,
      href: "/notes",
      style: { background: "linear-gradient(225deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.05) 100%)" }
    },
    {
      title: "CGPA Calculator",
      description: "Calculate your CGPA easily with our intuitive calculator tool.",
      icon: Calculator,
      href: "/cgpa",
      style: { background: "linear-gradient(225deg, rgba(236,72,153,0.1) 0%, rgba(219,39,119,0.05) 100%)" }
    },
    {
      title: "Internal Marks",
      description: "Track and calculate your internal marks for all your subjects.",
      icon: Calculator,
      href: "/internal-marks",
      style: { background: "linear-gradient(225deg, rgba(168,85,247,0.1) 0%, rgba(139,92,246,0.05) 100%)" }
    },
    {
      title: "Pomodoro Timer",
      description: "Stay focused with our Pomodoro timer for effective study sessions.",
      icon: Clock,
      href: "/pomodoro",
      style: { background: "linear-gradient(225deg, rgba(245,158,11,0.1) 0%, rgba(234,88,12,0.05) 100%)" }
    },
    {
      title: "Placement DSA",
      description: "Prepare for technical interviews with our DSA question bank.",
      icon: Code,
      href: "/placement-dsa",
      style: { background: "linear-gradient(225deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.05) 100%)" }
    },
    {
      title: "Online Courses",
      description: "Explore a variety of online courses to enhance your skills and knowledge.",
      icon: BookMarked,
      href: "/courses",
      style: { background: "linear-gradient(225deg, rgba(14,165,233,0.1) 0%, rgba(6,182,212,0.05) 100%)" }
    },
    {
      title: "Learning Roadmaps",
      description: "Follow structured learning paths for various technical domains.",
      icon: Map,
      href: "/roadmaps",
      style: { background: "linear-gradient(225deg, rgba(249,115,22,0.1) 0%, rgba(239,68,68,0.05) 100%)" }
    }
  ];

  return (
    <section className="py-20 bg-dark-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Everything You Need To <span className="text-blue-500">Excel</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform provides all the tools and resources you need to succeed in your academic journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              className="animate-fade-in-up"
              style={{
                ...feature.style,
                animationDelay: `${index * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
