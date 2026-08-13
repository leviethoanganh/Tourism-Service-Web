"use client";
import { useState } from "react";
import { adminAuthService } from "@/services/admin.service";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", agree: false,
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) {
      setError("You must accept the terms and conditions.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await adminAuthService.register(
        form.fullName, form.email, form.password
      );
      if (res.code === "success") {
        window.location.href = "/admin/auth/register/pending";
      } else {
        setError(res.message ?? "Registration failed");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-account">
      <div className="form-account">
        <h1 className="inner-title">Register</h1>
        <p className="inner-desc">Create an account to continue</p>

        {error && (
          <div style={{
            background: "#fff0f0", border: "1px solid #F93C65",
            borderRadius: 8, padding: "12px 16px", marginBottom: 24,
            color: "#F93C65", fontWeight: 600, fontSize: 15,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="inner-group">
            <label className="inner-label" htmlFor="fullName">Full Name *</label>
            <input
              id="fullName"
              type="text"
              className="inner-control"
              placeholder="e.g. Le Van A"
              value={form.fullName}
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
              required
            />
          </div>

          <div className="inner-group">
            <label className="inner-label" htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              className="inner-control"
              placeholder="e.g. levana@gmail.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="inner-group">
            <label className="inner-label" htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              className="inner-control"
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
            />
          </div>

          <div className="inner-meta">
            <div className="inner-check">
              <input
                id="agree"
                type="checkbox"
                checked={form.agree}
                onChange={e => setForm(p => ({ ...p, agree: e.target.checked }))}
              />
              <label htmlFor="agree">I accept the terms and conditions *</label>
            </div>
          </div>

          <button type="submit" className="inner-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="inner-more">
          <span>Already have an account?</span>
          <a href="/admin/auth/login">Login</a>
        </div>
      </div>
    </div>
  );
}
