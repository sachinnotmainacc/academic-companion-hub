
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
    <div className="space-y-6">
      {/* Header - More Compact */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <div className="p-3 rounded-2xl bg-gray-800 border border-gray-700">
            {icon}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-lg font-medium">
              {description}
            </p>
          </div>
        </div>
        
        {value && (
          <div className="text-right">
            <div className="flex items-center gap-2 text-xl font-bold text-green-400 mb-1">
              <Gift className="h-5 w-5" />
              {value}
            </div>
            <div className="text-xs text-gray-400 font-medium">Total Value</div>
          </div>
        )}
      </div>

      {/* Benefits Grid - More Compact */}
      <Card className="border-gray-800 bg-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-white flex items-center gap-3">
            <Star className="h-5 w-5 text-yellow-400" />
            What's Included
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-3 md:grid-cols-2">
            {offers.map((offer, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors duration-300">
                <div className="mt-0.5 p-1 rounded-full bg-green-500 flex-shrink-0">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-gray-200 leading-relaxed font-medium text-sm">
                  {offer}
                </span>
              </div>
            ))}
          </div>
          
          {/* Action Section - More Compact */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-center sm:text-left">
                <h4 className="text-lg font-bold text-white mb-2">Ready to get started?</h4>
                <p className="text-gray-300 font-medium text-sm">
                  Click below to access your student benefits instantly
                </p>
              </div>
              
              <Button 
                size="lg"
                className="w-full sm:w-auto h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold transition-all duration-300 shadow-lg shadow-blue-500/25" 
                onClick={handleAccessClick}
              >
                Access Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional Info - More Compact */}
      <div className="grid md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 backdrop-blur-sm">
          <Check className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <div className="text-sm font-bold text-green-400 mb-1">Verified</div>
          <div className="text-xs text-gray-400 font-medium">Student email required</div>
        </div>
        
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
          <Gift className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <div className="text-sm font-bold text-blue-400 mb-1">Free Access</div>
          <div className="text-xs text-gray-400 font-medium">No credit card needed</div>
        </div>
        
        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm">
          <Star className="h-6 w-6 text-purple-400 mx-auto mb-2" />
          <div className="text-sm font-bold text-purple-400 mb-1">Premium</div>
          <div className="text-xs text-gray-400 font-medium">Full feature access</div>
        </div>
      </div>
    </div>
  );
};

export default PerkDetails;
