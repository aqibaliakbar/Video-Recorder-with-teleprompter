// src/pages/VideoRecorder.js
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useLocation, useNavigate } from "react-router-dom";

const VideoRecorder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const monologue = location.state?.monologue || "";

  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(true);
  const [recording, setRecording] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const monologueRef = useRef(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturedChunks, setCapturedChunks] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [currentTransform, setCurrentTransform] = useState(100);

  useEffect(() => {
    let animationFrameId;
    let start;

    const scrollText = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (!isPaused) {
        const newTransform = currentTransform - (elapsed / 1000) * speed;
        monologueRef.current.style.transform = `translateY(${newTransform}%)`;
        setCurrentTransform(newTransform);
      }

      animationFrameId = requestAnimationFrame(scrollText);
    };

    if (startTime === null && !isPaused) {
      setStartTime(performance.now());
    }

    if (!isPaused) {
      animationFrameId = requestAnimationFrame(scrollText);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [speed, isPaused, currentTransform, startTime]);

  const handleSpeedChange = (e) => {
    setSpeed(Number(e.target.value));
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    monologueRef.current.style.transform = "translateY(100%)";
    setCurrentTransform(100);
    setIsPaused(true);
    setStartTime(null);
  };

  const handleStartRecording = () => {
    setRecording(true);
    setCapturedChunks([]);
    const stream = webcamRef.current.stream;
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        setCapturedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(capturedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoSrc(url);
    };

    mediaRecorderRef.current.start();
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleViewRecording = () => {
    navigate("/video-playback", { state: { videoSrc } });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Video Recorder with Teleprompter</h1>
      <div className="w-full max-w-md h-64 overflow-hidden border-2 border-gray-300 relative mb-4">
        <div
          ref={monologueRef}
          className="absolute bottom-0 w-full text-center bg-white text-black"
          style={{
            transition: "transform 0.1s linear",
            whiteSpace: "pre-wrap",
            transform: "translateY(100%)",
          }}
        >
          {monologue}
        </div>
      </div>
      <Webcam
        audio={true}
        ref={webcamRef}
        className="w-full max-w-md h-64 mb-4"
      />
      <div className="mt-4 flex space-x-4">
        <label>
          Speed:
          <input
            type="number"
            value={speed}
            onChange={handleSpeedChange}
            className="border ml-2 p-1"
          />
        </label>
        <button
          onClick={handlePause}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={handleReset}
          className="bg-red-500 text-white p-2 rounded"
        >
          Reset
        </button>
        {!recording ? (
          <button
            onClick={handleStartRecording}
            className="bg-green-500 text-white p-2 rounded"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="bg-yellow-500 text-white p-2 rounded"
          >
            Stop Recording
          </button>
        )}
        {videoSrc && (
          <button
            onClick={handleViewRecording}
            className="bg-purple-500 text-white p-2 rounded"
          >
            View Recording
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
