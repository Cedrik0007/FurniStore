import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import IncomeForm from "../components/IncomeForm";
import DeleteReasonDialog from "../components/DeleteReasonDialog";
import { DollarSign, Trash2 } from "lucide-react";
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

const IncomePage = () => {
  const { isOwner } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incomeRes, productRes] = await Promise.all([
        api.get("/income"),
        api.get("/products"),
      ]);
      setIncomes(incomeRes.data.incomes || []);
      setTotal(parseFloat(incomeRes.data.total) || 0);
      setProducts(productRes.data.products || []);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddIncome = async (formData) => {
    setFormLoading(true);
    try {
      await api.post("/income", formData);
      setAlert({ type: "success", message: "Income added successfully!" });
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to add income" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteIncome = async (deleteReason) => {
    try {
      await api.request({
        method: 'delete',
        url: `/income/${deleteDialog.id}`,
        data: { deleteReason },
      });
      setAlert({ type: "success", message: "Income record deleted." });
      setDeleteDialog({ open: false, id: null });
      fetchData();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete" });
      setDeleteDialog({ open: false, id: null });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Income</h1>
          <p className="page-subtitle">{incomes.length} records</p>
        </div>
        <button className="btn btn-success" onClick={() => setIsFormOpen(true)}>
          + Add Income
        </button>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Total Card */}
      <div className="total-banner income-banner">
        <span className="total-label"><DollarSign size={20} className="inline" /> Total Income</span>
        <span className="total-value">{formatCurrency(total)}</span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading income..." />
      ) : incomes.length === 0 ? (
        <div className="empty-state">
          <DollarSign size={48} className="empty-icon" />
          <p>No income records yet</p>
          <button className="btn btn-success" onClick={() => setIsFormOpen(true)}>
            Add First Income
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Note</th>
                {isOwner() && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income._id}>
                  <td>
                    <div className="cell-main">{income.productName || income.product?.name || "—"}</div>
                    {income.product?.category && (
                      <div className="cell-sub">{income.product.category}</div>
                    )}
                  </td>
                  <td>
                    <span className="amount-income">{formatCurrency(income.amount)}</span>
                  </td>
                  <td>{formatDate(income.date)}</td>
                  <td>{income.note || "—"}</td>
                  {isOwner() && (
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteDialog({ open: true, id: income._id })}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="table-total-label">Total</td>
                <td className="table-total amount-income">{formatCurrency(total)}</td>
                <td colSpan={isOwner() ? 3 : 2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <IncomeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddIncome}
        products={products}
        loading={formLoading}
      />

      <DeleteReasonDialog
        isOpen={deleteDialog.open}
        title="Delete Income Record"
        message="Are you sure you want to delete this income record?"
        onConfirm={handleDeleteIncome}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </div>
  );
};

export default IncomePage;
