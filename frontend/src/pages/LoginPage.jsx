import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";
// import { useState } from "react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setServerError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🛋️</div>
          <h1 className="login-title">FurniStore</h1>
          <p className="login-subtitle">Manager Portal</p>
        </div>

        {serverError && (
          <div className="login-error">
            <span>❌</span> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`form-input login-input ${errors.email ? "input-error" : ""}`}
              placeholder="Enter your email"
              autoComplete="off"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`form-input login-input ${errors.password ? "input-error" : ""}`}
              placeholder="Enter your password"
              autoComplete="off"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div> */}
<div className="form-group">
  <label className="form-label" htmlFor="password">Password</label>

  <div className="password-wrapper">
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      name="password"
      value={form.password}
      onChange={handleChange}
      className={`form-input login-input ${errors.password ? "input-error" : ""}`}
      placeholder="Enter your password"
      autoComplete="off"
    />

   <button
  type="button"
  className="eye-btn"
  onClick={() => setShowPassword((prev) => !prev)}
>
  {showPassword ? (
    /* Eye OFF (hidden) */
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.58 10.58C10.21 10.95 10 11.45 10 12C10 13.1 10.9 14 12 14C12.55 14 13.05 13.79 13.42 13.42"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9.88 5.08C10.55 4.86 11.26 4.75 12 4.75C16.5 4.75 20.27 7.61 21.75 12C21.29 13.3 20.54 14.47 19.56 15.43M6.1 6.1C4.53 7.18 3.31 8.76 2.25 12C3.73 16.39 7.5 19.25 12 19.25C13.24 19.25 14.41 19 15.46 18.56"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    /* Eye ON (visible) */
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.25 12C3.73 7.61 7.5 4.75 12 4.75C16.5 4.75 20.27 7.61 21.75 12C20.27 16.39 16.5 19.25 12 19.25C7.5 19.25 3.73 16.39 2.25 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )}
</button>
  </div>

  {errors.password && <span className="error-text">{errors.password}</span>}
</div>
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-hint">
          <p>Demo credentials:</p>
          <code>owner@furniture.com / Owner@123</code>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
