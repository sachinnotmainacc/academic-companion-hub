
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Book, Star } from "lucide-react";

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
    ]
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
    ]
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
    ]
  }
];

const EmailPerks = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary">Student Email Perks</h1>
          <p className="text-muted-foreground">
            Unlock these amazing benefits with your student email address
          </p>
        </div>

        <div className="grid gap-6">
          {perks.map((perk, index) => (
            <Card key={index} className="border-dark-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                {perk.icon}
                <div>
                  <CardTitle className="text-xl">{perk.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{perk.description}</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2">
                  {perk.offers.map((offer, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm">{offer}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailPerks;
