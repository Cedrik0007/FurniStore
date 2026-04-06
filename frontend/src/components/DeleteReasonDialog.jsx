import React, { useState } from "react";
import "../styles/components.css";

const DeleteReasonDialog = ({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
}) => {
  const [deleteReason, setDeleteReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(deleteReason);
    } finally {
      setIsSubmitting(false);
      setDeleteReason("");
    }
  };

  const handleCancel = () => {
    setDeleteReason("");
    onCancel();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box confirm-dialog">
        <h3 className="confirm-title">{title || "Delete Item?"}</h3>
        <p className="confirm-message">{message}</p>

        <div className="delete-reason-container">
          <label htmlFor="deleteReason" className="delete-reason-label">
            Reason for deletion (optional):
          </label>
          <textarea
            id="deleteReason"
            className="delete-reason-input"
            placeholder="e.g., Out of stock, Discontinued, etc."
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            disabled={isSubmitting}
            rows="3"
          />
          <span className="delete-reason-hint">
            {deleteReason.length}/200 characters
          </span>
        </div>

        <div className="confirm-actions">
          <button
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReasonDialog;
