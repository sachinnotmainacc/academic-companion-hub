
import React from "react";
import { Calculator, Clock, Code, BookMarked, Map, GraduationCap } from "lucide-react";
import FeatureCard from "@/components/ui/FeatureCard";

const Features = () => {
  const features = [
    {
      title: "CGPA Calculator",
      description: "Calculate your CGPA effortlessly with our intelligent and intuitive calculator tool.",
      icon: Calculator,
      href: "/cgpa",
      style: { 
        background: "linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(219,39,119,0.08) 50%, rgba(147,51,234,0.05) 100%)",
        borderColor: "rgba(236,72,153,0.3)"
      }
    },
    {
      title: "Internal Marks",
      description: "Track and calculate your internal marks seamlessly across all subjects and semesters.",
      icon: GraduationCap,
      href: "/internal-marks",
      style: { 
        background: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(139,92,246,0.08) 50%, rgba(99,102,241,0.05) 100%)",
        borderColor: "rgba(168,85,247,0.3)"
      }
    },
    {
      title: "Pomodoro Timer",
      description: "Boost productivity with our advanced Pomodoro timer designed for focused study sessions.",
      icon: Clock,
      href: "/pomodoro",
      style: { 
        background: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(234,88,12,0.08) 50%, rgba(249,115,22,0.05) 100%)",
        borderColor: "rgba(245,158,11,0.3)"
      }
    },
    {
      title: "Placement DSA",
      description: "Master technical interviews with our comprehensive DSA question bank and practice suite.",
      icon: Code,
      href: "/placement-dsa",
      style: { 
        background: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.08) 50%, rgba(6,182,212,0.05) 100%)",
        borderColor: "rgba(16,185,129,0.3)"
      }
    },
    {
      title: "Online Courses",
      description: "Explore premium courses and learning resources to accelerate your academic journey.",
      icon: BookMarked,
      href: "/courses",
      style: { 
        background: "linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(6,182,212,0.08) 50%, rgba(59,130,246,0.05) 100%)",
        borderColor: "rgba(14,165,233,0.3)"
      }
    },
    {
      title: "Learning Roadmaps",
      description: "Follow expertly crafted learning paths and roadmaps for various technical domains.",
      icon: Map,
      href: "/roadmaps",
      style: { 
        background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(239,68,68,0.08) 50%, rgba(220,38,127,0.05) 100%)",
        borderColor: "rgba(249,115,22,0.3)"
      }
    }
  ];

  return (
    <section id="features" className="relative py-24 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-purple-500/8 rounded-full filter blur-3xl animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-emerald-500/6 rounded-full filter blur-3xl animate-pulse-subtle" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'pulse 8s ease-in-out infinite'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Premium Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6">
            <div className="px-6 py-2 rounded-full bg-dark-900/80 backdrop-blur-sm">
              <span className="text-blue-400 text-sm font-semibold tracking-wide uppercase">
                Premium Features
              </span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Everything You Need To </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent animate-fade-in">
              Excel
            </span>
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Unlock your academic potential with our comprehensive suite of premium tools 
            and resources designed to accelerate your learning journey.
          </p>
        </div>

        {/* Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              {/* Glow Effect */}
              <div 
                className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${feature.style.borderColor}, transparent, ${feature.style.borderColor})`
                }}
              ></div>
              
              {/* Feature Card */}
              <FeatureCard
                {...feature}
                className="relative h-full transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 border border-zinc-800/50 hover:border-zinc-700/80 backdrop-blur-xl bg-gradient-to-br from-zinc-900/90 to-zinc-800/50"
                style={{
                  ...feature.style,
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>All tools are free and ready to use</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
