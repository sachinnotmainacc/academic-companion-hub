
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, RotateCcw, Music, Volume2, VolumeX } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FullscreenPomodoroProps {
  isOpen: boolean;
  onClose: () => void;
  timeLeft: number;
  isActive: boolean;
  mode: 'pomodoro' | 'shortBreak' | 'longBreak';
  onToggleTimer: () => void;
  onResetTimer: () => void;
  calculateProgress: () => number;
  formatTime: (seconds: number) => string;
  // YouTube player props
  youtubeVideoId?: string | null;
  isYoutubePlaying?: boolean;
  isYoutubeMuted?: boolean;
  youtubeVolume?: number;
  onLoadYoutubeVideo: (url: string) => void;
  onToggleYoutubePlay: () => void;
  onToggleYoutubeMute: () => void;
  onYoutubeVolumeChange: (volume: number) => void;
}

const FullscreenPomodoro: React.FC<FullscreenPomodoroProps> = ({
  isOpen,
  onClose,
  timeLeft,
  isActive,
  mode,
  onToggleTimer,
  onResetTimer,
  calculateProgress,
  formatTime,
  youtubeVideoId,
  isYoutubePlaying = false,
  isYoutubeMuted = false,
  youtubeVolume = 100,
  onLoadYoutubeVideo,
  onToggleYoutubePlay,
  onToggleYoutubeMute,
  onYoutubeVolumeChange
}) => {
  const [showMusicControl, setShowMusicControl] = useState(false);
  const [musicUrl, setMusicUrl] = useState('');

  if (!isOpen) return null;

  const getModeTitle = () => {
    switch (mode) {
      case 'pomodoro':
        return 'Focus Session';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };

  const handleLoadMusic = (e: React.FormEvent) => {
    e.preventDefault();
    if (musicUrl.trim()) {
      onLoadYoutubeVideo(musicUrl);
      setMusicUrl('');
      setShowMusicControl(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-zinc-800/50 rounded-xl z-10"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Minimalist Music Control */}
      <div className="absolute top-4 left-4 z-10">
        {!showMusicControl ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-zinc-800/50 rounded-xl"
              onClick={() => setShowMusicControl(true)}
            >
              <Music className="h-5 w-5" />
            </Button>
            {youtubeVideoId && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-zinc-800/50 rounded-xl"
                  onClick={onToggleYoutubePlay}
                >
                  {isYoutubePlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-zinc-800/50 rounded-xl"
                  onClick={onToggleYoutubeMute}
                >
                  {isYoutubeMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={youtubeVolume}
                    onChange={(e) => onYoutubeVolumeChange(Number(e.target.value))}
                    className="w-16 h-1 bg-zinc-700 rounded-lg appearance-none slider-thumb"
                    style={{
                      background: `linear-gradient(to right, #ffffff 0%, #ffffff ${youtubeVolume}%, #4a5568 ${youtubeVolume}%, #4a5568 100%)`
                    }}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleLoadMusic} className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm rounded-xl p-3">
            <Input
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
              placeholder="YouTube URL..."
              className="w-64 bg-zinc-800 border-zinc-700 text-white text-sm"
              autoFocus
            />
            <Button type="submit" size="sm" variant="secondary">
              Load
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowMusicControl(false)}
              className="text-white hover:bg-zinc-800/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        )}
      </div>

      {/* Fullscreen Timer */}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">{getModeTitle()}</h2>
        
        {/* Circular Progress Timer */}
        <div className="relative mb-12">
          <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem] rounded-full relative">
            {/* Background circle */}
            <div className="absolute inset-0 rounded-full border-8 border-zinc-800/30"></div>
            
            {/* Progress circle */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-zinc-800/30"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - calculateProgress() / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={mode === 'pomodoro' ? '#ef4444' : mode === 'shortBreak' ? '#22c55e' : '#3b82f6'} />
                  <stop offset="100%" stopColor={mode === 'pomodoro' ? '#dc2626' : mode === 'shortBreak' ? '#16a34a' : '#2563eb'} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Time display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 font-mono tracking-tight">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xl text-zinc-400 font-medium">
                {isActive ? 'Active' : 'Paused'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex gap-6">
          <Button
            size="lg"
            className={`${isActive 
              ? 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/25' 
              : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25'
            } text-white px-12 py-6 text-xl font-semibold rounded-xl transition-all duration-300 hover:scale-105`}
            onClick={onToggleTimer}
          >
            {isActive ? <Pause className="mr-4 h-8 w-8" /> : <Play className="mr-4 h-8 w-8" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-700/80 px-10 py-6 text-xl font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            onClick={onResetTimer}
          >
            <RotateCcw className="mr-4 h-8 w-8" />
            Reset
          </Button>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
        }
        .slider-thumb::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default FullscreenPomodoro;
