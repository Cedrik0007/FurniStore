import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import ExpenseForm from "../components/ExpenseForm";
import ConfirmDialog from "../components/ConfirmDialog";
import "../styles/transactions.css";

const formatCurrency = (value) => {
  const num = parseFloat(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const EXPENSE_ICONS = {
  rent: "🏠",
  salary: "👤",
  transport: "🚚",
  others: "📦",
};

const ExpensePage = () => {
  const { isOwner } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data.expenses || []);
      setTotal(parseFloat(res.data.total) || 0);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to load expenses" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (formData) => {
    setFormLoading(true);
    try {
      await api.post("/expenses", formData);
      setAlert({ type: "success", message: "Expense added successfully!" });
      setIsFormOpen(false);
      fetchExpenses();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to add expense" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteExpense = async () => {
    try {
      await api.delete(`/expenses/${deleteDialog.id}`);
      setAlert({ type: "success", message: "Expense record deleted." });
      setDeleteDialog({ open: false, id: null });
      fetchExpenses();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete" });
      setDeleteDialog({ open: false, id: null });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">{expenses.length} records</p>
        </div>
        <button className="btn btn-danger" onClick={() => setIsFormOpen(true)}>
          + Add Expense
        </button>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Total Card */}
      <div className="total-banner expense-banner">
        <span className="total-label">💸 Total Expenses</span>
        <span className="total-value">{formatCurrency(total)}</span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading expenses..." />
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💸</div>
          <p>No expense records yet</p>
          <button className="btn btn-danger" onClick={() => setIsFormOpen(true)}>
            Add First Expense
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Note</th>
                {isOwner() && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>
                    <div className="expense-type-cell">
                      <span className="expense-icon">
                        {EXPENSE_ICONS[expense.type] || "📦"}
                      </span>
                      <span className="cell-main">
                        {expense.type.charAt(0).toUpperCase() + expense.type.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="amount-expense">{formatCurrency(expense.amount)}</span>
                  </td>
                  <td>{formatDate(expense.date)}</td>
                  <td>{expense.note || "—"}</td>
                  {isOwner() && (
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteDialog({ open: true, id: expense._id })}
                      >
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="table-total-label">Total</td>
                <td className="table-total amount-expense">{formatCurrency(total)}</td>
                <td colSpan={isOwner() ? 3 : 2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddExpense}
        loading={formLoading}
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete Expense Record"
        message="Are you sure you want to delete this expense record?"
        onConfirm={handleDeleteExpense}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
        confirmText="Delete"
        confirmClass="btn-danger"
      />
    </div>
  );
};

export default ExpensePage;
