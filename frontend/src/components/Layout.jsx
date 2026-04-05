import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
          <span className="logo-icon">🛋️</span>
          <span className="logo-text">FurniStore</span>
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
            <span className="logo-icon">🛋️</span>
            <div>
              <div className="logo-text">FurniStore</div>
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
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon">🪑</span>
            <span className="nav-label">Products</span>
          </NavLink>

          <NavLink
            to="/income"
            className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon">💰</span>
            <span className="nav-label">Income</span>
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon">💸</span>
            <span className="nav-label">Expenses</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
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
          <span className="bottom-nav-icon">📊</span>
          <span className="bottom-nav-label">Dashboard</span>
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) => `bottom-nav-item ${isActive ? "bottom-nav-active" : ""}`}
        >
          <span className="bottom-nav-icon">🪑</span>
          <span className="bottom-nav-label">Products</span>
        </NavLink>
        <NavLink
          to="/income"
          className={({ isActive }) => `bottom-nav-item ${isActive ? "bottom-nav-active" : ""}`}
        >
          <span className="bottom-nav-icon">💰</span>
          <span className="bottom-nav-label">Income</span>
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) => `bottom-nav-item ${isActive ? "bottom-nav-active" : ""}`}
        >
          <span className="bottom-nav-icon">💸</span>
          <span className="bottom-nav-label">Expenses</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
