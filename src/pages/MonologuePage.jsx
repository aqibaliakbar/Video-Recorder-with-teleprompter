// src/pages/MonologueSelection.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const monologues = [
  {
    id: 1,
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  },
  {
    id: 2,
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 30000s.",
  },
  {
    id: 3,
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  },
];

const MonologueSelection = () => {
  const [selectedMonologueId, setSelectedMonologueId] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    setSelectedMonologueId(id);
  };

  const handleContinue = () => {
    const selectedMonologue = monologues.find(
      (monologue) => monologue.id === selectedMonologueId
    );
    navigate("/video-recorder", {
      state: { monologue: selectedMonologue.text },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Select a Monologue</h1>
      <div className="space-y-2">
        {monologues.map((monologue) => (
          <div
            key={monologue.id}
            className={`p-4 border ${
              selectedMonologueId === monologue.id
                ? "border-blue-500"
                : "border-gray-300"
            } cursor-pointer`}
            onClick={() => handleSelect(monologue.id)}
          >
            {monologue.text}
          </div>
        ))}
      </div>
      <button
        className={`mt-4 p-2 bg-blue-500 text-white rounded ${
          selectedMonologueId === null && "opacity-50 cursor-not-allowed"
        }`}
        onClick={handleContinue}
        disabled={selectedMonologueId === null}
      >
        Continue
      </button>
    </div>
  );
};

export default MonologueSelection;
