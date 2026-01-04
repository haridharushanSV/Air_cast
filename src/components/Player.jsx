import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function Player({ url, onBack }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const retryRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls;

    // 🔹 Native HLS first (Safari / some Chrome cases)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.play().catch(() => {});
      return;
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: true,
        backBufferLength: 90,
        maxLiveSyncPlaybackRate: 1.5,
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });

      // 🔥 HANDLE BROKEN CHUNKS
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          if (retryRef.current < 1) {
            retryRef.current += 1;
            hls.startLoad(); // retry once
          } else {
            setError("This channel is currently unavailable.");
            hls.destroy();
          }
        }
      });
    } else {
      setError("Your browser does not support this stream.");
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [url]);

  return (
    <div className="player-root">
      <div className="player-topbar">
        {/* <button onClick={onBack}>← Back</button>
        <span className="live-badge">LIVE</span> */}
      </div>

      <div className="player-video-wrapper">
        {error ? (
          <div className="player-error">
            <p>{error}</p>
            <button onClick={onBack}>Go Back</button>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="player-video"
            controls
            autoPlay
            playsInline
          />
        )}
      </div>
    </div>
  );
}
