
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Award, Book, Star, ExternalLink, Sparkles, Gift, Code, Palette, Cloud, GraduationCap, Music, ShoppingBag, Settings, Briefcase, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Navbar from "@/components/layout/Navbar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PerkDetails from "@/components/email-perks/PerkDetails";
import { toast } from "sonner";

type Category = "all" | "developers" | "creativity" | "placement-prep" | "utilities";

const categories = [
  { id: "all" as Category, label: "All Tools" },
  { id: "developers" as Category, label: "Developers" },
  { id: "creativity" as Category, label: "Creativity" },
  { id: "placement-prep" as Category, label: "Placement Prep" },
  { id: "utilities" as Category, label: "Utilities" }
];

const perks = [
  {
    title: "GitHub Student Developer Pack",
    description: "The ultimate collection of free developer tools and services for students",
    icon: <Code className="h-6 w-6 text-orange-400" />,
    gradient: "from-orange-600/20 to-red-600/20",
    borderColor: "border-orange-500/30",
    hoverBorderColor: "hover:border-orange-400/60",
    category: "developers" as Category,
    offers: [
      "Free GitHub Pro account",
      "Free domain (Namecheap .me or .xyz)",
      "Free SSL certificate (Namecheap)",
      "Canva Pro for 12 months",
      "JetBrains IDEs (IntelliJ, PyCharm) free for a year",
      "MongoDB Atlas: $50 in credits",
      "DigitalOcean: $100 in credits for 60 days",
      "Replit Hacker plan (6 months)",
      "Taskade Pro (free access)",
      "InterviewCake for interview prep",
      "Reality Check: Must verify student status. Indian colleges work 95% of the time"
    ],
    link: "https://education.github.com/pack",
    value: "$10,000+"
  },
  {
    title: "JetBrains Student License",
    description: "Professional IDEs for software development, completely free for students",
    icon: <Code className="h-6 w-6 text-purple-400" />,
    gradient: "from-purple-600/20 to-indigo-600/20",
    borderColor: "border-purple-500/30",
    hoverBorderColor: "hover:border-purple-400/60",
    category: "developers" as Category,
    offers: [
      "Free access to all JetBrains professional IDEs",
      "PyCharm Pro - Python development",
      "IntelliJ IDEA Ultimate - Java/Kotlin development",
      "WebStorm - JavaScript/TypeScript development",
      "PhpStorm - PHP development",
      "All other JetBrains tools included"
    ],
    link: "https://www.jetbrains.com/community/education/",
    value: "$1,500+"
  },
  {
    title: "Notion Pro",
    description: "All-in-one workspace for notes, tasks, wikis, and databases",
    icon: <Settings className="h-6 w-6 text-gray-400" />,
    gradient: "from-gray-600/20 to-slate-600/20",
    borderColor: "border-gray-500/30",
    hoverBorderColor: "hover:border-gray-400/60",
    category: "utilities" as Category,
    offers: [
      "Free Notion Pro for personal use",
      "Unlimited blocks and file uploads",
      "Advanced features and integrations",
      "Reality: Automatically applied with student email registration"
    ],
    link: "https://www.notion.so/students",
    value: "$200+"
  },
  {
    title: "Microsoft Office 365",
    description: "Complete office suite with Word, Excel, PowerPoint, and Teams",
    icon: <Briefcase className="h-6 w-6 text-blue-400" />,
    gradient: "from-blue-600/20 to-cyan-600/20",
    borderColor: "border-blue-500/30",
    hoverBorderColor: "hover:border-blue-400/60",
    category: "utilities" as Category,
    offers: [
      "Free access to Word, Excel, PowerPoint (online versions)",
      "Microsoft Teams for collaboration",
      "OneDrive cloud storage",
      "Reality: Depends on your institution. Not all .ac.in emails work"
    ],
    link: "https://www.microsoft.com/en-in/education/products/office",
    value: "$300+"
  },
  {
    title: "Google Workspace for Education",
    description: "Enhanced Google services with unlimited storage and advanced features",
    icon: <Cloud className="h-6 w-6 text-green-400" />,
    gradient: "from-green-600/20 to-emerald-600/20",
    borderColor: "border-green-500/30",
    hoverBorderColor: "hover:border-green-400/60",
    category: "utilities" as Category,
    offers: [
      "Extra Google Drive storage",
      "Enhanced Gmail with custom domain",
      "Google Meet with no time limits",
      "Google Classroom access",
      "Reality: Only if your college uses Google Workspace - not automatic"
    ],
    link: "https://edu.google.com/workspace-for-education/",
    value: "$200+"
  },
  {
    title: "Canva Pro",
    description: "Professional design tool with premium templates and features",
    icon: <Palette className="h-6 w-6 text-pink-400" />,
    gradient: "from-pink-600/20 to-rose-600/20",
    borderColor: "border-pink-500/30",
    hoverBorderColor: "hover:border-pink-400/60",
    category: "creativity" as Category,
    offers: [
      "1 year free via GitHub Pack",
      "Premium templates and design elements",
      "Background remover and magic resize",
      "Brand kit and team collaboration",
      "Also available separately for students via EDU access"
    ],
    link: "https://www.canva.com/education/",
    value: "$150+"
  },
  {
    title: "Figma Education Plan",
    description: "Professional design and prototyping tool for UI/UX designers",
    icon: <Palette className="h-6 w-6 text-purple-400" />,
    gradient: "from-purple-600/20 to-violet-600/20",
    borderColor: "border-purple-500/30",
    hoverBorderColor: "hover:border-purple-400/60",
    category: "creativity" as Category,
    offers: [
      "Free Figma Professional Plan",
      "Real-time collaboration features",
      "Version history and branching",
      "Advanced prototyping tools",
      "Unlimited personal files"
    ],
    link: "https://www.figma.com/education/",
    value: "$200+"
  },
  {
    title: "DigitalOcean Credits",
    description: "Cloud hosting platform with $100 in free credits for students",
    icon: <Cloud className="h-6 w-6 text-blue-400" />,
    gradient: "from-blue-600/20 to-indigo-600/20",
    borderColor: "border-blue-500/30",
    hoverBorderColor: "hover:border-blue-400/60",
    category: "developers" as Category,
    offers: [
      "$100 credit from GitHub Student Pack",
      "Deploy backend projects and APIs",
      "Host portfolios and websites",
      "Database hosting and management",
      "Tip: Perfect for deploying personal projects"
    ],
    link: "https://education.github.com/pack",
    value: "$100"
  },
  {
    title: "Microsoft Azure for Students",
    description: "Cloud computing platform with free credits and services",
    icon: <Cloud className="h-6 w-6 text-cyan-400" />,
    gradient: "from-cyan-600/20 to-blue-600/20",
    borderColor: "border-cyan-500/30",
    hoverBorderColor: "hover:border-cyan-400/60",
    category: "developers" as Category,
    offers: [
      "$100 credit without needing a credit card",
      "Free access to popular Azure services",
      "Virtual machines and databases",
      "AI and machine learning services",
      "12 months of free services"
    ],
    link: "https://azure.microsoft.com/en-us/free/students/",
    value: "$100+"
  },
  {
    title: "Google Cloud Platform Credits",
    description: "Google's cloud platform with free credits for student projects",
    icon: <Cloud className="h-6 w-6 text-orange-400" />,
    gradient: "from-orange-600/20 to-yellow-600/20",
    borderColor: "border-orange-500/30",
    hoverBorderColor: "hover:border-orange-400/60",
    category: "developers" as Category,
    offers: [
      "Via GitHub Pack: $50–$100 GCP credits",
      "Access to Google Cloud Career Readiness Program",
      "Machine learning and AI services",
      "Compute Engine and storage",
      "BigQuery for data analysis"
    ],
    link: "https://cloud.google.com/edu",
    value: "$100+"
  },
  {
    title: "LinkedIn Learning",
    description: "Professional development courses and skill building platform",
    icon: <GraduationCap className="h-6 w-6 text-blue-400" />,
    gradient: "from-blue-600/20 to-indigo-600/20",
    borderColor: "border-blue-500/30",
    hoverBorderColor: "hover:border-blue-400/60",
    category: "placement-prep" as Category,
    offers: [
      "Free via some universities or GitHub Pack",
      "Courses on technology and programming",
      "Soft skills and business courses",
      "Professional development content",
      "Certificates for course completion"
    ],
    link: "https://learning.linkedin.com/",
    value: "$300+"
  },
  {
    title: "Educative.io",
    description: "Interactive coding courses and interview preparation platform",
    icon: <GraduationCap className="h-6 w-6 text-green-400" />,
    gradient: "from-green-600/20 to-emerald-600/20",
    borderColor: "border-green-500/30",
    hoverBorderColor: "hover:border-green-400/60",
    category: "placement-prep" as Category,
    offers: [
      "6-month free plan via GitHub Student Pack",
      "Interactive coding lessons",
      "Data structures and algorithms courses",
      "System design interview prep",
      "Hands-on coding practice"
    ],
    link: "https://www.educative.io/github-students",
    value: "$500+"
  },
  {
    title: "FrontendMasters",
    description: "Advanced frontend development courses from industry experts",
    icon: <GraduationCap className="h-6 w-6 text-orange-400" />,
    gradient: "from-orange-600/20 to-red-600/20",
    borderColor: "border-orange-500/30",
    hoverBorderColor: "hover:border-orange-400/60",
    category: "placement-prep" as Category,
    offers: [
      "6 months free access with student verification",
      "Advanced JavaScript and React courses",
      "Frontend engineering best practices",
      "Interview preparation content",
      "Expert-led video courses"
    ],
    link: "https://www.frontendmasters.com/teachers/students/",
    value: "$500+"
  },
  {
    title: "Spotify Student Plan",
    description: "Music streaming service with significant student discount",
    icon: <Music className="h-6 w-6 text-green-400" />,
    gradient: "from-green-600/20 to-emerald-600/20",
    borderColor: "border-green-500/30",
    hoverBorderColor: "hover:border-green-400/60",
    category: "utilities" as Category,
    offers: [
      "₹59/month (vs ₹119 regular price)",
      "Ad-free music streaming",
      "Offline downloads",
      "High-quality audio",
      "Reality: Verify through SheerID - works with many Indian universities"
    ],
    link: "https://www.spotify.com/student/",
    value: "$50+"
  },
  {
    title: "YouTube Premium Student",
    description: "Ad-free YouTube experience with background play and downloads",
    icon: <Music className="h-6 w-6 text-red-400" />,
    gradient: "from-red-600/20 to-pink-600/20",
    borderColor: "border-red-500/30",
    hoverBorderColor: "hover:border-red-400/60",
    category: "utilities" as Category,
    offers: [
      "₹79/month (vs ₹129 regular price)",
      "Ad-free YouTube videos",
      "Background play on mobile",
      "YouTube Music included",
      "Offline video downloads"
    ],
    link: "https://www.youtube.com/premium/student",
    value: "$50+"
  },
  {
    title: "Amazon Prime Student",
    description: "Amazon's membership program with student pricing and benefits",
    icon: <ShoppingBag className="h-6 w-6 text-orange-400" />,
    gradient: "from-orange-600/20 to-yellow-600/20",
    borderColor: "border-orange-500/30",
    hoverBorderColor: "hover:border-orange-400/60",
    category: "utilities" as Category,
    offers: [
      "₹499/year (vs ₹1499 regular price)",
      "Prime Video streaming access",
      "Faster delivery on eligible items",
      "Prime Reading and exclusive deals",
      "Reality: Only if Amazon recognizes your college - not every student email works"
    ],
    link: "https://www.amazon.in/gp/student/signup/info",
    value: "$100+"
  }
];

const EmailPerks = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredPerks = selectedCategory === "all" 
    ? perks 
    : perks.filter(perk => perk.category === selectedCategory);

  const handleAccessClick = (link: string, title: string) => {
    window.open(link, '_blank');
    toast.success(`Accessing ${title} benefits`, {
      description: "You're being redirected to the provider's website"
    });
  };

  const getSelectedCategoryName = () => {
    if (selectedCategory === "all") return "All Tools";
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.label : "All Tools";
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

      {/* Filter Bar */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="flex justify-center">
            <CollapsibleTrigger asChild>
              <Button 
                className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 border-zinc-700/50 text-white hover:bg-zinc-700/80 justify-between min-w-[200px] transition-all duration-300 hover:shadow-lg hover:border-zinc-600/50"
                variant="outline"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {getSelectedCategoryName()}
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="w-full mt-2 transition-all duration-300 ease-in-out">
              <Card className="bg-gradient-to-br from-zinc-900/95 via-zinc-800/95 to-zinc-900/95 border-zinc-700/50 backdrop-blur-xl shadow-2xl animate-fade-in">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setIsFilterOpen(false);
                        }}
                        className={`h-12 transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id
                          ? 'bg-white text-black hover:bg-zinc-200 shadow-md'
                          : 'bg-zinc-800/50 text-zinc-300 hover:text-white hover:bg-zinc-700/80'
                        } rounded-xl text-sm`}
                      >
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Perks Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPerks.map((perk, index) => (
              <Card 
                key={index} 
                className={`group bg-gray-900/60 border border-gray-800/50 ${perk.hoverBorderColor} transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-xl rounded-2xl overflow-hidden h-full flex flex-col hover:scale-[1.02] animate-fade-in`}
                style={{
                  boxShadow: '0 0 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${perk.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-2xl`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <CardHeader className="pb-4 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-gray-800/80 border border-gray-700/60 group-hover:border-gray-600/60 transition-all duration-500 backdrop-blur-sm shadow-lg">
                        {perk.icon}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-400 mb-1">
                          {perk.value}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">Value</div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg font-bold text-white tracking-tight leading-tight mb-2">
                      {perk.title}
                    </CardTitle>
                    <p className="text-gray-300 text-sm leading-relaxed font-medium">
                      {perk.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0 px-6 flex-grow">
                    <div className="space-y-2">
                      {perk.offers.slice(0, 3).map((offer, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-gray-800/40 hover:bg-gray-800/60 transition-colors duration-300 border border-gray-700/30">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2 shadow-sm shadow-blue-400/50" />
                          <span className="text-gray-200 font-medium text-xs leading-relaxed">
                            {offer}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {perk.offers.length > 3 && (
                      <div className="mt-4 pt-3 border-t border-gray-800/60">
                        <p className="text-blue-400 font-semibold text-xs">
                          + {perk.offers.length - 3} more benefits included
                        </p>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-4 px-6 pb-6 gap-3 mt-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1 h-9 text-white font-semibold border-gray-700/60 hover:border-blue-500/60 hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm rounded-xl text-xs"
                        >
                          View All
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full max-w-3xl bg-gray-900 border-gray-800">
                        <PerkDetails {...perk} />
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm"
                      className="flex-1 h-9 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 rounded-xl text-xs" 
                      onClick={() => handleAccessClick(perk.link, perk.title)}
                    >
                      Get Access
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="mt-20 text-center p-10 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-800/60 backdrop-blur-xl shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to unlock these amazing benefits?
            </h3>
            <p className="text-gray-200 mb-8 max-w-2xl mx-auto font-medium leading-relaxed text-lg">
              All you need is a valid student email address to access these premium tools and services worth thousands of dollars.
            </p>
            <div className="flex items-center justify-center gap-8 text-gray-300 flex-wrap">
              <span className="flex items-center gap-3 font-semibold">
                <div className="h-2 w-2 rounded-full bg-green-400 shadow-sm shadow-green-400/50"></div>
                No credit card required
              </span>
              <span className="flex items-center gap-3 font-semibold">
                <div className="h-2 w-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50"></div>
                Instant access
              </span>
              <span className="flex items-center gap-3 font-semibold">
                <div className="h-2 w-2 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50"></div>
                Valid throughout studies
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPerks;
