import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { DollarSign, CreditCard, TrendingUp, TrendingDown, Package, FileText } from "lucide-react";
import "../styles/dashboard.css";

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

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/dashboard");
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner fullScreen text="Loading dashboard..." />;

  if (error) {
    return (
      <div className="page">
        <div className="error-box">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchDashboard}>Retry</button>
        </div>
      </div>
    );
  }

  const { summary, recentTransactions } = data || {};
  const profit = parseFloat(summary?.profit) || 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}!</p>
        </div>
        <button className="btn btn-outline" onClick={fetchDashboard}>↻ Refresh</button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-income">
          <DollarSign size={32} className="stat-icon" />
          <div className="stat-info">
            <div className="stat-label">Total Income</div>
            <div className="stat-value">{formatCurrency(summary?.totalIncome)}</div>
          </div>
        </div>

        <div className="stat-card stat-expense">
          <CreditCard size={32} className="stat-icon" />
          <div className="stat-info">
            <div className="stat-label">Total Expense</div>
            <div className="stat-value">{formatCurrency(summary?.totalExpense)}</div>
          </div>
        </div>

        <div className={`stat-card ${profit >= 0 ? "stat-profit" : "stat-loss"}`}>
          {profit >= 0 ? <TrendingUp size={32} className="stat-icon" /> : <TrendingDown size={32} className="stat-icon" />}
          <div className="stat-info">
            <div className="stat-label">{profit >= 0 ? "Profit" : "Loss"}</div>
            <div className={`stat-value ${profit >= 0 ? "value-profit" : "value-loss"}`}>
              {formatCurrency(Math.abs(profit))}
            </div>
          </div>
        </div>

        <div className="stat-card stat-products">
          <Package size={32} className="stat-icon" />
          <div className="stat-info">
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{summary?.totalProducts || 0}</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Recent Transactions</h2>
          <span className="badge">{recentTransactions?.length || 0} records</span>
        </div>

        {!recentTransactions || recentTransactions.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} className="empty-icon" />
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="transaction-list">
            {recentTransactions.map((tx) => (
              <div key={tx._id} className="transaction-item">
                <div className={`tx-indicator ${tx.type === "income" ? "tx-income" : "tx-expense"}`}>
                  {tx.type === "income" ? "▲" : "▼"}
                </div>
                <div className="tx-info">
                  <div className="tx-desc">{tx.description}</div>
                  <div className="tx-date">{formatDate(tx.date)}</div>
                </div>
                <div className={`tx-amount ${tx.type === "income" ? "amount-income" : "amount-expense"}`}>
                  {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
