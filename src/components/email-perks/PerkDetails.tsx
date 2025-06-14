
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
        <div className="flex items-center gap-8">
          <div className="p-5 rounded-3xl bg-gray-800 border border-gray-700">
            {icon}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-gray-300 text-xl leading-relaxed max-w-xl font-medium">
              {description}
            </p>
          </div>
        </div>
        
        {value && (
          <div className="text-right">
            <div className="flex items-center gap-3 text-3xl font-bold text-green-400 mb-2">
              <Gift className="h-8 w-8" />
              {value}
            </div>
            <div className="text-sm text-gray-400 font-medium">Total Value</div>
          </div>
        )}
      </div>

      {/* Benefits Grid */}
      <Card className="border-gray-800 bg-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl text-white flex items-center gap-4">
            <Star className="h-7 w-7 text-yellow-400" />
            What's Included
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="grid gap-5 md:grid-cols-2">
            {offers.map((offer, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-gray-700/50 hover:bg-gray-700/70 transition-colors duration-300">
                <div className="mt-1 p-1.5 rounded-full bg-green-500 flex-shrink-0">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-200 leading-relaxed font-medium">
                  {offer}
                </span>
              </div>
            ))}
          </div>
          
          {/* Action Section */}
          <div className="mt-10 pt-8 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
              <div className="text-center sm:text-left">
                <h4 className="text-xl font-bold text-white mb-3">Ready to get started?</h4>
                <p className="text-gray-300 font-medium">
                  Click below to access your student benefits instantly
                </p>
              </div>
              
              <Button 
                size="lg"
                className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-500/25" 
                onClick={handleAccessClick}
              >
                Access Now
                <ExternalLink className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional Info */}
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 backdrop-blur-sm">
          <Check className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <div className="text-lg font-bold text-green-400 mb-1">Verified</div>
          <div className="text-sm text-gray-400 font-medium">Student email required</div>
        </div>
        
        <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
          <Gift className="h-8 w-8 text-blue-400 mx-auto mb-3" />
          <div className="text-lg font-bold text-blue-400 mb-1">Free Access</div>
          <div className="text-sm text-gray-400 font-medium">No credit card needed</div>
        </div>
        
        <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm">
          <Star className="h-8 w-8 text-purple-400 mx-auto mb-3" />
          <div className="text-lg font-bold text-purple-400 mb-1">Premium</div>
          <div className="text-sm text-gray-400 font-medium">Full feature access</div>
        </div>
      </div>
    </div>
  );
};

export default PerkDetails;
