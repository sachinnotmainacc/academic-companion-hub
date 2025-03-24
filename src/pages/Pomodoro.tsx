
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Settings, Maximize, Volume2, VolumeX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  cycles: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

interface Stats {
  completedPomodoros: number;
  totalStudyTime: number;
  totalBreakTime: number;
}

const DEFAULT_SETTINGS: TimerSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  cycles: 4,
  autoStartBreaks: true,
  autoStartPomodoros: true,
};

const Pomodoro = () => {
  const { toast } = useToast();
  
  // Timer state
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [activeTimer, setActiveTimer] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // YouTube embed state
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  
  // Stats
  const [stats, setStats] = useState<Stats>({
    completedPomodoros: 0,
    totalStudyTime: 0,
    totalBreakTime: 0,
  });
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/alarm.mp3");
    audioRef.current.volume = 0.7;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Update timer when settings or active timer change
  useEffect(() => {
    resetTimer();
  }, [settings, activeTimer]);
  
  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);
  
  // Handle timer completion
  const handleTimerComplete = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Play sound if not muted
    if (!isMuted && audioRef.current) {
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    }
    
    // Show notification
    toast({
      title: `${activeTimer === 'pomodoro' ? 'Work session' : 'Break'} completed!`,
      description: `Time to ${activeTimer === 'pomodoro' ? 'take a break' : 'focus'}!`,
    });
    
    // Update stats
    if (activeTimer === 'pomodoro') {
      setStats(prev => ({
        ...prev,
        completedPomodoros: prev.completedPomodoros + 1,
        totalStudyTime: prev.totalStudyTime + settings.pomodoro
      }));
    } else {
      setStats(prev => ({
        ...prev,
        totalBreakTime: prev.totalBreakTime + (activeTimer === 'shortBreak' ? settings.shortBreak : settings.longBreak)
      }));
    }
    
    // Auto transition to next timer
    if (activeTimer === 'pomodoro') {
      const isLongBreakDue = cycle % settings.cycles === 0;
      const nextTimer = isLongBreakDue ? 'longBreak' : 'shortBreak';
      
      setActiveTimer(nextTimer);
      setTimeLeft(settings[nextTimer] * 60);
      setIsRunning(settings.autoStartBreaks);
    } else {
      // If coming from a break, increment the cycle if it was a long break
      if (activeTimer === 'longBreak') {
        setCycle(prev => prev + 1);
      }
      
      setActiveTimer('pomodoro');
      setTimeLeft(settings.pomodoro * 60);
      setIsRunning(settings.autoStartPomodoros);
    }
  };
  
  // Reset the current timer
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const duration = settings[activeTimer];
    setTimeLeft(duration * 60);
    setIsRunning(false);
  };
  
  // Toggle timer state
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  
  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!fullscreenRef.current) return;
    
    if (!isFullscreen) {
      if (fullscreenRef.current.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Update fullscreen state based on document state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Process YouTube URL to get embed URL
  const processYoutubeUrl = () => {
    if (!youtubeUrl) return;
    
    try {
      const url = new URL(youtubeUrl);
      let videoId = "";
      
      if (url.hostname.includes("youtube.com")) {
        videoId = url.searchParams.get("v") || "";
      } else if (url.hostname.includes("youtu.be")) {
        videoId = url.pathname.substring(1);
      }
      
      if (videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
        toast({
          title: "YouTube video added",
          description: "The video has been added to your study session.",
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
        title: "Invalid URL",
        description: "Please enter a valid YouTube video URL.",
        variant: "destructive",
      });
    }
  };
  
  // Save settings
  const saveSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    setShowSettings(false);
    resetTimer();
    
    toast({
      title: "Settings saved",
      description: "Your timer settings have been updated.",
    });
  };
  
  // Render progress based on timer type
  const getProgressPercentage = () => {
    const total = settings[activeTimer] * 60;
    return ((total - timeLeft) / total) * 100;
  };
  
  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Timer Controls */}
            <div className="mb-8">
              <Tabs 
                defaultValue="pomodoro" 
                value={activeTimer}
                onValueChange={(value) => setActiveTimer(value as 'pomodoro' | 'shortBreak' | 'longBreak')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="pomodoro" className="text-lg">Pomodoro</TabsTrigger>
                  <TabsTrigger value="shortBreak" className="text-lg">Short Break</TabsTrigger>
                  <TabsTrigger value="longBreak" className="text-lg">Long Break</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pomodoro" className="mt-0">
                  <div 
                    ref={fullscreenRef}
                    className={cn(
                      "flex flex-col items-center justify-center p-8 rounded-lg transition-all duration-300",
                      isFullscreen ? "h-screen bg-dark-950" : "h-96 bg-dark-900"
                    )}
                  >
                    <div className="mb-8 relative">
                      {isFullscreen ? (
                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[300px] h-[300px] rounded-full bg-blue-500/20 animate-pulse"></div>
                          </div>
                          <div className="text-8xl font-bold text-white z-10">
                            {formatTime(timeLeft)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-8xl font-bold text-white">
                          {formatTime(timeLeft)}
                        </div>
                      )}
                    </div>
                    
                    {!isFullscreen && (
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-12 w-12 rounded-full border-2"
                          onClick={resetTimer}
                        >
                          <RotateCcw className="h-5 w-5" />
                        </Button>
                        
                        <Button 
                          variant="default"
                          size="icon"
                          className="h-16 w-16 rounded-full bg-blue-500 hover:bg-blue-600"
                          onClick={toggleTimer}
                        >
                          {isRunning ? (
                            <Pause className="h-8 w-8" />
                          ) : (
                            <Play className="h-8 w-8 ml-1" />
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-12 w-12 rounded-full border-2"
                          onClick={toggleFullscreen}
                        >
                          <Maximize className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="shortBreak" className="mt-0">
                  <div 
                    ref={fullscreenRef}
                    className={cn(
                      "flex flex-col items-center justify-center p-8 rounded-lg transition-all duration-300",
                      isFullscreen ? "h-screen bg-dark-950" : "h-96 bg-dark-900"
                    )}
                  >
                    <div className="mb-8 relative">
                      {isFullscreen ? (
                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[300px] h-[300px] rounded-full bg-green-500/20 animate-pulse"></div>
                          </div>
                          <div className="text-8xl font-bold text-white z-10">
                            {formatTime(timeLeft)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-8xl font-bold text-white">
                          {formatTime(timeLeft)}
                        </div>
                      )}
                    </div>
                    
                    {!isFullscreen && (
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-12 w-12 rounded-full border-2"
                          onClick={resetTimer}
                        >
                          <RotateCcw className="h-5 w-5" />
                        </Button>
                        
                        <Button 
                          variant="default"
                          size="icon"
                          className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
                          onClick={toggleTimer}
                        >
                          {isRunning ? (
                            <Pause className="h-8 w-8" />
                          ) : (
                            <Play className="h-8 w-8 ml-1" />
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-12 w-12 rounded-full border-2"
                          onClick={toggleFullscreen}
                        >
                          <Maximize className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="longBreak" className="mt-0">
                  <div 
                    ref={fullscreenRef}
                    className={cn(
                      "flex flex-col items-center justify-center p-8 rounded-lg transition-all duration-300",
                      isFullscreen ? "h-screen bg-dark-950" : "h-96 bg-dark-900"
                    )}
                  >
                    <div className="mb-8 relative">
                      {isFullscreen ? (
                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[300px] h-[300px] rounded-full bg-purple-500/20 animate-pulse"></div>
                          </div>
                          <div className="text-8xl font-bold text-white z-10">
                            {formatTime(timeLeft)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-8xl font-bold text-white">
                          {formatTime(timeLeft)}
                        </div>
                      )}
                    </div>
                    
                    {!isFullscreen && (
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-12 w-12 rounded-full border-2"
                          onClick={resetTimer}
                        >
                          <RotateCcw className="h-5 w-5" />
                        </Button>
                        
                        <Button 
                          variant="default"
                          size="icon"
                          className="h-16 w-16 rounded-full bg-purple-500 hover:bg-purple-600"
                          onClick={toggleTimer}
                        >
                          {isRunning ? (
                            <Pause className="h-8 w-8" />
                          ) : (
                            <Play className="h-8 w-8 ml-1" />
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-12 w-12 rounded-full border-2"
                          onClick={toggleFullscreen}
                        >
                          <Maximize className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Control Buttons */}
            <div className="flex justify-center gap-4 mb-12">
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-dark-900 border-dark-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Timer Settings</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="pomodoro">Pomodoro</Label>
                        <Input
                          id="pomodoro"
                          type="number"
                          min="1"
                          max="60"
                          className="bg-dark-800 border-dark-700"
                          value={settings.pomodoro}
                          onChange={(e) => setSettings({...settings, pomodoro: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shortBreak">Short Break</Label>
                        <Input
                          id="shortBreak"
                          type="number"
                          min="1"
                          max="30"
                          className="bg-dark-800 border-dark-700"
                          value={settings.shortBreak}
                          onChange={(e) => setSettings({...settings, shortBreak: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="longBreak">Long Break</Label>
                        <Input
                          id="longBreak"
                          type="number"
                          min="1"
                          max="60"
                          className="bg-dark-800 border-dark-700"
                          value={settings.longBreak}
                          onChange={(e) => setSettings({...settings, longBreak: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cycles">Cycles before Long Break</Label>
                      <Input
                        id="cycles"
                        type="number"
                        min="1"
                        max="10"
                        className="bg-dark-800 border-dark-700"
                        value={settings.cycles}
                        onChange={(e) => setSettings({...settings, cycles: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      className="bg-blue-500 hover:bg-blue-600" 
                      onClick={() => saveSettings(settings)}
                    >
                      Save Settings
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    Mute
                  </>
                )}
              </Button>
            </div>
            
            {/* YouTube Embed and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card className="bg-dark-900 border-dark-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Add YouTube Video</h3>
                  
                  <div className="flex gap-2 mb-4">
                    <Input 
                      placeholder="Paste YouTube URL" 
                      className="bg-dark-800 border-dark-700"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <Button 
                      onClick={processYoutubeUrl}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {embedUrl && (
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube video player"
                      ></iframe>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-dark-900 border-dark-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Study Statistics</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 mb-1">Completed Pomodoros</p>
                      <p className="text-2xl font-bold">{stats.completedPomodoros}</p>
                    </div>
                    <Separator className="bg-dark-700" />
                    
                    <div>
                      <p className="text-gray-400 mb-1">Total Study Time</p>
                      <p className="text-2xl font-bold">{stats.totalStudyTime} minutes</p>
                    </div>
                    <Separator className="bg-dark-700" />
                    
                    <div>
                      <p className="text-gray-400 mb-1">Total Break Time</p>
                      <p className="text-2xl font-bold">{stats.totalBreakTime} minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pomodoro;
