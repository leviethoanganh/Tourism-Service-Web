"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminAuthService } from "@/services/admin.service";

export default function AdminLoginPage() {
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
        setError(res.message ?? "Login failed");
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
        <h3 className="inner-title">Sign in to the system</h3>
        <p className="inner-desc">Enter your credentials to continue</p>

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
            <label className="inner-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="inner-control"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="inner-group">
            <label className="inner-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="inner-control"
              placeholder="Enter your password"
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
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/admin/auth/forgot-password" className="inner-link">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="inner-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="inner-more">
          <span>Don&apos;t have an account?</span>
          <a href="/admin/auth/register">Sign up</a>
        </div>
      </div>
    </div>
  );
}
