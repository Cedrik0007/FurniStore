import React from "react";
import "../styles/components.css";

const LoadingSpinner = ({ fullScreen = false, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className="spinner"></div>
        <p className="loading-text">{text}</p>
      </div>
    );
  }
  return (
    <div className="loading-inline">
      <div className="spinner spinner-sm"></div>
      <span className="loading-text-sm">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
