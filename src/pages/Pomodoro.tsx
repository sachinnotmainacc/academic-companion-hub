
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Play, Pause, RotateCcw, Settings as SettingsIcon, 
  Maximize, Youtube as YoutubeIcon 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Local storage keys
const LS_WORK_TIME = "pomodoro_work_time";
const LS_BREAK_TIME = "pomodoro_break_time";
const LS_CYCLES = "pomodoro_cycles";
const LS_TOTAL_STUDY = "pomodoro_total_study";
const LS_TOTAL_BREAK = "pomodoro_total_break";

const Pomodoro = () => {
  const { toast } = useToast();
  
  // Timer settings
  const [workTime, setWorkTime] = useState(() => {
    return parseInt(localStorage.getItem(LS_WORK_TIME) || "25") || 25;
  });
  const [breakTime, setBreakTime] = useState(() => {
    return parseInt(localStorage.getItem(LS_BREAK_TIME) || "5") || 5;
  });
  const [cycles, setCycles] = useState(() => {
    return parseInt(localStorage.getItem(LS_CYCLES) || "4") || 4;
  });
  
  // Timer state
  const [minutes, setMinutes] = useState(workTime);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  
  // YouTube embedding
  const [youtubeLink, setYoutubeLink] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  
  // Stats
  const [totalStudyTime, setTotalStudyTime] = useState(() => {
    return parseInt(localStorage.getItem(LS_TOTAL_STUDY) || "0") || 0;
  });
  const [totalBreakTime, setTotalBreakTime] = useState(() => {
    return parseInt(localStorage.getItem(LS_TOTAL_BREAK) || "0") || 0;
  });
  
  // Refs
  const timerRef = useRef<number | null>(null);
  const studyTimeRef = useRef<number>(0);
  const breakTimeRef = useRef<number>(0);
  
  // Save settings to local storage
  useEffect(() => {
    localStorage.setItem(LS_WORK_TIME, workTime.toString());
    localStorage.setItem(LS_BREAK_TIME, breakTime.toString());
    localStorage.setItem(LS_CYCLES, cycles.toString());
  }, [workTime, breakTime, cycles]);
  
  // Save stats to local storage
  useEffect(() => {
    localStorage.setItem(LS_TOTAL_STUDY, totalStudyTime.toString());
    localStorage.setItem(LS_TOTAL_BREAK, totalBreakTime.toString());
  }, [totalStudyTime, totalBreakTime]);
  
  // Timer logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            if (isBreak) {
              // Break completed
              if (currentCycle >= cycles) {
                // All cycles completed
                resetTimer();
                setIsActive(false);
                toast({
                  title: "Pomodoro Completed!",
                  description: `You've completed all ${cycles} cycles. Great job!`,
                });
              } else {
                // Start next work session
                setCurrentCycle(prev => prev + 1);
                setIsBreak(false);
                setMinutes(workTime);
                setSeconds(0);
                
                // Update break time stats
                const elapsedBreakMins = breakTime;
                breakTimeRef.current += elapsedBreakMins;
                setTotalBreakTime(prev => prev + elapsedBreakMins);
                
                toast({
                  title: "Break Completed!",
                  description: "Back to work! Let's focus.",
                });
              }
            } else {
              // Work session completed
              setIsBreak(true);
              setMinutes(breakTime);
              setSeconds(0);
              
              // Update study time stats
              const elapsedStudyMins = workTime;
              studyTimeRef.current += elapsedStudyMins;
              setTotalStudyTime(prev => prev + elapsedStudyMins);
              
              toast({
                title: "Work Session Completed!",
                description: "Time for a break. Relax and recharge.",
              });
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, minutes, seconds, isBreak, currentCycle, cycles, workTime, breakTime, toast]);
  
  // Start/pause timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setCurrentCycle(1);
    setMinutes(workTime);
    setSeconds(0);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  // Save settings
  const saveSettings = (
    newWorkTime: number, 
    newBreakTime: number, 
    newCycles: number
  ) => {
    setWorkTime(newWorkTime);
    setBreakTime(newBreakTime);
    setCycles(newCycles);
    
    // Reset timer with new settings
    resetTimer();
  };
  
  // Format time
  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Make the page fullscreen
  const goFullScreen = () => {
    const elem = document.documentElement;
    
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        toast({
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        });
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  // Handle YouTube link submission
  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract video ID from various YouTube URL formats
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = youtubeLink.match(youtubeRegex);
    
    if (match && match[1]) {
      const videoId = match[1];
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
      toast({
        title: "YouTube Video Added",
        description: "Your video is now playing below.",
      });
    } else {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
    }
  };
  
  // Format time for display
  const formatTimeForDisplay = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  };
  
  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pomodoro <span className="text-blue-500">Timer</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Focus on your work with timed sessions and scheduled breaks
            </p>
          </div>
          
          <div className="mb-12">
            <Card className="glass-card border-dark-800 overflow-hidden animate-fade-in-up">
              <CardHeader className="bg-dark-900 border-b border-dark-800 flex flex-row items-center justify-between">
                <CardTitle className="text-white">
                  {isBreak ? "Break Time" : "Work Session"} - Cycle {currentCycle}/{cycles}
                </CardTitle>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="border-dark-700 text-gray-400 hover:text-white">
                        <SettingsIcon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-dark-900 border-dark-800">
                      <DialogHeader>
                        <DialogTitle className="text-white">Timer Settings</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label className="text-gray-400">Work Time (minutes)</Label>
                          <Input 
                            type="number" 
                            min="1" 
                            max="60"
                            className="bg-dark-800 border-dark-700 text-white"
                            defaultValue={workTime} 
                            onChange={(e) => setWorkTime(parseInt(e.target.value) || 25)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-400">Break Time (minutes)</Label>
                          <Input 
                            type="number" 
                            min="1" 
                            max="30"
                            className="bg-dark-800 border-dark-700 text-white"
                            defaultValue={breakTime} 
                            onChange={(e) => setBreakTime(parseInt(e.target.value) || 5)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-400">Number of Cycles</Label>
                          <Input 
                            type="number" 
                            min="1" 
                            max="10"
                            className="bg-dark-800 border-dark-700 text-white"
                            defaultValue={cycles} 
                            onChange={(e) => setCycles(parseInt(e.target.value) || 4)}
                          />
                        </div>
                        <Button 
                          className="w-full mt-2"
                          onClick={() => saveSettings(workTime, breakTime, cycles)}
                        >
                          Save Settings
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-dark-700 text-gray-400 hover:text-white"
                    onClick={goFullScreen}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center py-16 md:py-24">
                  <div className="mb-8">
                    <Badge className={`text-lg py-1 px-3 ${isBreak ? 'bg-blue-500' : 'bg-green-500'}`}>
                      {isBreak ? 'BREAK' : 'FOCUS'}
                    </Badge>
                  </div>
                  
                  <div className="text-7xl md:text-8xl font-bold text-white mb-10">
                    {formatTime(minutes, seconds)}
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button
                      className={`h-14 w-14 rounded-full ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      onClick={toggleTimer}
                    >
                      {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-14 w-14 rounded-full border-gray-600 text-gray-400 hover:text-white"
                      onClick={resetTimer}
                    >
                      <RotateCcw className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-12">
            <Card className="glass-card border-dark-800 overflow-hidden">
              <CardHeader className="bg-dark-900 border-b border-dark-800">
                <CardTitle className="text-white flex items-center">
                  <YoutubeIcon className="h-5 w-5 text-red-500 mr-2" />
                  Study Music
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                <form onSubmit={handleYoutubeSubmit} className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Paste YouTube URL here..."
                    className="bg-dark-800 border-dark-700 text-white"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                  />
                  <Button type="submit">Play</Button>
                </form>
                
                {embedUrl && (
                  <div className="aspect-video w-full rounded-md overflow-hidden">
                    <iframe
                      src={embedUrl}
                      title="YouTube video player"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="glass-card border-dark-800 overflow-hidden">
              <CardHeader className="bg-dark-900 border-b border-dark-800">
                <CardTitle className="text-white">Study Statistics</CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                    <div className="text-sm text-gray-400 mb-1">Total Study Time</div>
                    <div className="text-2xl font-medium text-white">
                      {formatTimeForDisplay(totalStudyTime)}
                    </div>
                  </div>
                  
                  <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                    <div className="text-sm text-gray-400 mb-1">Total Break Time</div>
                    <div className="text-2xl font-medium text-white">
                      {formatTimeForDisplay(totalBreakTime)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-gray-400 text-sm">
                  <p>Your focus stats are saved automatically in your browser.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pomodoro;
