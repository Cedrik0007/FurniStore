import React, { useState, useEffect } from "react";
import "../styles/components.css";

const EXPENSE_TYPES = ["rent", "salary", "transport", "others"];

const ExpenseForm = ({ isOpen, onClose, onSubmit, loading }) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    type: "rent",
    amount: "",
    date: today,
    note: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm({ type: "rent", amount: "", date: today, note: "" });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.type) newErrors.type = "Expense type is required";
    if (!form.date) newErrors.date = "Date is required";
    const parsedAmount = parseFloat(form.amount);
    if (!form.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = "Enter a valid amount greater than 0";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">Add Expense</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="form-group">
            <label className="form-label">Expense Type *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={`form-input form-select ${errors.type ? "input-error" : ""}`}
            >
              {EXPENSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
            {errors.type && <span className="error-text">{errors.type}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className={`form-input ${errors.amount ? "input-error" : ""}`}
                placeholder="0.00"
                min="0.01"
                step="0.01"
              />
              {errors.amount && <span className="error-text">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={`form-input ${errors.date ? "input-error" : ""}`}
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Note (optional)</label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
              className="form-input"
              placeholder="Any additional notes..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" disabled={loading}>
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
