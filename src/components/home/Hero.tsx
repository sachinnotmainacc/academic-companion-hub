
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          <span className="blue-glow animate-fade-in-down inline-block mb-2 text-white">Your ultimate companion for</span>
          <br />
          <span className="text-gradient animate-fade-in-up inline-block">academic success</span>
        </h1>
        
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          College Daddy provides all the tools you need to excel in your academic journey - 
          from notes organization to grade calculations and study tools.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <Button 
            size="lg" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 rounded-xl"
            onClick={scrollToFeatures}
          >
            Explore Features
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-gray-600 text-gray-300 hover:bg-dark-800 px-8 rounded-xl"
          >
            Learn More
          </Button>
        </div>
        
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-transparent"
            onClick={scrollToFeatures}
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
