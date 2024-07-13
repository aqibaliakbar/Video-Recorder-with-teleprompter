// src/pages/VideoPlayback.js
import React from "react";
import { useLocation } from "react-router-dom";

const VideoPlayback = () => {
  const location = useLocation();
  const videoSrc = location.state?.videoSrc || "";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Recorded Video</h1>
      {videoSrc ? (
        <video src={videoSrc} controls className="w-full max-w-md mb-4"></video>
      ) : (
        <p>No video recorded.</p>
      )}
      {videoSrc && (
        <a
          href={videoSrc}
          download="recorded_video.webm"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Download Video
        </a>
      )}
    </div>
  );
};

export default VideoPlayback;
