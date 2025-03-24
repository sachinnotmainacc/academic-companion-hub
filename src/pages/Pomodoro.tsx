
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Coffee,
  Timer,
  Maximize,
  Minimize,
  Youtube,
  LineChart,
  Clock,
  Volume2,
  VolumeX
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Pomodoro = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("timer");

  // Timer State
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [timerMode, setTimerMode] = useState("work"); // work, shortBreak, longBreak
  const [currentSession, setCurrentSession] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [circleAnimation, setCircleAnimation] = useState(0); // 0-100 for circle progress
  const fullscreenRef = useRef(null);
  
  // Settings State
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4);
  const [autoStartBreaks, setAutoStartBreaks] = useState(true);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(true);
  const [playSound, setPlaySound] = useState(true);
  
  // YouTube State
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  
  // Stats State
  const [totalWorkTime, setTotalWorkTime] = useState(0); // seconds
  const [totalBreakTime, setTotalBreakTime] = useState(0); // seconds
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // Audio for timer completion
  const timerSound = useRef(new Audio("/timer-sound.mp3"));

  // Apply settings when they change
  useEffect(() => {
    if (!isRunning) {
      if (timerMode === "work") {
        setTimeLeft(workDuration * 60);
      } else if (timerMode === "shortBreak") {
        setTimeLeft(shortBreakDuration * 60);
      } else {
        setTimeLeft(longBreakDuration * 60);
      }
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, timerMode, isRunning]);

  // Set title based on timer
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const time = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    
    if (isRunning) {
      document.title = `${time} - ${timerMode === "work" ? "Work" : "Break"} | Pomodoro`;
    } else {
      document.title = "Pomodoro Timer";
    }

    return () => {
      document.title = "Academic Companion";
    };
  }, [timeLeft, isRunning, timerMode]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
        
        // Update circle animation
        const totalTime = 
          timerMode === "work" 
            ? workDuration * 60 
            : timerMode === "shortBreak" 
              ? shortBreakDuration * 60 
              : longBreakDuration * 60;
        
        const progress = ((totalTime - (timeLeft - 1)) / totalTime) * 100;
        setCircleAnimation(progress);
        
        // Update stats
        if (timerMode === "work") {
          setTotalWorkTime(prev => prev + 1);
        } else {
          setTotalBreakTime(prev => prev + 1);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer completed
      if (playSound) {
        timerSound.current.play().catch(err => console.log("Error playing sound:", err));
      }
      
      if (timerMode === "work") {
        setCompletedPomodoros(prev => prev + 1);
        
        // Determine next break type
        if (currentSession % sessionsUntilLongBreak === 0) {
          toast({ title: "Long break time!", description: "Good job! Take a longer break." });
          setTimerMode("longBreak");
          setTimeLeft(longBreakDuration * 60);
        } else {
          toast({ title: "Break time!", description: "Good job! Take a short break." });
          setTimerMode("shortBreak");
          setTimeLeft(shortBreakDuration * 60);
        }
        
        setIsRunning(autoStartBreaks);
      } else {
        // Break completed
        toast({ title: "Break completed!", description: "Time to get back to work!" });
        setTimerMode("work");
        setTimeLeft(workDuration * 60);
        setCurrentSession(prev => prev + 1);
        setIsRunning(autoStartPomodoros);
      }
      
      // Reset circle animation
      setCircleAnimation(0);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerMode, currentSession, sessionsUntilLongBreak, 
      autoStartBreaks, autoStartPomodoros, playSound, workDuration, 
      shortBreakDuration, longBreakDuration, toast]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format time as HH:MM:SS
  const formatLongTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle start/pause button
  const toggleTimer = () => {
    if (!isRunning && timeLeft === 0) {
      // If timer is completed, reset it first
      resetTimer();
    }
    
    if (!isRunning && !startTime) {
      setStartTime(new Date());
    }
    
    setIsRunning(!isRunning);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    
    if (timerMode === "work") {
      setTimeLeft(workDuration * 60);
    } else if (timerMode === "shortBreak") {
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
    
    setCircleAnimation(0);
  };

  // Switch timer mode
  const switchMode = (mode) => {
    setIsRunning(false);
    setTimerMode(mode);
    
    if (mode === "work") {
      setTimeLeft(workDuration * 60);
    } else if (mode === "shortBreak") {
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
    
    setCircleAnimation(0);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (fullscreenRef.current.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
      } else if (fullscreenRef.current.webkitRequestFullscreen) {
        fullscreenRef.current.webkitRequestFullscreen();
      } else if (fullscreenRef.current.msRequestFullscreen) {
        fullscreenRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Handle YouTube URL input
  const handleYoutubeSubmit = (e) => {
    e.preventDefault();
    
    if (!youtubeUrl.trim()) {
      toast({
        title: "Empty URL",
        description: "Please enter a YouTube URL",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Extract video ID from various YouTube URL formats
      const url = new URL(youtubeUrl);
      let videoId = "";
      
      if (url.hostname.includes("youtube.com")) {
        if (url.searchParams.get("v")) {
          videoId = url.searchParams.get("v");
        }
      } else if (url.hostname.includes("youtu.be")) {
        videoId = url.pathname.slice(1);
      }
      
      if (videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1`);
        toast({
          title: "Video Loaded",
          description: "YouTube video is now playing"
        });
      } else {
        throw new Error("Invalid YouTube URL format");
      }
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    setPlaySound(!playSound);
    toast({
      title: `Sound ${!playSound ? "Enabled" : "Disabled"}`,
      description: `Timer completion sound is now ${!playSound ? "enabled" : "disabled"}`
    });
  };

  // Get background color based on timer mode
  const getBackgroundColor = () => {
    if (timerMode === "work") {
      return "bg-blue-500";
    } else if (timerMode === "shortBreak") {
      return "bg-green-500";
    } else {
      return "bg-purple-500";
    }
  };

  // Get background gradient based on timer mode
  const getBackgroundGradient = () => {
    if (timerMode === "work") {
      return "bg-gradient-to-br from-blue-400 to-blue-600";
    } else if (timerMode === "shortBreak") {
      return "bg-gradient-to-br from-green-400 to-green-600";
    } else {
      return "bg-gradient-to-br from-purple-400 to-purple-600";
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pomodoro <span className="text-blue-500">Timer</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Stay focused and productive with timed work sessions and breaks
            </p>
          </div>
          
          {/* Fullscreen Timer Reference */}
          <div ref={fullscreenRef} className="w-full h-full">
            {isFullscreen ? (
              <div className="w-full h-screen flex items-center justify-center bg-dark-950 relative">
                <div className="absolute top-4 right-4 z-10">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleFullscreen}
                    className="bg-dark-900/50 border-dark-800 text-white hover:bg-dark-800/80"
                  >
                    <Minimize className="h-6 w-6" />
                  </Button>
                </div>
                
                <div className="relative flex items-center justify-center">
                  {/* Animated background circle */}
                  <div className={`absolute w-[380px] h-[380px] rounded-full ${getBackgroundGradient()} opacity-10 animate-pulse`}></div>
                  
                  {/* Progress circle */}
                  <svg className="absolute w-[350px] h-[350px] -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="rgba(255,255,255,0.1)" 
                      strokeWidth="6"
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke={timerMode === "work" ? "#3b82f6" : timerMode === "shortBreak" ? "#10b981" : "#8b5cf6"} 
                      strokeWidth="6"
                      strokeDasharray="282.7"
                      strokeDashoffset={282.7 - (282.7 * circleAnimation / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  
                  {/* Large timer text */}
                  <div className="text-center z-10">
                    <h1 className="text-[120px] font-bold font-mono tracking-tight text-white">
                      {formatTime(timeLeft)}
                    </h1>
                    <div className="flex justify-center space-x-4 mt-6">
                      <Button 
                        size="lg"
                        variant="outline"
                        className={`rounded-full w-16 h-16 ${
                          isRunning ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        } border-0`}
                        onClick={toggleTimer}
                      >
                        {isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline"
                        className="rounded-full w-16 h-16 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0"
                        onClick={resetTimer}
                      >
                        <RotateCcw className="h-8 w-8" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="timer" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-8 w-full max-w-xl mx-auto">
                  <TabsTrigger value="timer" onClick={() => setActiveTab("timer")}>
                    <Timer className="h-4 w-4 mr-2" />
                    Timer
                  </TabsTrigger>
                  <TabsTrigger value="settings" onClick={() => setActiveTab("settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="stats" onClick={() => setActiveTab("stats")}>
                    <LineChart className="h-4 w-4 mr-2" />
                    Stats
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="timer" className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="flex space-x-2 mb-6">
                      <Button
                        variant={timerMode === "work" ? "default" : "outline"}
                        className={timerMode === "work" ? "bg-blue-500 hover:bg-blue-600" : ""}
                        onClick={() => switchMode("work")}
                      >
                        Focus
                      </Button>
                      <Button
                        variant={timerMode === "shortBreak" ? "default" : "outline"}
                        className={timerMode === "shortBreak" ? "bg-green-500 hover:bg-green-600" : ""}
                        onClick={() => switchMode("shortBreak")}
                      >
                        Short Break
                      </Button>
                      <Button
                        variant={timerMode === "longBreak" ? "default" : "outline"}
                        className={timerMode === "longBreak" ? "bg-purple-500 hover:bg-purple-600" : ""}
                        onClick={() => switchMode("longBreak")}
                      >
                        Long Break
                      </Button>
                    </div>
                    
                    <div className="relative flex items-center justify-center mb-8">
                      {/* Animated background circle */}
                      <div className={`absolute w-[280px] h-[280px] rounded-full ${getBackgroundGradient()} opacity-10 animate-pulse`}></div>
                      
                      {/* Progress circle */}
                      <svg className="absolute w-[250px] h-[250px] -rotate-90" viewBox="0 0 100 100">
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="none" 
                          stroke="rgba(255,255,255,0.1)" 
                          strokeWidth="6"
                        />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="none" 
                          stroke={timerMode === "work" ? "#3b82f6" : timerMode === "shortBreak" ? "#10b981" : "#8b5cf6"} 
                          strokeWidth="6"
                          strokeDasharray="282.7"
                          strokeDashoffset={282.7 - (282.7 * circleAnimation / 100)}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-linear"
                        />
                      </svg>
                      
                      {/* Timer text */}
                      <div className="text-center z-10">
                        <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tight text-white">
                          {formatTime(timeLeft)}
                        </h1>
                        <p className="text-gray-400 mt-2">
                          Session {currentSession} • {timerMode === "work" ? "Focus" : timerMode === "shortBreak" ? "Short Break" : "Long Break"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                      <Button 
                        size="lg"
                        className={`rounded-full ${
                          isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                        }`}
                        onClick={toggleTimer}
                      >
                        {isRunning ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                        {isRunning ? "Pause" : "Start"}
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline" 
                        className="border-gray-600 text-gray-400 hover:text-gray-300 rounded-full"
                        onClick={resetTimer}
                      >
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Reset
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline" 
                        className="border-gray-600 text-gray-400 hover:text-gray-300 rounded-full"
                        onClick={toggleFullscreen}
                      >
                        <Maximize className="h-5 w-5 mr-2" />
                        Fullscreen
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline" 
                        className={`border-gray-600 rounded-full ${playSound ? "text-blue-400" : "text-gray-400"}`}
                        onClick={toggleAudio}
                      >
                        {playSound ? <Volume2 className="h-5 w-5 mr-2" /> : <VolumeX className="h-5 w-5 mr-2" />}
                        Sound
                      </Button>
                    </div>
                  </div>
                  
                  {/* YouTube player */}
                  <Card className="glass-card border-dark-800 overflow-hidden">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle className="flex items-center">
                        <Youtube className="text-red-500 mr-2 h-5 w-5" />
                        Study Music
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleYoutubeSubmit} className="flex mb-4">
                        <Input
                          placeholder="Enter YouTube URL"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          className="bg-dark-800 border-dark-700 text-white"
                        />
                        <Button type="submit" className="ml-2 bg-red-500 hover:bg-red-600">Play</Button>
                      </form>
                      
                      {embedUrl ? (
                        <div className="aspect-video w-full rounded-md overflow-hidden">
                          <iframe
                            width="100%"
                            height="100%"
                            src={embedUrl}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <div className="aspect-video w-full rounded-md bg-dark-800 flex items-center justify-center border border-dashed border-dark-700">
                          <div className="text-center text-gray-500">
                            <Youtube className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Enter a YouTube URL to play study music</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-6">
                  <Card className="glass-card border-dark-800">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle>Timer Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label htmlFor="workDuration">Focus Duration: {workDuration} min</Label>
                          </div>
                          <Slider 
                            id="workDuration"
                            value={[workDuration]} 
                            min={5} 
                            max={60} 
                            step={5} 
                            onValueChange={(value) => setWorkDuration(value[0])} 
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label htmlFor="shortBreakDuration">Short Break Duration: {shortBreakDuration} min</Label>
                          </div>
                          <Slider 
                            id="shortBreakDuration"
                            value={[shortBreakDuration]} 
                            min={1} 
                            max={15} 
                            step={1} 
                            onValueChange={(value) => setShortBreakDuration(value[0])} 
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label htmlFor="longBreakDuration">Long Break Duration: {longBreakDuration} min</Label>
                          </div>
                          <Slider 
                            id="longBreakDuration"
                            value={[longBreakDuration]} 
                            min={5} 
                            max={30} 
                            step={5} 
                            onValueChange={(value) => setLongBreakDuration(value[0])} 
                          />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label htmlFor="sessionsUntilLongBreak">Sessions Until Long Break: {sessionsUntilLongBreak}</Label>
                          </div>
                          <Slider 
                            id="sessionsUntilLongBreak"
                            value={[sessionsUntilLongBreak]} 
                            min={2} 
                            max={6} 
                            step={1} 
                            onValueChange={(value) => setSessionsUntilLongBreak(value[0])} 
                          />
                        </div>
                        
                        <Separator className="my-4 bg-dark-800" />
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="autoStartBreaks" className="cursor-pointer">Auto-start Breaks</Label>
                            <Switch 
                              id="autoStartBreaks" 
                              checked={autoStartBreaks} 
                              onCheckedChange={setAutoStartBreaks} 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="autoStartPomodoros" className="cursor-pointer">Auto-start Work Sessions</Label>
                            <Switch 
                              id="autoStartPomodoros" 
                              checked={autoStartPomodoros} 
                              onCheckedChange={setAutoStartPomodoros} 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="playSound" className="cursor-pointer">Play Sound on Completion</Label>
                            <Switch 
                              id="playSound" 
                              checked={playSound} 
                              onCheckedChange={setPlaySound} 
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="stats" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="glass-card border-dark-800">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center">
                          <Clock className="h-10 w-10 text-blue-400 mb-2" />
                          <p className="text-sm text-gray-400">Total Focus Time</p>
                          <h3 className="text-2xl font-bold text-white">{formatLongTime(totalWorkTime)}</h3>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="glass-card border-dark-800">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center">
                          <Coffee className="h-10 w-10 text-green-400 mb-2" />
                          <p className="text-sm text-gray-400">Total Break Time</p>
                          <h3 className="text-2xl font-bold text-white">{formatLongTime(totalBreakTime)}</h3>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="glass-card border-dark-800">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center">
                          <Badge className="mb-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 h-10 px-4 flex items-center text-lg">
                            {completedPomodoros}
                          </Badge>
                          <p className="text-sm text-gray-400">Completed Pomodoros</p>
                          <h3 className="text-lg font-medium text-white mt-1">
                            {Math.floor(totalWorkTime / 60)} minutes
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="glass-card border-dark-800">
                    <CardHeader className="bg-dark-900 border-b border-dark-800">
                      <CardTitle>Current Session</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400">Session Progress</p>
                          <div className="text-lg font-medium text-white">
                            {currentSession} / {sessionsUntilLongBreak} until long break
                          </div>
                          <div className="w-full bg-dark-800 rounded-full h-2.5 mt-2">
                            <div 
                              className="bg-blue-500 h-2.5 rounded-full" 
                              style={{ width: `${(currentSession / sessionsUntilLongBreak) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {startTime && (
                          <div>
                            <p className="text-sm text-gray-400">Started At</p>
                            <div className="text-lg font-medium text-white">
                              {startTime.toLocaleTimeString()}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm text-gray-400">Current Mode</p>
                          <div className="text-lg font-medium text-white flex items-center">
                            <Badge 
                              className={`mr-2 ${
                                timerMode === "work" 
                                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30" 
                                  : timerMode === "shortBreak" 
                                    ? "bg-green-500/20 text-green-400 border-green-500/30" 
                                    : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              }`}
                            >
                              {timerMode === "work" ? "Focus" : timerMode === "shortBreak" ? "Short Break" : "Long Break"}
                            </Badge>
                            {isRunning ? "Running" : "Paused"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pomodoro;
