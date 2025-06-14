
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, Clock, Coffee, RotateCcw, Settings, Target, Music, Droplets } from 'lucide-react';

const HowItWorksDialog = () => {
  const steps = [
    {
      number: 1,
      title: "Focus Time",
      description: "Set a 25-minute timer and focus on a single task until the timer rings.",
      icon: Clock,
      color: "bg-red-500"
    },
    {
      number: 2,
      title: "Short Break",
      description: "Take a short 5-minute break to relax and recharge.",
      icon: Coffee,
      color: "bg-green-500"
    },
    {
      number: 3,
      title: "Long Break",
      description: "After completing four pomodoros, take a longer 15-minute break.",
      icon: RotateCcw,
      color: "bg-blue-500"
    },
    {
      number: 4,
      title: "Customize",
      description: "Adjust timer settings to find what works best for your productivity.",
      icon: Settings,
      color: "bg-purple-500"
    }
  ];

  const tips = [
    {
      icon: Target,
      text: "Break down complex tasks into actionable items"
    },
    {
      icon: Music,
      text: "Use background music for better concentration"
    },
    {
      icon: Droplets,
      text: "Stay hydrated and take short walks during breaks"
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-zinc-600 bg-zinc-800/50 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-700/80 transition-all duration-300"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          How it works
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            How the Pomodoro Technique Works
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Steps */}
          <div className="grid gap-6">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50">
                <div className={`${step.color} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-lg`}>
                  {step.number}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className="h-5 w-5 text-zinc-400" />
                    <h3 className="font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="border-t border-zinc-700 pt-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-white to-zinc-400 rounded-full"></span>
              Productivity Tips
            </h4>
            <div className="space-y-3">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/20 border border-zinc-700/30">
                  <tip.icon className="h-4 w-4 text-white shrink-0" />
                  <span className="text-zinc-300 text-sm">{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksDialog;
