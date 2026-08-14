"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminAuthService } from "@/services/admin.service";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageToggle from "@/components/shared/LanguageToggle";

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [remember, setRemember]   = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await adminAuthService.login(email, password, remember);
      if (res.code === "success") {
        router.push("/admin/dashboard");
      } else {
        setError(res.message ?? t.adminAuth.loginFailed);
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
        <h3 className="inner-title">{t.adminAuth.signInTitle}</h3>
        <p className="inner-desc">{t.adminAuth.signInDesc}</p>

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
            <label className="inner-label" htmlFor="email">{t.adminAuth.emailLabel}</label>
            <input
              id="email"
              type="email"
              className="inner-control"
              placeholder={t.adminAuth.emailPlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="inner-group">
            <label className="inner-label" htmlFor="password">{t.adminAuth.passwordLabel}</label>
            <input
              id="password"
              type="password"
              className="inner-control"
              placeholder={t.adminAuth.passwordPlaceholder}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="inner-meta">
            <div className="inner-check">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <label htmlFor="remember">{t.adminAuth.rememberMe}</label>
            </div>
            <a href="/admin/auth/forgot-password" className="inner-link">
              {t.adminAuth.forgotPassword}
            </a>
          </div>

          <button
            type="submit"
            className="inner-button"
            disabled={loading}
          >
            {loading ? t.adminAuth.signingIn : t.adminAuth.signIn}
          </button>
        </form>

        <div className="inner-more">
          <span>{t.adminAuth.noAccountYet}</span>
          <a href="/admin/auth/register">{t.adminAuth.signUp}</a>
        </div>
      </div>
    </div>
  );
}
