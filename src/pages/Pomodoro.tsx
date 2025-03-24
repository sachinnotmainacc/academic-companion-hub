import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Play, Pause, SkipForward, Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const Pomodoro = () => {
  // Timer states
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [cycles, setCycles] = useState(0);
  
  // Timer settings
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false);
  
  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  
  // UI states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pomodoroRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Progress calculation
  const getTotalSeconds = () => {
    switch (mode) {
      case "focus":
        return focusDuration * 60;
      case "shortBreak":
        return shortBreakDuration * 60;
      case "longBreak":
        return longBreakDuration * 60;
    }
  };
  
  const getRemainingSeconds = () => minutes * 60 + seconds;
  const getProgress = () => {
    const total = getTotalSeconds();
    const remaining = getRemainingSeconds();
    return ((total - remaining) / total) * 100;
  };
  
  // Timer logic
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive) {
      interval = window.setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval!);
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);
  
  // Handle timer completion
  const handleTimerComplete = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.play();
    }
    
    // Notify user
    toast({
      title: mode === "focus" ? "Focus time complete!" : "Break time complete!",
      description: mode === "focus" ? "Time to take a break!" : "Ready to focus again?",
    });
    
    // Cycle management
    if (mode === "focus") {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      
      if (newCycles % 4 === 0) {
        // After 4 focus sessions, take a long break
        setMode("longBreak");
        setMinutes(longBreakDuration);
        if (autoStartBreaks) setIsActive(true);
      } else {
        // Otherwise take a short break
        setMode("shortBreak");
        setMinutes(shortBreakDuration);
        if (autoStartBreaks) setIsActive(true);
      }
    } else {
      // After a break, return to focus mode
      setMode("focus");
      setMinutes(focusDuration);
      if (autoStartPomodoros) setIsActive(true);
    }
    
    setSeconds(0);
    if (!autoStartBreaks && !autoStartPomodoros) {
      setIsActive(false);
    }
  };
  
  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    
    switch (mode) {
      case "focus":
        setMinutes(focusDuration);
        break;
      case "shortBreak":
        setMinutes(shortBreakDuration);
        break;
      case "longBreak":
        setMinutes(longBreakDuration);
        break;
    }
    
    setSeconds(0);
  };
  
  // Skip to next timer
  const skipTimer = () => {
    if (mode === "focus") {
      if ((cycles + 1) % 4 === 0) {
        setMode("longBreak");
        setMinutes(longBreakDuration);
      } else {
        setMode("shortBreak");
        setMinutes(shortBreakDuration);
      }
    } else {
      setMode("focus");
      setMinutes(focusDuration);
    }
    
    setSeconds(0);
    setIsActive(false);
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (timerRef.current && timerRef.current.requestFullscreen) {
        timerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error('Error attempting to enable fullscreen:', err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error('Error attempting to exit fullscreen:', err));
      }
    }
  };
  
  // Handle document fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Timer mode colors
  const getModeColor = () => {
    switch (mode) {
      case "focus": return "from-blue-600 to-blue-400";
      case "shortBreak": return "from-green-600 to-green-400";
      case "longBreak": return "from-purple-600 to-purple-400";
    }
  };
  
  const getModeTextColor = () => {
    switch (mode) {
      case "focus": return "text-blue-500";
      case "shortBreak": return "text-green-500";
      case "longBreak": return "text-purple-500";
    }
  };
  
  const getModeBgColor = () => {
    switch (mode) {
      case "focus": return "bg-blue-500/10";
      case "shortBreak": return "bg-green-500/10";
      case "longBreak": return "bg-purple-500/10";
    }
  };
  
  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col">
      {!isFullscreen && <Navbar />}
      
      <main className={cn(
        "flex-grow flex flex-col items-center justify-center p-4",
        isFullscreen ? "pt-0" : "pt-24"
      )}>
        <div ref={pomodoroRef} className="w-full max-w-3xl mx-auto">
          {!isFullscreen && (
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Pomodoro <span className={getModeTextColor()}>Timer</span>
              </h1>
              <p className="text-gray-400">
                Stay focused and productive with the Pomodoro technique
              </p>
            </div>
          )}
          
          <div 
            ref={timerRef} 
            className={cn(
              "relative flex flex-col items-center justify-center",
              isFullscreen ? "h-screen" : ""
            )}
          >
            {/* Timer Circle */}
            <div className={cn(
              "relative flex items-center justify-center",
              isFullscreen ? "scale-150" : ""
            )}>
              {/* Animated Background Circle */}
              <div className={cn(
                "absolute w-64 h-64 md:w-80 md:h-80 rounded-full",
                getModeBgColor(),
                "flex items-center justify-center"
              )}>
                <div className={cn(
                  "w-60 h-60 md:w-76 md:h-76 rounded-full bg-dark-950",
                  "flex items-center justify-center"
                )} />
              </div>
              
              {/* Progress Circle */}
              <svg className="absolute w-64 h-64 md:w-80 md:h-80 transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="48%"
                  stroke={`url(#${mode}Gradient)`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="100"
                  strokeDashoffset={100 - getProgress()}
                  className="transition-all duration-1000 ease-linear"
                />
                <defs>
                  <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#60A5FA" />
                  </linearGradient>
                  <linearGradient id="shortBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22C55E" />
                    <stop offset="100%" stopColor="#4ADE80" />
                  </linearGradient>
                  <linearGradient id="longBreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Timer Display */}
              <div className="text-center z-10">
                <div className={cn(
                  "text-6xl md:text-7xl font-bold transition-colors",
                  getModeTextColor()
                )}>
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </div>
                {!isFullscreen && (
                  <div className="text-lg font-medium text-gray-300 mt-2">
                    {mode === "focus" ? "Focus Time" : mode === "shortBreak" ? "Short Break" : "Long Break"}
                  </div>
                )}
              </div>
            </div>
            
            {/* Timer Controls */}
            <div className={cn(
              "flex space-x-4 mt-8",
              isFullscreen ? "mt-16" : ""
            )}>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
                onClick={resetTimer}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              
              <Button
                variant="default"
                size="icon"
                className={cn(
                  "h-14 w-14 rounded-full ",
                  !isActive ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"
                )}
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button
                variant="outline"
                size="icon" 
                className="h-12 w-12 rounded-full border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
                onClick={skipTimer}
              >
                <SkipForward className="h-5 w-5 rotate-180" />
              </Button>
            </div>
            
            {/* Mode Selector - Only show if not fullscreen */}
            {!isFullscreen && (
              <div className="grid grid-cols-3 gap-2 w-full max-w-md mt-8">
                <Button
                  variant={mode === "focus" ? "default" : "outline"}
                  className={cn(
                    mode === "focus" ? "bg-blue-500 hover:bg-blue-600" : "border-gray-600 text-gray-400 hover:text-white"
                  )}
                  onClick={() => {
                    setMode("focus");
                    setMinutes(focusDuration);
                    setSeconds(0);
                    setIsActive(false);
                  }}
                >
                  Focus
                </Button>
                <Button
                  variant={mode === "shortBreak" ? "default" : "outline"}
                  className={cn(
                    mode === "shortBreak" ? "bg-green-500 hover:bg-green-600" : "border-gray-600 text-gray-400 hover:text-white"
                  )}
                  onClick={() => {
                    setMode("shortBreak");
                    setMinutes(shortBreakDuration);
                    setSeconds(0);
                    setIsActive(false);
                  }}
                >
                  Short Break
                </Button>
                <Button
                  variant={mode === "longBreak" ? "default" : "outline"}
                  className={cn(
                    mode === "longBreak" ? "bg-purple-500 hover:bg-purple-600" : "border-gray-600 text-gray-400 hover:text-white"
                  )}
                  onClick={() => {
                    setMode("longBreak");
                    setMinutes(longBreakDuration);
                    setSeconds(0);
                    setIsActive(false);
                  }}
                >
                  Long Break
                </Button>
              </div>
            )}
            
            {/* Fullscreen Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute bottom-4 right-4 text-gray-400 hover:text-white",
                isFullscreen ? "bottom-8 right-8" : ""
              )}
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
            </Button>
            
            {/* Volume Toggle - Only when in fullscreen */}
            {isFullscreen && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-8 left-8 text-gray-400 hover:text-white"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
              </Button>
            )}
          </div>
          
          {/* Settings - Only show if not fullscreen */}
          {!isFullscreen && (
            <div className="mt-12 bg-dark-900 rounded-lg p-6 border border-dark-800">
              <h2 className="text-xl font-bold mb-4">Timer Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Focus Duration: {focusDuration} minutes</label>
                  <Slider
                    value={[focusDuration]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(value) => {
                      setFocusDuration(value[0]);
                      if (mode === "focus" && !isActive) {
                        setMinutes(value[0]);
                      }
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Short Break Duration: {shortBreakDuration} minutes</label>
                  <Slider
                    value={[shortBreakDuration]}
                    min={1}
                    max={15}
                    step={1}
                    onValueChange={(value) => {
                      setShortBreakDuration(value[0]);
                      if (mode === "shortBreak" && !isActive) {
                        setMinutes(value[0]);
                      }
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Long Break Duration: {longBreakDuration} minutes</label>
                  <Slider
                    value={[longBreakDuration]}
                    min={5}
                    max={30}
                    step={5}
                    onValueChange={(value) => {
                      setLongBreakDuration(value[0]);
                      if (mode === "longBreak" && !isActive) {
                        setMinutes(value[0]);
                      }
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Sound Volume: {volume}%</label>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={10}
                    onValueChange={(value) => setVolume(value[0])}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <Button
                    variant={soundEnabled ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      soundEnabled ? "bg-blue-500 hover:bg-blue-600" : "border-gray-600 text-gray-400 hover:text-white"
                    )}
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? "Sound On" : "Sound Off"}
                  </Button>
                  
                  <Button
                    variant={autoStartBreaks ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      autoStartBreaks ? "bg-blue-500 hover:bg-blue-600" : "border-gray-600 text-gray-400 hover:text-white"
                    )}
                    onClick={() => setAutoStartBreaks(!autoStartBreaks)}
                  >
                    {autoStartBreaks ? "Auto-start Breaks" : "Manual Start Breaks"}
                  </Button>
                  
                  <Button
                    variant={autoStartPomodoros ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      autoStartPomodoros ? "bg-blue-500 hover:bg-blue-600" : "border-gray-600 text-gray-400 hover:text-white"
                    )}
                    onClick={() => setAutoStartPomodoros(!autoStartPomodoros)}
                  >
                    {autoStartPomodoros ? "Auto-start Focus" : "Manual Start Focus"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" />
      
      {!isFullscreen && <Footer />}
    </div>
  );
};

export default Pomodoro;
