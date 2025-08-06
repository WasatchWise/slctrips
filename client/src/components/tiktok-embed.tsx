import { useEffect, useRef } from "react";

interface TikTokEmbedProps {
  videoId: string;
  className?: string;
}

export function TikTokEmbed({ videoId, className = "" }: TikTokEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load TikTok embed script if not already loaded
    if (!window.TikTokEmbedJS) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        window.TikTokEmbedJS = true;
        if (window.tiktokEmbed) {
          window.tiktokEmbed.lib.render();
        }
      };
    } else if (window.tiktokEmbed) {
      // Re-render if script already loaded
      window.tiktokEmbed.lib.render();
    }
  }, [videoId]);

  return (
    <div ref={embedRef} className={`tiktok-embed-container ${className}`}>
      {videoId === '7519024941371510071' ? (
        // Miller Park specific embed with full content
        <blockquote 
          className="tiktok-embed" 
          cite="https://www.tiktok.com/@slctrips/video/7519024941371510071" 
          data-video-id="7519024941371510071" 
          style={{ maxWidth: '605px', minWidth: '325px' }}
        >
          <section>
            <a target="_blank" title="@slctrips" href="https://www.tiktok.com/@slctrips?refer=embed">@slctrips</a>
            {' '}22 MINUTES!!! You'd never guess this hidden canyon is in the middle of Salt Lake City 👀🌿 Locals walk by every day and miss it. Would you hike it?{' '}
            <a title="SaltLakeCity" target="_blank" href="https://www.tiktok.com/tag/SaltLakeCity?refer=embed">#SaltLakeCity</a>{' '}
            <a title="HiddenGems" target="_blank" href="https://www.tiktok.com/tag/HiddenGems?refer=embed">#HiddenGems</a>{' '}
            <a title="MillerPark" target="_blank" href="https://www.tiktok.com/tag/MillerPark?refer=embed">#MillerPark</a>{' '}
            <a title="UtahHikes" target="_blank" href="https://www.tiktok.com/tag/UtahHikes?refer=embed">#UtahHikes</a>{' '}
            <a title="UrbanEscape" target="_blank" href="https://www.tiktok.com/tag/UrbanEscape?refer=embed">#UrbanEscape</a>{' '}
            <a title="SecretTrail" target="_blank" href="https://www.tiktok.com/tag/SecretTrail?refer=embed">#SecretTrail</a>{' '}
            <a title="NatureInTheCity" target="_blank" href="https://www.tiktok.com/tag/NatureInTheCity?refer=embed">#NatureInTheCity</a>{' '}
            <a title="SLCAdventures" target="_blank" href="https://www.tiktok.com/tag/SLCAdventures?refer=embed">#SLCAdventures</a>{' '}
            <a title="TikTokTravel" target="_blank" href="https://www.tiktok.com/tag/TikTokTravel?refer=embed">#TikTokTravel</a>{' '}
            <a title="slctrips" target="_blank" href="https://www.tiktok.com/tag/slctrips?refer=embed">#slctrips</a>{' '}
            <a target="_blank" title="♬ original sound  - SLC Trips" href="https://www.tiktok.com/music/original-sound-SLC-Trips-7519025074049960759?refer=embed">♬ original sound  - SLC Trips</a>
          </section>
        </blockquote>
      ) : (
        // Generic embed for other videos
        <blockquote 
          className="tiktok-embed" 
          cite={`https://www.tiktok.com/@slctrips/video/${videoId}`}
          data-video-id={videoId} 
          style={{ maxWidth: '400px', minWidth: '280px' }}
        >
          <section>
            <a 
              target="_blank" 
              title="@slctrips" 
              href="https://www.tiktok.com/@slctrips?refer=embed"
              rel="noopener noreferrer"
            >
              @slctrips
            </a>
            <p>Follow @slctrips for more Utah adventures</p>
            <a 
              target="_blank" 
              title="♬ original sound - SLC Trips" 
              href={`https://www.tiktok.com/music/original-sound-SLC-Trips-${videoId}?refer=embed`}
              rel="noopener noreferrer"
            >
              ♬ original sound - SLC Trips
            </a>
          </section>
        </blockquote>
      )}
    </div>
  );
}

// Extend window type for TikTok embed
declare global {
  interface Window {
    TikTokEmbedJS?: boolean;
    tiktokEmbed?: {
      lib: {
        render: () => void;
      };
    };
  }
}