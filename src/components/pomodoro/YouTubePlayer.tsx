
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface YouTubePlayerProps {
  className?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ className }) => {
  const [url, setUrl] = useState<string>('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const playerRef = useRef<YT.Player | null>(null);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        setPlayerReady(true);
      };
    } else {
      setPlayerReady(true);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Initialize or update player when videoId changes
  useEffect(() => {
    if (!playerReady || !videoId) return;

    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      const newPlayer = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            event.target.pauseVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          },
          onError: () => {
            toast.error("Error playing this video");
            setVideoId(null);
            setUrl('');
          }
        }
      });
    }
  }, [playerReady, videoId]);

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
      toast.success("YouTube audio loaded");
    } else {
      toast.error("Invalid YouTube URL");
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const skipForward = () => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + 10, true);
  };

  const skipBackward = () => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(Math.max(0, currentTime - 10), true);
  };

  return (
    <div className={`rounded-xl overflow-hidden bg-dark-900/80 backdrop-blur-md border border-dark-800 p-4 ${className}`}>
      <h3 className="text-white text-lg font-medium mb-3">Background Music</h3>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input
          value={url}
          onChange={handleUrlChange}
          placeholder="Paste YouTube URL..."
          className="bg-dark-800 border-dark-700 flex-1"
        />
        <Button type="submit" variant="secondary" className="shrink-0">
          Load
        </Button>
      </form>
      
      {videoId && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={skipBackward}
              className="text-gray-400 hover:text-white"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={togglePlay}
              className={isPlaying ? "text-green-500 hover:text-green-400" : "text-gray-400 hover:text-white"}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={skipForward}
              className="text-gray-400 hover:text-white"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMute}
            className={isMuted ? "text-red-500 hover:text-red-400" : "text-gray-400 hover:text-white"}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>
      )}
      
      <div id="youtube-player" className="hidden"></div>
    </div>
  );
};

export default YouTubePlayer;
