"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { adminAuthService } from "@/services/admin.service";

const menu1 = [
  { href: "/admin/dashboard",  icon: "fa-gauge-high",       label: "Dashboard" },
  { href: "/admin/categories", icon: "fa-table-cells-large", label: "Category Management" },
  { href: "/admin/tours",      icon: "fa-table-list",        label: "Tour Management" },
  { href: "/admin/orders",     icon: "fa-list-check",        label: "Order Management" },
  { href: "/admin/users",      icon: "fa-user",              label: "User Management" },
  { href: "/admin/contacts",   icon: "fa-user-group",        label: "Contact Info" },
];

const menu2 = [
  { href: "/admin/settings", icon: "fa-gear",      label: "General Settings" },
  { href: "/admin/profile",  icon: "fa-user-gear", label: "My Profile" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const isAuth   = pathname.startsWith("/admin/auth/");

  const [account,  setAccount]  = useState<any>(null);
  const [checking, setChecking] = useState(!isAuth);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuth) return;
    adminAuthService.checkAuth()
      .then(d => {
        if (d.code === "success") setAccount(d.account);
        else router.replace("/admin/auth/login");
      })
      .catch(() => router.replace("/admin/auth/login"))
      .finally(() => setChecking(false));
  }, [isAuth]);

  // Auth pages: render children with no shell
  if (isAuth) return <>{children}</>;

  if (checking) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "#F5F6FA",
        fontFamily: "'Nunito Sans', sans-serif", fontSize: 16, color: "#888",
      }}>
        Loading...
      </div>
    );
  }

  if (!account) return null;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const handleLogout = async () => {
    await adminAuthService.logout().catch(() => {});
    router.push("/admin/auth/login");
  };

  const avatarEl = account.avatar
    ? <img src={account.avatar} alt={account.fullName} />
    : (
      <div style={{
        width: 44, height: 44, borderRadius: "50%", background: "#4880FF",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", fontWeight: 700, fontSize: 18,
      }}>
        {account.fullName?.[0]?.toUpperCase() ?? "A"}
      </div>
    );

  return (
    <>
      {/* ─── Header ─── */}
      <header className="header">
        <div className="inner-logo">
          <Link href="/admin/dashboard">
            <span>28</span><span>Admin</span>
          </Link>
        </div>

        <div className="inner-wrap">
          <div className="inner-notify">
            <i className="fa-regular fa-bell" style={{ fontSize: 22, color: "#404040" }} />
          </div>

          <Link href="/admin/profile" className="inner-account" style={{ textDecoration: "none" }}>
            <div className="inner-avatar">{avatarEl}</div>
            <div className="inner-text">
              <div className="inner-name">{account.fullName}</div>
              <div className="inner-role">
                {account.roleName ?? account.role?.name ?? "Admin"}
              </div>
            </div>
          </Link>

          <button
            className="inner-button-menu"
            style={{ background: "none", border: "none", cursor: "pointer", marginRight: 16 }}
            onClick={() => setMenuOpen(true)}
          >
            <i className="fa-solid fa-bars" />
          </button>
        </div>
      </header>

      {/* ─── Sider ─── */}
      <nav className={`sider${menuOpen ? " active" : ""}`}>
        <ul className="inner-menu">
          {menu1.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive(item.href) ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                <i className={`fa-solid ${item.icon}`} /> {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <hr />

        <ul className="inner-menu">
          {menu2.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive(item.href) ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                <i className={`fa-solid ${item.icon}`} /> {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              className="inner-logout"
              style={{ cursor: "pointer" }}
              onClick={handleLogout}
            >
              <i className="fa-solid fa-power-off" /> Logout
            </a>
          </li>
        </ul>
      </nav>

      {/* ─── Main ─── */}
      <main className="main">{children}</main>

      {/* ─── Overlay (mobile) ─── */}
      <div
        className={`sider-overlay${menuOpen ? " active" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
}
