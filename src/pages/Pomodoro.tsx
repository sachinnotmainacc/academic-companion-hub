
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, RotateCcw, Maximize, Volume2, Volume1, VolumeX, Settings } from "lucide-react";

const Pomodoro = () => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [activeMode, setActiveMode] = useState("pomodoro");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  
  // Timer durations in seconds
  const [timerDurations, setTimerDurations] = useState({
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  });
  
  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio("/alarm.mp3");
    audioRef.current.volume = volume / 100;
    
    // Set initial timer based on mode
    setTimeLeft(timerDurations[activeMode as keyof typeof timerDurations]);
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  useEffect(() => {
    // Reset timer when mode changes
    setTimeLeft(timerDurations[activeMode as keyof typeof timerDurations]);
    setIsPlaying(false);
  }, [activeMode, timerDurations]);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      // Timer finished, play sound
      playAlarm();
      
      // Show notification
      toast({
        title: `${activeMode === "pomodoro" ? "Work session" : "Break"} complete!`,
        description: `${activeMode === "pomodoro" ? "Time for a break!" : "Ready to get back to work?"}`,
      });
      
      // Stop the timer
      setIsPlaying(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeLeft, activeMode]);
  
  // Update audio volume when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);
  
  const togglePlayPause = () => {
    setIsPlaying(prevState => !prevState);
  };
  
  const resetTimer = () => {
    setIsPlaying(false);
    setTimeLeft(timerDurations[activeMode as keyof typeof timerDurations]);
  };
  
  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && fullscreenRef.current) {
      fullscreenRef.current.requestFullscreen().catch(err => {
        toast({
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        });
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSeconds = timerDurations[activeMode as keyof typeof timerDurations];
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };
  
  const progress = calculateProgress();
  
  return (
    <div className="min-h-screen bg-dark-950 text-white flex flex-col" ref={fullscreenRef}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Pomodoro <span className="text-blue-500">Timer</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Boost your productivity with focused work sessions
            </p>
          </div>
          
          <Card className="border-dark-800 overflow-hidden">
            <CardHeader className="bg-dark-900 border-b border-dark-700 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Timer</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 border-dark-700"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 text-gray-400" />
                    ) : volume > 50 ? (
                      <Volume2 className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Volume1 className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 border-dark-700"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="h-4 w-4 text-gray-400" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 border-dark-700"
                    onClick={toggleFullscreen}
                  >
                    <Maximize className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <Tabs defaultValue="pomodoro" value={activeMode} onValueChange={setActiveMode}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="pomodoro" className="data-[state=active]:bg-blue-500">
                    Pomodoro
                  </TabsTrigger>
                  <TabsTrigger value="shortBreak" className="data-[state=active]:bg-blue-500">
                    Short Break
                  </TabsTrigger>
                  <TabsTrigger value="longBreak" className="data-[state=active]:bg-blue-500">
                    Long Break
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pomodoro" className="mt-0">
                  <div className="flex flex-col items-center">
                    <div className="relative w-64 h-64 mb-6">
                      {/* Progress circle */}
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="transparent" 
                          stroke="#1e293b" 
                          strokeWidth="8" 
                        />
                        
                        {/* Progress circle */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="transparent" 
                          stroke="#3b82f6" 
                          strokeWidth="8" 
                          strokeLinecap="round" 
                          strokeDasharray="282.74"
                          strokeDashoffset={282.74 - (282.74 * progress) / 100}
                          transform="rotate(-90 50 50)"
                          className="transition-all duration-1000 ease-linear"
                        />
                        
                        {/* Text in the middle */}
                        <text 
                          x="50" 
                          y="50" 
                          textAnchor="middle" 
                          dominantBaseline="middle" 
                          className="text-white text-xl font-bold"
                          fontSize="16"
                          fill="white"
                        >
                          {formatTime(timeLeft)}
                        </text>
                      </svg>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button 
                        className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6`}
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-600 text-gray-400 hover:text-white"
                        onClick={resetTimer}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="shortBreak" className="mt-0">
                  <div className="flex flex-col items-center">
                    <div className="relative w-64 h-64 mb-6">
                      {/* Progress circle */}
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="transparent" 
                          stroke="#1e293b" 
                          strokeWidth="8" 
                        />
                        
                        {/* Progress circle */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="transparent" 
                          stroke="#3b82f6" 
                          strokeWidth="8" 
                          strokeLinecap="round" 
                          strokeDasharray="282.74"
                          strokeDashoffset={282.74 - (282.74 * progress) / 100}
                          transform="rotate(-90 50 50)"
                          className="transition-all duration-1000 ease-linear"
                        />
                        
                        {/* Text in the middle */}
                        <text 
                          x="50" 
                          y="50" 
                          textAnchor="middle" 
                          dominantBaseline="middle" 
                          className="text-white text-xl font-bold"
                          fontSize="16"
                          fill="white"
                        >
                          {formatTime(timeLeft)}
                        </text>
                      </svg>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button 
                        className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6`}
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-600 text-gray-400 hover:text-white"
                        onClick={resetTimer}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="longBreak" className="mt-0">
                  <div className="flex flex-col items-center">
                    <div className="relative w-64 h-64 mb-6">
                      {/* Progress circle */}
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="transparent" 
                          stroke="#1e293b" 
                          strokeWidth="8" 
                        />
                        
                        {/* Progress circle */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="transparent" 
                          stroke="#3b82f6" 
                          strokeWidth="8" 
                          strokeLinecap="round" 
                          strokeDasharray="282.74"
                          strokeDashoffset={282.74 - (282.74 * progress) / 100}
                          transform="rotate(-90 50 50)"
                          className="transition-all duration-1000 ease-linear"
                        />
                        
                        {/* Text in the middle */}
                        <text 
                          x="50" 
                          y="50" 
                          textAnchor="middle" 
                          dominantBaseline="middle" 
                          className="text-white text-xl font-bold"
                          fontSize="16"
                          fill="white"
                        >
                          {formatTime(timeLeft)}
                        </text>
                      </svg>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button 
                        className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6`}
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-600 text-gray-400 hover:text-white"
                        onClick={resetTimer}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {showSettings && (
                <div className="mt-6 p-4 bg-dark-900 rounded-lg border border-dark-700 animate-fade-in">
                  <h3 className="text-lg text-white font-medium mb-4">Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Volume</span>
                        <span className="text-gray-400">{volume}%</span>
                      </div>
                      <Slider
                        value={[volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(vals) => setVolume(vals[0])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <Card className="border-dark-800">
              <CardHeader className="bg-dark-900 border-b border-dark-700">
                <CardTitle className="text-white text-lg">How to use the Pomodoro Technique</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Set the timer for 25 minutes (Pomodoro session)</li>
                  <li>Work on your task until the timer rings</li>
                  <li>Take a short break (5 minutes)</li>
                  <li>After 4 Pomodoro sessions, take a longer break (15-30 minutes)</li>
                </ol>
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
