
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Award, Book, Star, ExternalLink, Sparkles, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PerkDetails from "@/components/email-perks/PerkDetails";
import { toast } from "sonner";

const perks = [
  {
    title: "GitHub Student Pack",
    description: "Free access to developer tools, cloud services, and learning resources worth $200,000+",
    icon: <Book className="h-8 w-8 text-blue-400" />,
    gradient: "from-blue-600/20 to-indigo-600/20",
    borderColor: "border-blue-500/30",
    hoverBorderColor: "hover:border-blue-400/60",
    offers: [
      "GitHub Pro free for students",
      "$200 AWS credits for cloud computing",
      "$100 Digital Ocean credits",
      "JetBrains IDEs completely free",
      "Heroku Hobby Dyno free for 2 years",
      "Bootstrap Studio license"
    ],
    link: "https://education.github.com/pack",
    value: "$200,000+"
  },
  {
    title: "Software & Tools",
    description: "Professional software and development tools that boost your productivity",
    icon: <Star className="h-8 w-8 text-yellow-400" />,
    gradient: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30",
    hoverBorderColor: "hover:border-yellow-400/60",
    offers: [
      "Microsoft Office 365 Education",
      "Notion Pro for unlimited blocks",
      "Figma Pro for advanced design",
      "AutoDesk Maya & 3ds Max",
      "Adobe Creative Cloud discount",
      "Sketch app for Mac users"
    ],
    link: "https://www.microsoft.com/en-us/education/products/office",
    value: "$2,000+"
  },
  {
    title: "Learning Platforms",
    description: "Access to premium educational content and skill development platforms",
    icon: <Award className="h-8 w-8 text-green-400" />,
    gradient: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    hoverBorderColor: "hover:border-green-400/60",
    offers: [
      "LinkedIn Learning premium access",
      "Coursera Plus with 90% discount",
      "DataCamp premium license",
      "Canva Pro for creative projects",
      "Udemy Business discount",
      "Pluralsight free trial extended"
    ],
    link: "https://www.linkedin.com/learning/",
    value: "$1,500+"
  }
];

const EmailPerks = () => {
  const handleAccessClick = (link: string, title: string) => {
    window.open(link, '_blank');
    toast.success(`Accessing ${title} benefits`, {
      description: "You're being redirected to the provider's website"
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-6 backdrop-blur-sm">
            <Sparkles className="h-5 w-5" />
            Student Benefits Program
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Unlock Premium
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
              Student Perks
            </span>
          </h1>
          
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium">
            Get access to <span className="text-blue-400 font-bold text-2xl">$200,000+ worth</span> of premium tools, 
            software, and services completely free with your student email address.
          </p>
          
          <div className="flex items-center justify-center gap-12 pt-8">
            <div className="flex items-center gap-3 text-green-400">
              <Gift className="h-6 w-6" />
              <span className="text-lg font-semibold text-white">100% Free</span>
            </div>
            <div className="flex items-center gap-3 text-blue-400">
              <Award className="h-6 w-6" />
              <span className="text-lg font-semibold text-white">Verified Students Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Perks Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 lg:gap-12">
            {perks.map((perk, index) => (
              <Card 
                key={index} 
                className={`group bg-gray-900/90 border-gray-800 ${perk.hoverBorderColor} transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-sm`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${perk.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500 rounded-lg`} />
                
                <div className="relative z-10">
                  <CardHeader className="pb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-8">
                        <div className="p-5 rounded-3xl bg-gray-800/80 border border-gray-700 group-hover:border-gray-600 transition-all duration-500 backdrop-blur-sm">
                          {perk.icon}
                        </div>
                        
                        <div className="space-y-3">
                          <CardTitle className="text-4xl font-bold text-white tracking-tight">
                            {perk.title}
                          </CardTitle>
                          <p className="text-gray-300 text-xl leading-relaxed max-w-2xl font-medium">
                            {perk.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-400 mb-1">
                          {perk.value}
                        </div>
                        <div className="text-sm text-gray-400 font-medium">Total Value</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="grid md:grid-cols-2 gap-5">
                      {perk.offers.slice(0, 4).map((offer, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-300">
                          <div className="h-3 w-3 rounded-full bg-blue-400 flex-shrink-0" />
                          <span className="text-gray-200 font-medium">
                            {offer}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {perk.offers.length > 4 && (
                      <div className="mt-6 pt-5 border-t border-gray-800">
                        <p className="text-blue-400 font-semibold text-lg">
                          + {perk.offers.length - 4} more incredible benefits included
                        </p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-8 gap-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="flex-1 h-14 text-white font-semibold text-lg border-gray-700 hover:border-blue-500/60 hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm"
                        >
                          View All Benefits
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full max-w-3xl bg-gray-900 border-gray-800">
                        <PerkDetails {...perk} />
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40" 
                      onClick={() => handleAccessClick(perk.link, perk.title)}
                    >
                      Get Access Now
                      <ExternalLink className="ml-3 h-6 w-6" />
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="mt-20 text-center p-10 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-800 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to unlock these amazing benefits?
            </h3>
            <p className="text-gray-200 mb-8 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              All you need is a valid student email address to access these premium tools and services worth thousands of dollars.
            </p>
            <div className="flex items-center justify-center gap-8 text-gray-300">
              <span className="flex items-center gap-2 text-lg font-semibold">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                No credit card required
              </span>
              <span className="flex items-center gap-2 text-lg font-semibold">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                Instant access
              </span>
              <span className="flex items-center gap-2 text-lg font-semibold">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                Valid throughout your studies
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPerks;
