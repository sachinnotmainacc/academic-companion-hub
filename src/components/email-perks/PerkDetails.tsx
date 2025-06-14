
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Check, Star, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PerkDetailsProps {
  title: string;
  description: string;
  offers: string[];
  icon: React.ReactNode;
  link: string;
  value?: string;
  gradient?: string;
  borderColor?: string;
}

const PerkDetails = ({ title, description, offers, icon, link, value, gradient }: PerkDetailsProps) => {
  const handleAccessClick = () => {
    window.open(link, '_blank');
    toast.success(`Accessing ${title} benefits`, {
      description: "You're being redirected to the provider's website"
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-dark-800 border border-dark-600">
            {icon}
          </div>
          
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white">
              {title}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              {description}
            </p>
          </div>
        </div>
        
        {value && (
          <div className="text-right">
            <div className="flex items-center gap-2 text-3xl font-bold text-green-400">
              <Gift className="h-8 w-8" />
              {value}
            </div>
            <div className="text-sm text-gray-500">Total Value</div>
          </div>
        )}
      </div>

      {/* Benefits Grid */}
      <Card className="border-dark-700 bg-dark-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <Star className="h-6 w-6 text-yellow-500" />
            What's Included
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {offers.map((offer, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-dark-700 hover:bg-dark-600 transition-colors duration-300">
                <div className="mt-1 p-1 rounded-full bg-green-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-300 leading-relaxed">
                  {offer}
                </span>
              </div>
            ))}
          </div>
          
          {/* Action Section */}
          <div className="mt-8 pt-6 border-t border-dark-700">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-center sm:text-left">
                <h4 className="text-lg font-semibold text-white mb-2">Ready to get started?</h4>
                <p className="text-gray-400 text-sm">
                  Click below to access your student benefits instantly
                </p>
              </div>
              
              <Button 
                size="lg"
                className="w-full sm:w-auto h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300" 
                onClick={handleAccessClick}
              >
                Access Now
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional Info */}
      <div className="grid md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <Check className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-green-400">Verified</div>
          <div className="text-xs text-gray-400">Student email required</div>
        </div>
        
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <Gift className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-blue-400">Free Access</div>
          <div className="text-xs text-gray-400">No credit card needed</div>
        </div>
        
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <Star className="h-6 w-6 text-purple-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-purple-400">Premium</div>
          <div className="text-xs text-gray-400">Full feature access</div>
        </div>
      </div>
    </div>
  );
};

export default PerkDetails;
