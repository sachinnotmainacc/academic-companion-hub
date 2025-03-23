
import { BookOpen, Calculator, Clock, Map, Award } from "lucide-react";
import FeatureCard from "@/components/ui/FeatureCard";

const Features = () => {
  const features = [
    {
      title: "Notes Repository",
      description: "Organize your study materials by semester and subject for easy access",
      icon: BookOpen,
      href: "/notes",
    },
    {
      title: "CGPA Calculator",
      description: "Calculate your cumulative GPA and predict future performance",
      icon: Calculator,
      href: "/cgpa",
    },
    {
      title: "Internal Assessment",
      description: "Track and calculate your internal marks for each subject",
      icon: Award,
      href: "/internal-marks",
    },
    {
      title: "Pomodoro Timer",
      description: "Boost productivity with focused study sessions and breaks",
      icon: Clock,
      href: "/pomodoro",
    },
    {
      title: "Roadmaps",
      description: "Follow curated learning paths for various tech fields and subjects",
      icon: Map,
      href: "/roadmaps",
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to <span className="text-blue-500">Excel</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            College Daddy provides powerful tools designed specifically for college students to streamline their academic journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              href={feature.href}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
