"use client";
import { useEffect, useState } from "react";
import { adminAuthService } from "@/services/admin.service";

export default function OtpPasswordPage() {
  const [otp, setOtp]         = useState("");
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("resetEmail") ?? "";
    setEmail(saved);
    if (!saved) window.location.href = "/admin/auth/forgot-password";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await adminAuthService.otpPassword(email, otp);
      if (res.code === "success") {
        window.location.href = "/admin/auth/reset-password";
      } else {
        setError(res.message ?? "Invalid OTP code");
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
        <h1 className="inner-title">Enter OTP Code</h1>
        <p className="inner-desc">Please enter the OTP code to continue</p>

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
            <label className="inner-label" htmlFor="otp">OTP Code *</label>
            <input
              id="otp"
              type="text"
              className="inner-control"
              placeholder="e.g. 123456"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              maxLength={6}
            />
          </div>

          <button type="submit" className="inner-button" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
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
