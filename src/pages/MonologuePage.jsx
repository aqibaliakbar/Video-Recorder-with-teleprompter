// src/pages/MonologueSelection.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const monologues = [
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
];

const MonologueSelection = () => {
  const [selectedMonologue, setSelectedMonologue] = useState("");
  const navigate = useNavigate();

  const handleSelect = (monologue) => {
    setSelectedMonologue(monologue);
  };

  const handleContinue = () => {
    navigate("/video-recorder", { state: { monologue: selectedMonologue } });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Select a Monologue</h1>
      <div className="space-y-2">
        {monologues.map((monologue, index) => (
          <div
            key={index}
            className={`p-4 border ${
              selectedMonologue === monologue
                ? "border-blue-500"
                : "border-gray-300"
            } cursor-pointer`}
            onClick={() => handleSelect(monologue)}
          >
            {monologue}
          </div>
        ))}
      </div>
      <button
        className={`mt-4 p-2 bg-blue-500 text-white rounded ${
          !selectedMonologue && "opacity-50 cursor-not-allowed"
        }`}
        onClick={handleContinue}
        disabled={!selectedMonologue}
      >
        Continue
      </button>
    </div>
  );
};

export default MonologueSelection;
