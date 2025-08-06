import { useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoEmbedProps {
  videoUrl: string;
  title: string;
  className?: string;
}

export function VideoEmbed({ videoUrl, title, className = "" }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handlePlayPause = (videoElement: HTMLVideoElement) => {
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = (videoElement: HTMLVideoElement) => {
    videoElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      <video
        className="w-full h-auto"
        muted={isMuted}
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        poster="/api/placeholder/800/450"
      >
        <source src={videoUrl} type="video/quicktime" />
        <source src={videoUrl.replace('.mov', '.mp4')} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white/90 hover:bg-white text-black"
            onClick={(e) => {
              const video = e.currentTarget.closest('div')?.parentElement?.querySelector('video') as HTMLVideoElement;
              if (video) handlePlayPause(video);
            }}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white text-black"
            onClick={(e) => {
              const video = e.currentTarget.closest('div')?.parentElement?.querySelector('video') as HTMLVideoElement;
              if (video) handleMuteToggle(video);
            }}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Video Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <p className="text-white/80 text-sm">Experience Utah's natural beauty</p>
      </div>
    </div>
  );
}