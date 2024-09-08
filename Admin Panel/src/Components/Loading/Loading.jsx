// LoadingDots.jsx

import React from "react";
import "./LoadingDots.css"; // Import our custom CSS styles

const LoadingDots = () => {
  console.log("loading component ...");
  return (
    <div className="loading-dots-container">
      <div className="dot dot-1"></div>
      <div className="dot dot-2"></div>
      <div className="dot dot-3"></div>
    </div>
  );
};

export default LoadingDots;
