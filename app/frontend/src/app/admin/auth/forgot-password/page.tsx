"use client";
import { useState } from "react";
import { adminAuthService } from "@/services/admin.service";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageToggle from "@/components/shared/LanguageToggle";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
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
        setSuccess(t.adminAuth.otpSentSuccess);
        sessionStorage.setItem("resetEmail", email);
        setTimeout(() => {
          window.location.href = "/admin/auth/otp-password";
        }, 1500);
      } else {
        setError(res.message ?? t.adminAuth.otpSendFailed);
      }
    } catch {
      setError(t.adminAuth.connectionErrorRetry);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-account">
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <LanguageToggle />
      </div>
      <div className="form-account">
        <h1 className="inner-title">{t.adminAuth.forgotPasswordTitle}</h1>
        <p className="inner-desc">{t.adminAuth.forgotPasswordDesc}</p>

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
            <label className="inner-label" htmlFor="email">{t.adminAccountForm.emailLabel}</label>
            <input
              id="email"
              type="email"
              className="inner-control"
              placeholder={t.adminAuth.registerEmailPlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="inner-button" disabled={loading}>
            {loading ? t.adminAuth.sendingOtp : t.adminAuth.sendOtpCode}
          </button>
        </form>

        <div className="inner-more">
          <span>{t.adminAuth.rememberedPassword}</span>
          <a href="/admin/auth/login">{t.adminAuth.login}</a>
        </div>
      </div>
    </div>
  );
}
