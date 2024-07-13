// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MonologueSelection from "./pages/MonologuePage";

import VideoPlayback from "./pages/VideoPlaybackPage";
import VideoRecorder from "./pages/VideoRecoderPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MonologueSelection />} />
        <Route path="/video-recorder" element={<VideoRecorder />} />
        <Route path="/video-playback" element={<VideoPlayback />} />
      </Routes>
    </Router>
  );
}

export default App;
