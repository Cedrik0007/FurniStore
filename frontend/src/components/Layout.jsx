import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BarChart3, Package, DollarSign, CreditCard, LogOut, Sofa } from "lucide-react";
import "../styles/layout.css";

const Layout = () => {
  const { user, logout, isOwner } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className="mobile-logo">
          <span className="logo-icon"><Sofa size={24} className="inline" /></span>
          <span className="logo-text">Bismi</span>
        </div>
        <div className="mobile-user-badge">{user?.name?.charAt(0).toUpperCase()}</div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon"><Sofa size={24} className="inline" /></span>
            <div>
              <div className="logo-text">Bismi</div>
              <div className="logo-sub">Manager</div>
            </div>
          </div>
        </div>

        <div className="user-info-card">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <div className="user-name">{user?.name}</div>
            <div className={`user-role ${user?.role}`}>{user?.role}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}
            onClick={closeSidebar}
          >
            <BarChart3 size={20} className="nav-icon" />
            <span className="nav-label">Dashboard</span>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}
            onClick={closeSidebar}
          >
            <Package size={20} className="nav-icon" />
            <span className="nav-label">Products</span>
          </NavLink>

          <NavLink
            to="/income"
            className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}
            onClick={closeSidebar}
          >
            <DollarSign size={20} className="nav-icon" />
            <span className="nav-label">Income</span>
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}
            onClick={closeSidebar}
          >
            <CreditCard size={20} className="nav-icon" />
            <span className="nav-label">Expenses</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="bottom-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `bottom-nav-item ${isActive ? "bottom-nav-active" : ""}`}
        >
          <BarChart3 size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Dashboard</span>
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) => `bottom-nav-item ${isActive ? "bottom-nav-active" : ""}`}
        >
          <Package size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Products</span>
        </NavLink>
        <NavLink
          to="/income"
          className={({ isActive }) => `bottom-nav-item ${isActive ? "bottom-nav-active" : ""}`}
        >
          <DollarSign size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Income</span>
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) => `bottom-nav-item ${isActive ? "bottom-nav-active" : ""}`}
        >
          <CreditCard size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Expenses</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
