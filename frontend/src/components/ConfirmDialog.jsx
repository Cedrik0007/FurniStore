import React from "react";
import "../styles/components.css";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", confirmClass = "btn-danger" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box confirm-dialog">
        <h3 className="confirm-title">{title || "Are you sure?"}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn ${confirmClass}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
