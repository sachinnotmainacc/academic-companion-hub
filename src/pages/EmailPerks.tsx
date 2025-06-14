
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Award, Book, Star, ExternalLink, Sparkles, Gift, Code, Palette, Cloud, GraduationCap, Music, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PerkDetails from "@/components/email-perks/PerkDetails";
import { toast } from "sonner";

const perks = [
  {
    title: "Developer & Tech Tools",
    description: "Essential development tools and platforms for coding, hosting, and building projects",
    icon: <Code className="h-6 w-6 text-blue-400" />,
    gradient: "from-blue-600/20 to-indigo-600/20",
    borderColor: "border-blue-500/30",
    hoverBorderColor: "hover:border-blue-400/60",
    offers: [
      "GitHub Student Developer Pack - Free GitHub Pro, domain (.me/.xyz), SSL certificate",
      "JetBrains IDEs (IntelliJ, PyCharm) free for a year",
      "MongoDB Atlas: $50 in credits",
      "DigitalOcean: $100 in credits for 60 days",
      "Replit Hacker plan (6 months free)",
      "Taskade Pro (free access)",
      "InterviewCake for interview prep",
      "Canva Pro for 12 months",
      "Reality Check: Must verify student status. Indian colleges work 95% of the time"
    ],
    link: "https://education.github.com/pack",
    value: "$10,000+"
  },
  {
    title: "Software & Productivity Tools",
    description: "Professional software suites and productivity applications for academic and personal use",
    icon: <Star className="h-6 w-6 text-yellow-400" />,
    gradient: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30",
    hoverBorderColor: "hover:border-yellow-400/60",
    offers: [
      "JetBrains Student License - All professional IDEs free",
      "Notion Pro - Free for personal use (auto-applied with student email)",
      "Microsoft Office 365 - Word, Excel, PowerPoint, Teams online",
      "Google Workspace for Education - Extra Drive storage, unlimited Meet",
      "Reality: Office 365 depends on institution. Not all .ac.in emails work",
      "Google Workspace only if college uses it - not automatic"
    ],
    link: "https://www.jetbrains.com/community/education/",
    value: "$2,000+"
  },
  {
    title: "Design & Creativity",
    description: "Professional design tools and creative software for UI/UX design and content creation",
    icon: <Palette className="h-6 w-6 text-purple-400" />,
    gradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    hoverBorderColor: "hover:border-purple-400/60",
    offers: [
      "Canva Pro - 1 year free via GitHub Pack",
      "Figma Education Plan - Free Professional Plan with real-time collaboration",
      "Version history and advanced features",
      "Sometimes available separately for students via EDU access"
    ],
    link: "https://www.figma.com/education/",
    value: "$500+"
  },
  {
    title: "Cloud & Hosting Credits",
    description: "Free cloud hosting credits and platform access for deploying projects and applications",
    icon: <Cloud className="h-6 w-6 text-cyan-400" />,
    gradient: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/30",
    hoverBorderColor: "hover:border-cyan-400/60",
    offers: [
      "DigitalOcean - $100 credit from GitHub Student Pack",
      "Microsoft Azure for Students - $100 credit without credit card",
      "Google Cloud Platform - $50-$100 GCP credits via GitHub Pack",
      "Google Cloud Career Readiness Program access",
      "Tip: Use for deploying backend projects, portfolios, etc."
    ],
    link: "https://azure.microsoft.com/en-us/free/students/",
    value: "$300+"
  },
  {
    title: "Learning Platforms",
    description: "Access to premium educational content and skill development platforms for career growth",
    icon: <GraduationCap className="h-6 w-6 text-green-400" />,
    gradient: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    hoverBorderColor: "hover:border-green-400/60",
    offers: [
      "LinkedIn Learning - Free via universities or GitHub Pack",
      "Educative.io - 6-month free plan via GitHub Student Pack",
      "FrontendMasters - 6 months free with student verification",
      "Interactive coding lessons (DSA, system design, etc.)",
      "Courses on tech, soft skills, business"
    ],
    link: "https://www.frontendmasters.com/teachers/students/",
    value: "$1,500+"
  },
  {
    title: "Entertainment & Media",
    description: "Discounted streaming services and entertainment platforms for students",
    icon: <Music className="h-6 w-6 text-pink-400" />,
    gradient: "from-pink-500/20 to-red-500/20",
    borderColor: "border-pink-500/30",
    hoverBorderColor: "hover:border-pink-400/60",
    offers: [
      "Spotify Student Plan - ₹59/month (vs ₹119 regular)",
      "YouTube Premium Student - ₹79/month (vs ₹129 regular)",
      "Prime Video, faster delivery included",
      "Reality: Need SheerID verification - works with many Indian universities"
    ],
    link: "https://www.spotify.com/student/",
    value: "$200+"
  },
  {
    title: "Shopping & Discounts",
    description: "Exclusive student discounts on shopping, delivery, and essential services",
    icon: <ShoppingBag className="h-6 w-6 text-orange-400" />,
    gradient: "from-orange-500/20 to-yellow-500/20",
    borderColor: "border-orange-500/30",
    hoverBorderColor: "hover:border-orange-400/60",
    offers: [
      "Amazon Prime Student - ₹499/year (vs ₹1499 regular)",
      "Prime Video access included",
      "Faster delivery on eligible items",
      "Reality: Only if Amazon recognizes your college",
      "Not every Indian student email will work"
    ],
    link: "https://www.amazon.in/gp/student/signup/info",
    value: "$100+"
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
      <div className="container mx-auto pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-4 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Student Benefits Program
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Unlock Premium
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
              Student Perks
            </span>
          </h1>
          
          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed font-medium">
            Get access to <span className="text-blue-400 font-bold text-xl">$15,000+ worth</span> of premium tools, 
            software, and services completely free with your student email address.
          </p>
          
          <div className="flex items-center justify-center gap-8 pt-6">
            <div className="flex items-center gap-2 text-green-400">
              <Gift className="h-5 w-5" />
              <span className="text-sm font-semibold text-white">100% Free</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Award className="h-5 w-5" />
              <span className="text-sm font-semibold text-white">Verified Students Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Perks Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2">
            {perks.map((perk, index) => (
              <Card 
                key={index} 
                className={`group bg-gray-900/90 border-gray-800 ${perk.hoverBorderColor} transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur-sm`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${perk.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500 rounded-lg`} />
                
                <div className="relative z-10">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gray-800/80 border border-gray-700 group-hover:border-gray-600 transition-all duration-500 backdrop-blur-sm">
                          {perk.icon}
                        </div>
                        
                        <div className="space-y-2">
                          <CardTitle className="text-xl font-bold text-white tracking-tight">
                            {perk.title}
                          </CardTitle>
                          <p className="text-gray-300 text-sm leading-relaxed max-w-sm font-medium">
                            {perk.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400 mb-1">
                          {perk.value}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">Total Value</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {perk.offers.slice(0, 3).map((offer, i) => (
                        <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-300">
                          <div className="h-2 w-2 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                          <span className="text-gray-200 font-medium text-sm leading-relaxed">
                            {offer}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {perk.offers.length > 3 && (
                      <div className="mt-4 pt-3 border-t border-gray-800">
                        <p className="text-blue-400 font-semibold text-sm">
                          + {perk.offers.length - 3} more incredible benefits included
                        </p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-5 gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="flex-1 h-11 text-white font-semibold border-gray-700 hover:border-blue-500/60 hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm"
                        >
                          View All Benefits
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full max-w-3xl bg-gray-900 border-gray-800">
                        <PerkDetails {...perk} />
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40" 
                      onClick={() => handleAccessClick(perk.link, perk.title)}
                    >
                      Get Access Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-800 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to unlock these amazing benefits?
            </h3>
            <p className="text-gray-200 mb-6 max-w-xl mx-auto font-medium leading-relaxed">
              All you need is a valid student email address to access these premium tools and services worth thousands of dollars.
            </p>
            <div className="flex items-center justify-center gap-6 text-gray-300">
              <span className="flex items-center gap-2 font-semibold">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                No credit card required
              </span>
              <span className="flex items-center gap-2 font-semibold">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                Instant access
              </span>
              <span className="flex items-center gap-2 font-semibold">
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
