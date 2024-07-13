import { useState, useRef, useEffect } from "react";
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
  const [isWebcamReady, setIsWebcamReady] = useState(false);

  useEffect(() => {
    if (typeof MediaRecorder === "undefined") {
      console.error("MediaRecorder is not supported in this browser");
    } else if (!MediaRecorder.isTypeSupported("video/webm")) {
      console.error("video/webm is not supported in this browser");
    }
  }, []);

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

      start = timestamp;
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

  useEffect(() => {
    if (capturedChunks.length > 0 && !recording) {
      console.log("Creating video blob from captured chunks");
      const blob = new Blob(capturedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoSrc(url);
    }
  }, [capturedChunks, recording]);

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
    console.log("Starting recording...");
    setRecording(true);
    setCapturedChunks([]);
    const stream = webcamRef.current.stream;
    console.log("Webcam stream:", stream);

    if (!stream) {
      console.error("No webcam stream available");
      return;
    }

    try {
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      console.log("MediaRecorder created successfully");

      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log("Data available event:", event);
        if (event.data && event.data.size > 0) {
          setCapturedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log("MediaRecorder stopped");
        const blob = new Blob(capturedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoSrc(url);
      };

      mediaRecorderRef.current.start();
      console.log("MediaRecorder started");
    } catch (error) {
      console.error("Error starting MediaRecorder:", error);
    }
  };

  const handleStopRecording = () => {
    console.log("Stopping recording...");
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      console.log("MediaRecorder stopped");
    } else {
      console.warn("MediaRecorder is not in recording state");
    }
    setRecording(false);
  };

  const handleViewRecording = () => {
    navigate("/video-playback", { state: { videoSrc } });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Video Recorder with Teleprompter</h1>
      <div className="w-full h-64 overflow-hidden border-2 border-gray-300 relative mb-4">
        <div
          ref={monologueRef}
          className="absolute bottom-0 w-full text-center text-3xl bg-white text-black"
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
        onUserMedia={() => {
          console.log("Webcam is ready");
          setIsWebcamReady(true);
        }}
        className="w-full max-w-md h-64 mb-4"
      />
      <div className="mt-4 flex space-x-4">
        <label className="flex items-center">
          Speed:
          <input
            type="range"
            min="1"
            max="200"
            step="0.1"
            value={speed}
            onChange={handleSpeedChange}
            className="ml-2"
          />
          <span className="ml-2">{(speed / 20).toFixed(1)}x</span>
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
        {!recording && isWebcamReady ? (
          <button
            onClick={handleStartRecording}
            className="bg-green-500 text-white p-2 rounded"
          >
            Start Recording
          </button>
        ) : !isWebcamReady ? (
          <button disabled className="bg-gray-500 text-white p-2 rounded">
            Waiting for webcam...
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
