
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PerkDetailsProps {
  title: string;
  description: string;
  offers: string[];
  icon: React.ReactNode;
  link: string;
}

const PerkDetails = ({ title, description, offers, icon, link }: PerkDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-dark-800/50">
          {icon}
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>

      <Card className="border-dark-800 bg-dark-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">What's Included</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {offers.map((offer, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <Check className="h-5 w-5 text-green-500" />
                <span>{offer}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button 
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25" 
              onClick={() => window.open(link, '_blank')}
            >
              Get Access Now <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerkDetails;
