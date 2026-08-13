"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { adminAuthService } from "@/services/admin.service";

interface Props {
  children: (account: any) => React.ReactNode;
}

export default function AdminAuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [account, setAccount] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    adminAuthService.checkAuth()
      .then(d => {
        if (d.code === "success") {
          setAccount(d.account);
        } else {
          router.replace(`/admin/auth/login?from=${encodeURIComponent(pathname)}`);
        }
      })
      .catch(() => {
        router.replace(`/admin/auth/login?from=${encodeURIComponent(pathname)}`);
      })
      .finally(() => setChecking(false));
  }, [pathname]);

  if (checking) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "#F5F6FA",
        fontFamily: "Nunito Sans, sans-serif", fontSize: 16, color: "#888"
      }}>
        Loading...
      </div>
    );
  }

  if (!account) return null;

  return <>{children(account)}</>;
}
