
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Award, Book, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 to-dark-900">
      <Navbar />
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              Student Email Perks
            </h1>
            <p className="text-xl text-muted-foreground">
              Unlock amazing benefits with your student email address
            </p>
          </div>

          <div className="grid gap-6">
            {perks.map((perk, index) => (
              <Card 
                key={index} 
                className="border-dark-800 bg-dark-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-2 rounded-xl bg-dark-800/50 group-hover:scale-110 transition-transform">
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
                    {perk.offers.map((offer, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-300">{offer}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full hover:bg-dark-800 hover:text-white transition-colors">
                        View Details
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-dark-900/95 backdrop-blur-lg border-dark-800">
                      <div className="space-y-4">
                        <h4 className="font-medium text-lg text-white">{perk.title} Details</h4>
                        <p className="text-sm text-gray-400">{perk.description}</p>
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-300">What's included:</h5>
                          <ul className="text-sm text-gray-400 space-y-1">
                            {perk.offers.map((offer, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-blue-500" />
                                {offer}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25" 
                    onClick={() => window.open(perk.link, '_blank')}
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
