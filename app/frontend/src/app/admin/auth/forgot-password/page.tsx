"use client";
import { useState } from "react";
import { adminAuthService } from "@/services/admin.service";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await adminAuthService.forgotPassword(email);
      if (res.code === "success") {
        setSuccess("OTP code has been sent to your email.");
        sessionStorage.setItem("resetEmail", email);
        setTimeout(() => {
          window.location.href = "/admin/auth/otp-password";
        }, 1500);
      } else {
        setError(res.message ?? "Failed to send OTP");
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
        <h1 className="inner-title">Forgot Password</h1>
        <p className="inner-desc">Please enter your email to continue</p>

        {error && (
          <div style={{
            background: "#fff0f0", border: "1px solid #F93C65",
            borderRadius: 8, padding: "12px 16px", marginBottom: 24,
            color: "#F93C65", fontWeight: 600, fontSize: 15,
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "#f0fff4", border: "1px solid #4CAF50",
            borderRadius: 8, padding: "12px 16px", marginBottom: 24,
            color: "#4CAF50", fontWeight: 600, fontSize: 15,
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="inner-group">
            <label className="inner-label" htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              className="inner-control"
              placeholder="e.g. levana@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="inner-button" disabled={loading}>
            {loading ? "Sending..." : "Send OTP code"}
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
