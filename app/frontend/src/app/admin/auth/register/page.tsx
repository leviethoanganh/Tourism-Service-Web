"use client";
import { useState } from "react";
import { adminAuthService } from "@/services/admin.service";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageToggle from "@/components/shared/LanguageToggle";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", agree: false,
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) {
      setError(t.adminAuth.mustAcceptTerms);
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
        setError(res.message ?? t.adminAuth.registrationFailed);
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
        <h1 className="inner-title">{t.adminAuth.registerTitle}</h1>
        <p className="inner-desc">{t.adminAuth.registerDesc}</p>

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
            <label className="inner-label" htmlFor="fullName">{t.adminAccountForm.fullNameLabel}</label>
            <input
              id="fullName"
              type="text"
              className="inner-control"
              placeholder={t.adminAccountForm.fullNamePlaceholder}
              value={form.fullName}
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
              required
            />
          </div>

          <div className="inner-group">
            <label className="inner-label" htmlFor="email">{t.adminAccountForm.emailLabel}</label>
            <input
              id="email"
              type="email"
              className="inner-control"
              placeholder={t.adminAuth.registerEmailPlaceholder}
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="inner-group">
            <label className="inner-label" htmlFor="password">{t.adminAccountForm.passwordLabel}</label>
            <input
              id="password"
              type="password"
              className="inner-control"
              placeholder={t.adminAuth.passwordPlaceholderShort}
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
              <label htmlFor="agree">{t.adminAuth.acceptTerms}</label>
            </div>
          </div>

          <button type="submit" className="inner-button" disabled={loading}>
            {loading ? t.adminAuth.registering : t.adminAuth.register}
          </button>
        </form>

        <div className="inner-more">
          <span>{t.adminAuth.alreadyHaveAccount}</span>
          <a href="/admin/auth/login">{t.adminAuth.login}</a>
        </div>
      </div>
    </div>
  );
}
