
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Award, Book, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PerkDetails from "@/components/email-perks/PerkDetails";
import { toast } from "sonner";

const perks = [
  {
    title: "GitHub Student Pack",
    description: "Free access to developer tools, cloud services, and learning resources",
    icon: <Book className="h-8 w-8 text-blue-500" />,
    offers: [
      "GitHub Pro free",
      "AWS credits",
      "Digital Ocean credits",
      "JetBrains IDEs",
    ],
    link: "https://education.github.com/pack"
  },
  {
    title: "Software & Tools",
    description: "Professional software and development tools for free",
    icon: <Star className="h-8 w-8 text-yellow-500" />,
    offers: [
      "Microsoft Office 365",
      "Notion Pro",
      "Figma Pro",
      "AutoDesk software",
    ],
    link: "https://www.microsoft.com/en-us/education/products/office"
  },
  {
    title: "Learning Platforms",
    description: "Access to premium educational content",
    icon: <Award className="h-8 w-8 text-green-500" />,
    offers: [
      "LinkedIn Learning",
      "Coursera discounts",
      "DataCamp student license",
      "Canva Pro",
    ],
    link: "https://www.linkedin.com/learning/"
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
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900">
      <Navbar />
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              Student Email Perks
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock amazing benefits with your student email address. Get access to premium tools, resources, and services.
            </p>
          </div>

          <div className="grid gap-6">
            {perks.map((perk, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden border-dark-800 bg-gradient-to-br from-dark-900/90 to-dark-800/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-dark-800 to-dark-700 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    {perk.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {perk.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{perk.description}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    {perk.offers.slice(0, 2).map((offer, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-300">{offer}</span>
                      </li>
                    ))}
                    {perk.offers.length > 2 && (
                      <li className="text-sm text-blue-400">And {perk.offers.length - 2} more benefits...</li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full hover:bg-dark-800 hover:text-white transition-colors">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-2xl bg-dark-950/95 backdrop-blur-lg border-dark-800">
                      <PerkDetails {...perk} />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/25" 
                    onClick={() => handleAccessClick(perk.link, perk.title)}
                  >
                    Get Access <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPerks;
