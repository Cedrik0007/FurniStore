import React, { useEffect } from "react";
import "../styles/components.css";

const Alert = ({ type = "info", message, onClose, autoClose = true }) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-icon">
        {type === "success" && "✅"}
        {type === "error" && "❌"}
        {type === "warning" && "⚠️"}
        {type === "info" && "ℹ️"}
      </span>
      <span className="alert-message">{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
