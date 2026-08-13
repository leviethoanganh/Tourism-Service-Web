"use client";
import { useEffect, useState } from "react";
import { adminSettingService } from "@/services/admin.service";

export default function WebsiteInfoPage() {
  const [form, setForm] = useState({ name:"", slogan:"", email:"", phone:"", address:"" });
  const [logo, setLogo]       = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);
  const [currentLogo, setCurrentLogo]     = useState("");
  const [currentFavicon, setCurrentFavicon] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState("");

  useEffect(() => {
    adminSettingService.getWebsiteInfo()
      .then(d => {
        const w = d.settingWebsiteInfo ?? d.websiteInfo ?? {};
        setForm({ name: w.name ?? "", slogan: w.slogan ?? "", email: w.email ?? "", phone: w.phone ?? "", address: w.address ?? "" });
        setCurrentLogo(w.logo ?? "");
        setCurrentFavicon(w.favicon ?? "");
      }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logo) fd.append("logo", logo);
      if (favicon) fd.append("favicon", favicon);
      const res = await adminSettingService.updateWebsiteInfo(fd);
      if (res.code === "success") setMsg("Website info updated successfully!");
      else setMsg(res.message ?? "Error");
    } catch { setMsg("Connection error."); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;

  return (
    <>
      <h1 className="box-title">Website Info</h1>
      <div className="section-8">
        {msg && (
          <div style={{
            gridColumn:"span 2", padding:"12px 16px", borderRadius:8,
            background: msg.includes("successfully")?"#f0fff4":"#fff0f0",
            border:`1px solid ${msg.includes("successfully")?"#4CAF50":"#F93C65"}`,
            color: msg.includes("successfully")?"#4CAF50":"#F93C65", fontWeight:600,
          }}>{msg}</div>
        )}
        <form onSubmit={handleSubmit}>
          {[["name","Website Name"],["slogan","Slogan"],["email","Email"],["phone","Phone"],["address","Address"]].map(([k, l]) => (
            <div key={k} className="inner-group">
              <label className="inner-label" htmlFor={k}>{l}</label>
              <input id={k} type="text" value={(form as any)[k]}
                onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
            </div>
          ))}
          <div className="inner-group">
            <label className="inner-label">Logo</label>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              {currentLogo && <img src={currentLogo} alt="logo" style={{ height:40, objectFit:"contain" }} />}
              <input type="file" accept="image/*" onChange={e => setLogo(e.target.files?.[0] ?? null)} style={{ height:"auto", padding:"12px 22px" }} />
            </div>
          </div>
          <div className="inner-group">
            <label className="inner-label">Favicon</label>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              {currentFavicon && <img src={currentFavicon} alt="favicon" style={{ height:32 }} />}
              <input type="file" accept="image/*" onChange={e => setFavicon(e.target.files?.[0] ?? null)} style={{ height:"auto", padding:"12px 22px" }} />
            </div>
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
        <div className="inner-back">
          <a href="/admin/settings">Back to Settings</a>
        </div>
      </div>
    </>
  );
}
