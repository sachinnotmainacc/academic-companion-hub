
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Minimize,
  Youtube
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Define types for settings and stats
type PomodoroSettings = {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
};

type PomodoroStats = {
  totalWorkTime: number;
  totalBreakTime: number;
  completedSessions: number;
};

const Pomodoro = () => {
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break" | "longBreak">("work");
  const [currentSession, setCurrentSession] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  
  // Stats
  const [stats, setStats] = useState<PomodoroStats>({
    totalWorkTime: 0,
    totalBreakTime: 0,
    completedSessions: 0,
  });
  
  // Settings
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  });

  const timerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Initialize timer based on current mode
  useEffect(() => {
    const durationMap = {
      work: settings.workDuration * 60,
      break: settings.breakDuration * 60,
      longBreak: settings.longBreakDuration * 60,
    };

    setTimeLeft(durationMap[mode]);
  }, [mode, settings]);

  // Timer effect
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer completed
            clearInterval(intervalRef.current!);
            handleTimerComplete();
            return 0;
          }
          
          // Update stats
          if (mode === "work") {
            setStats(prev => ({
              ...prev,
              totalWorkTime: prev.totalWorkTime + 1
            }));
          } else {
            setStats(prev => ({
              ...prev,
              totalBreakTime: prev.totalBreakTime + 1
            }));
          }
          
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, mode]);

  // Handle timer completion
  const handleTimerComplete = () => {
    setIsActive(false);
    
    // Update stats and cycle through modes
    if (mode === "work") {
      setStats(prev => ({
        ...prev,
        completedSessions: prev.completedSessions + 1
      }));
      
      // Determine if it's time for a long break
      if (currentSession % settings.sessionsBeforeLongBreak === 0) {
        setMode("longBreak");
        toast({
          title: "Long Break Time!",
          description: `Take a ${settings.longBreakDuration} minute break.`,
        });
      } else {
        setMode("break");
        toast({
          title: "Break Time!",
          description: `Take a ${settings.breakDuration} minute break.`,
        });
      }
      
      setCurrentSession(prev => prev + 1);
    } else {
      setMode("work");
      toast({
        title: "Work Time!",
        description: `Focus for ${settings.workDuration} minutes.`,
      });
    }
  };

  // Toggle timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const durationMap = {
      work: settings.workDuration * 60,
      break: settings.breakDuration * 60,
      longBreak: settings.longBreakDuration * 60,
    };
    
    setTimeLeft(durationMap[mode]);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Format total time for stats (hours, minutes, seconds)
  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  // Handle YouTube URL input
  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Extract video ID from different YouTube URL formats
      let videoId = "";
      
      if (youtubeUrl.includes("youtube.com/watch")) {
        const url = new URL(youtubeUrl);
        videoId = url.searchParams.get("v") || "";
      } else if (youtubeUrl.includes("youtu.be")) {
        videoId = youtubeUrl.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (youtubeUrl.includes("youtube.com/embed")) {
        videoId = youtubeUrl.split("youtube.com/embed/")[1]?.split("?")[0] || "";
      }
      
      if (videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
        toast({
          title: "YouTube Video Added",
          description: "Your video is now playing.",
        });
      } else {
        toast({
          title: "Invalid YouTube URL",
          description: "Please enter a valid YouTube video URL.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error Processing URL",
        description: "Please enter a valid YouTube video URL.",
        variant: "destructive",
      });
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (timerRef.current?.requestFullscreen) {
        timerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
    
    // Listen for fullscreen change
    document.addEventListener('fullscreenchange', () => {
      setIsFullscreen(!!document.fullscreenElement);
    });
  };

  // Progress percentage for the timer circle
  const progressPercentage = (() => {
    const durationMap = {
      work: settings.workDuration * 60,
      break: settings.breakDuration * 60,
      longBreak: settings.longBreakDuration * 60,
    };
    
    const totalDuration = durationMap[mode];
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  })();

  // Color based on current mode
  const modeColor = {
    work: "from-red-500 to-orange-500",
    break: "from-green-500 to-teal-500",
    longBreak: "from-blue-500 to-indigo-500",
  }[mode];

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <Navbar />
      
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Pomodoro Timer</h1>
        
        <div className="flex flex-col items-center justify-center mb-8">
          {/* Timer Circle */}
          <div 
            ref={timerRef}
            className="relative flex items-center justify-center w-64 h-64 mb-6"
          >
            {/* Background circle */}
            <div className="absolute inset-0 rounded-full bg-dark-800 shadow-lg"></div>
            
            {/* Progress circle with gradient and animation */}
            <div 
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${modeColor} shadow-lg`}
              style={{
                background: `conic-gradient(currentColor ${progressPercentage}%, transparent 0%)`,
                clipPath: 'circle(50%)',
                transition: 'all 1s ease-in-out',
              }}
            ></div>
            
            {/* Pulsing animation behind the time */}
            <div className={`absolute inset-4 rounded-full bg-gradient-to-br ${modeColor} opacity-30 animate-ping`} 
                 style={{animationDuration: '3s'}}></div>
            
            {/* Inner circle with time */}
            <div className="absolute inset-4 rounded-full bg-dark-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
                <div className="text-sm text-gray-400 mt-2 capitalize">{mode.replace(/([A-Z])/g, ' $1')}</div>
              </div>
            </div>
          </div>
          
          {/* Timer Controls */}
          <div className="flex space-x-4 mb-6">
            <Button 
              onClick={toggleTimer}
              variant="outline"
              className="w-12 h-12 rounded-full"
            >
              {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button 
              onClick={resetTimer}
              variant="outline"
              className="w-12 h-12 rounded-full"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="w-12 h-12 rounded-full"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pomodoro Settings</DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="workDuration">Work Duration (minutes)</Label>
                    <Input
                      id="workDuration"
                      type="number"
                      min="1"
                      max="120"
                      value={settings.workDuration}
                      onChange={(e) => setSettings({...settings, workDuration: parseInt(e.target.value) || 25})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                    <Input
                      id="breakDuration"
                      type="number"
                      min="1"
                      max="60"
                      value={settings.breakDuration}
                      onChange={(e) => setSettings({...settings, breakDuration: parseInt(e.target.value) || 5})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="longBreakDuration">Long Break Duration (minutes)</Label>
                    <Input
                      id="longBreakDuration"
                      type="number"
                      min="1"
                      max="120"
                      value={settings.longBreakDuration}
                      onChange={(e) => setSettings({...settings, longBreakDuration: parseInt(e.target.value) || 15})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="sessionsBeforeLongBreak">Sessions Before Long Break</Label>
                    <Input
                      id="sessionsBeforeLongBreak"
                      type="number"
                      min="1"
                      max="10"
                      value={settings.sessionsBeforeLongBreak}
                      onChange={(e) => setSettings({...settings, sessionsBeforeLongBreak: parseInt(e.target.value) || 4})}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={toggleFullscreen}
              variant="outline"
              className="w-12 h-12 rounded-full"
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* YouTube and Stats Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* YouTube Embed */}
          <div className="bg-dark-800 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Youtube className="mr-2 h-5 w-5" /> Study Music
            </h3>
            
            <form onSubmit={handleYoutubeSubmit} className="mb-4">
              <div className="flex space-x-2">
                <Input
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Enter YouTube URL"
                  className="flex-1"
                />
                <Button type="submit">Play</Button>
              </div>
            </form>
            
            {embedUrl && (
              <div className="aspect-video bg-dark-900 rounded">
                <iframe
                  src={embedUrl}
                  title="YouTube video player"
                  className="w-full h-full rounded"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="bg-dark-800 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-4">Your Study Stats</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Study Time:</span>
                <span className="font-semibold">{formatTotalTime(stats.totalWorkTime)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Total Break Time:</span>
                <span className="font-semibold">{formatTotalTime(stats.totalBreakTime)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Completed Sessions:</span>
                <span className="font-semibold">{stats.completedSessions}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Current Session:</span>
                <span className="font-semibold">{currentSession}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pomodoro;
