"use client";
import { useEffect, useState } from "react";
import { adminAuthService } from "@/services/admin.service";
import Link from "next/link";

export default function AdminHeader() {
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    adminAuthService.checkAuth()
      .then(d => setAccount(d.account))
      .catch(() => {});
  }, []);

  return (
    <header className="admin-header">
      <div className="admin-header-title"></div>
      <div className="admin-header-right">
        {account && (
          <Link href="/admin/profile" className="admin-header-account">
            {account.avatar
              ? <img src={account.avatar} alt={account.fullName} />
              : <span className="admin-avatar-fallback">{account.fullName?.[0]?.toUpperCase()}</span>
            }
            <span>{account.fullName}</span>
          </Link>
        )}
      </div>
    </header>
  );
}
