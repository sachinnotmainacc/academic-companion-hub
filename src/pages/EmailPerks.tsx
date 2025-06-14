
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
    icon: <Book className="h-8 w-8 text-blue-500" />,
    gradient: "from-blue-500/10 to-indigo-500/10",
    borderColor: "border-blue-500/30",
    hoverBorderColor: "hover:border-blue-500/50",
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
    icon: <Star className="h-8 w-8 text-yellow-500" />,
    gradient: "from-yellow-500/10 to-orange-500/10",
    borderColor: "border-yellow-500/30",
    hoverBorderColor: "hover:border-yellow-500/50",
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
    icon: <Award className="h-8 w-8 text-green-500" />,
    gradient: "from-green-500/10 to-emerald-500/10",
    borderColor: "border-green-500/30",
    hoverBorderColor: "hover:border-green-500/50",
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
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Student Benefits
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Unlock Premium
            <br />
            <span className="text-blue-400">Student Perks</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get access to <span className="text-blue-400 font-semibold">$200,000+ worth</span> of premium tools, 
            software, and services completely free with your student email address.
          </p>
          
          <div className="flex items-center justify-center gap-8 pt-6">
            <div className="flex items-center gap-2 text-green-400">
              <Gift className="h-5 w-5" />
              <span className="text-sm font-medium">100% Free</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">Verified Student Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Perks Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 lg:gap-10">
            {perks.map((perk, index) => (
              <Card 
                key={index} 
                className={`group bg-dark-900 border-dark-700 ${perk.hoverBorderColor} transition-all duration-300 hover:shadow-lg`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${perk.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300 rounded-lg`} />
                
                <div className="relative z-10">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-6">
                        <div className="p-4 rounded-2xl bg-dark-800 border border-dark-600 group-hover:border-dark-500 transition-colors duration-300">
                          {perk.icon}
                        </div>
                        
                        <div className="space-y-2">
                          <CardTitle className="text-3xl font-bold text-white">
                            {perk.title}
                          </CardTitle>
                          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                            {perk.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {perk.value}
                        </div>
                        <div className="text-sm text-gray-500">Total Value</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="grid md:grid-cols-2 gap-4">
                      {perk.offers.slice(0, 4).map((offer, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-blue-400" />
                          <span className="text-gray-300">
                            {offer}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {perk.offers.length > 4 && (
                      <div className="mt-4 pt-4 border-t border-dark-700">
                        <p className="text-blue-400 font-medium">
                          + {perk.offers.length - 4} more incredible benefits included
                        </p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-6 gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="flex-1 h-12 text-white border-dark-600 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300"
                        >
                          View All Benefits
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full max-w-3xl bg-dark-900 border-dark-700">
                        <PerkDetails {...perk} />
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300" 
                      onClick={() => handleAccessClick(perk.link, perk.title)}
                    >
                      Get Access Now
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="mt-16 text-center p-8 rounded-2xl bg-dark-900 border border-dark-700">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to unlock these amazing benefits?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              All you need is a valid student email address to access these premium tools and services worth thousands of dollars.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span>✓ No credit card required</span>
              <span>✓ Instant access</span>
              <span>✓ Valid throughout your studies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPerks;
