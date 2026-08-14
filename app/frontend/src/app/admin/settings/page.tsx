"use client";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function SettingsPage() {
  const { t } = useTranslation();
  const SETTINGS = [
    { href:"/admin/settings/website-info", icon:"fa-globe",         label:t.adminWebsiteInfo.title, desc:t.adminSettingsHub.websiteInfoDesc },
    { href:"/admin/settings/accounts",     icon:"fa-users-gear",    label:t.adminAccounts.title,    desc:t.adminSettingsHub.accountsDesc },
    { href:"/admin/settings/roles",        icon:"fa-shield-halved", label:t.adminRoles.title,       desc:t.adminSettingsHub.rolesDesc },
  ];
  return (
    <>
      <h1 className="box-title">{t.adminShell.generalSettings}</h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:30 }}>
        {SETTINGS.map(s => (
          <Link key={s.href} href={s.href} style={{
            display:"block", background:"white", borderRadius:14, padding:"36px 28px",
            textDecoration:"none", color:"inherit", border:"1px solid #E0E0E0",
            textAlign:"center", transition:"box-shadow .2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(72,128,255,.15)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
          >
            <i className={`fa-solid ${s.icon}`} style={{ fontSize:36, color:"#4880FF", marginBottom:16, display:"block" }} />
            <div style={{ fontWeight:700, fontSize:16, color:"#202224", marginBottom:6 }}>{s.label}</div>
            <div style={{ fontWeight:600, fontSize:13, color:"#888" }}>{s.desc}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
