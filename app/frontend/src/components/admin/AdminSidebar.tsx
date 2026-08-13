"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminAuthService } from "@/services/admin.service";
import { useRouter } from "next/navigation";

const menu = [
  { href: "/admin/dashboard", icon: "fa-gauge", label: "Dashboard" },
  { href: "/admin/tours", icon: "fa-map-location-dot", label: "Tours" },
  { href: "/admin/categories", icon: "fa-folder-tree", label: "Categories" },
  { href: "/admin/orders", icon: "fa-receipt", label: "Orders" },
  { href: "/admin/users", icon: "fa-users", label: "Users" },
  { href: "/admin/settings", icon: "fa-gear", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await adminAuthService.logout().catch(() => {});
    router.push("/admin/auth/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <Link href="/admin/dashboard">
          <img src="/client/assets/images/logo.png" alt="Admin" />
        </Link>
      </div>

      <nav className="admin-sidebar-nav">
        {menu.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${active ? "active" : ""}`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button className="admin-sidebar-logout" onClick={handleLogout}>
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
        <span>Logout</span>
      </button>
    </aside>
  );
}
