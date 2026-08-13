"use client";
import { useState } from "react";
import { adminAuthService } from "@/services/admin.service";

export default function ResetPasswordPage() {
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirm]   = useState("");
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await adminAuthService.resetPassword(password);
      if (res.code === "success") {
        sessionStorage.removeItem("resetEmail");
        window.location.href = "/admin/auth/login";
      } else {
        setError(res.message ?? "Failed to reset password");
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
        <h1 className="inner-title">Reset Password</h1>
        <p className="inner-desc">Please enter your new password to continue</p>

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
            <label className="inner-label" htmlFor="password">New Password *</label>
            <input
              id="password"
              type="password"
              className="inner-control"
              placeholder="Enter new password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="inner-group">
            <label className="inner-label" htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              type="password"
              className="inner-control"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="inner-button" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>

        <div className="inner-more">
          <span>Remembered your password?</span>
          <a href="/admin/auth/login">Login</a>
        </div>
      </div>
    </div>
  );
}
