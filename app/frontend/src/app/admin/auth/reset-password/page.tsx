"use client";
import { useState } from "react";
import { adminAuthService } from "@/services/admin.service";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageToggle from "@/components/shared/LanguageToggle";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirm]   = useState("");
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t.adminProfile.passwordsDoNotMatch);
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
        setError(res.message ?? t.adminAuth.resetPasswordFailed);
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
        <h1 className="inner-title">{t.adminAuth.resetPasswordTitle}</h1>
        <p className="inner-desc">{t.adminAuth.resetPasswordDesc}</p>

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
            <label className="inner-label" htmlFor="password">{t.adminProfile.newPasswordLabel}</label>
            <input
              id="password"
              type="password"
              className="inner-control"
              placeholder={t.adminAuth.newPasswordPlaceholder}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="inner-group">
            <label className="inner-label" htmlFor="confirmPassword">{t.adminProfile.confirmPasswordLabel}</label>
            <input
              id="confirmPassword"
              type="password"
              className="inner-control"
              placeholder={t.adminAuth.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="inner-button" disabled={loading}>
            {loading ? t.adminProfile.changing : t.adminProfile.changePassword}
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
