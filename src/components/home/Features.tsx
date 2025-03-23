
import { ArrowRight, Book, Calculator, Clock, FileText, Lightbulb } from "lucide-react";
import FeatureCard from "@/components/ui/FeatureCard";

const Features = () => {
  const features = [
    {
      key: "cgpa",
      title: "CGPA Calculator",
      description: "Calculate your cumulative grade point average with our easy-to-use tool",
      icon: Calculator,
      href: "/cgpa",
      className: "bg-gradient-to-br from-blue-500/10 to-purple-500/5 border-blue-500/20",
      style: { animationDelay: '0.1s' }
    },
    {
      key: "internal",
      title: "Internal Assessment",
      description: "Track your internal marks and check your exam eligibility status",
      icon: FileText,
      href: "/internal-marks",
      className: "bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20",
      style: { animationDelay: '0.2s' }
    },
    {
      key: "ktu",
      title: "KTU Calculator",
      description: "Calculate your final marks using KTU's credit-based evaluation system",
      icon: Calculator,
      href: "/ktu-calculator",
      className: "bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20",
      style: { animationDelay: '0.25s' }
    },
    {
      key: "notes",
      title: "Notes Repository",
      description: "Access and download comprehensive study materials for all subjects",
      icon: Book,
      href: "/notes",
      className: "bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/20",
      style: { animationDelay: '0.3s' }
    },
    {
      key: "pomodoro",
      title: "Pomodoro Timer",
      description: "Boost your productivity with our customizable study timer",
      icon: Clock,
      href: "/pomodoro",
      className: "bg-gradient-to-br from-red-500/10 to-rose-500/5 border-red-500/20",
      style: { animationDelay: '0.4s' }
    },
    {
      key: "roadmaps",
      title: "Learning Roadmaps",
      description: "Follow curated paths to master different technologies and subjects",
      icon: Lightbulb,
      href: "/roadmaps",
      className: "bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border-cyan-500/20",
      style: { animationDelay: '0.5s' }
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            All the <span className="text-blue-500">Tools</span> You Need
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to succeed in your academic journey, all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.key}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              href={feature.href}
              className={`animate-fade-in ${feature.className}`}
              style={feature.style}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="#faq" 
            className="inline-flex items-center text-blue-500 hover:text-blue-400"
          >
            <span>Learn more about our tools</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
