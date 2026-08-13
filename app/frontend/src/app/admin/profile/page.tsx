"use client";
import { useEffect, useState } from "react";
import { adminAuthService, adminProfileService } from "@/services/admin.service";

export default function ProfilePage() {
  const [account, setAccount]   = useState<any>(null);
  const [avatar, setAvatar]     = useState<File | null>(null);
  const [form, setForm]         = useState({ fullName:"", email:"" });
  const [pwdForm, setPwdForm]   = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [msgProfile, setMsgProfile] = useState("");
  const [msgPwd, setMsgPwd]         = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd]         = useState(false);

  useEffect(() => {
    adminAuthService.checkAuth()
      .then(d => {
        const acc = d.account;
        setAccount(acc);
        setForm({ fullName: acc?.fullName ?? "", email: acc?.email ?? "" });
      }).catch(() => {});
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true); setMsgProfile("");
    try {
      const fd = new FormData();
      fd.append("fullName", form.fullName);
      fd.append("email", form.email);
      if (avatar) fd.append("avatar", avatar);
      const res = await adminProfileService.update(fd);
      if (res.code === "success") {
        setMsgProfile("Profile updated successfully!");
        if (res.account) { setAccount(res.account); setForm({ fullName: res.account.fullName, email: res.account.email }); }
      } else setMsgProfile(res.message ?? "Error");
    } catch { setMsgProfile("Connection error."); }
    finally { setSavingProfile(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { setMsgPwd("Passwords do not match."); return; }
    setSavingPwd(true); setMsgPwd("");
    try {
      const res = await adminProfileService.changePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      if (res.code === "success") { setMsgPwd("Password changed successfully!"); setPwdForm({ currentPassword:"", newPassword:"", confirmPassword:"" }); }
      else setMsgPwd(res.message ?? "Error");
    } catch { setMsgPwd("Connection error."); }
    finally { setSavingPwd(false); }
  };

  const msgStyle = (msg: string) => ({
    gridColumn:"span 2" as const, padding:"12px 16px", borderRadius:8, marginBottom:8,
    background: msg.includes("successfully") ? "#f0fff4":"#fff0f0",
    border:`1px solid ${msg.includes("successfully")?"#4CAF50":"#F93C65"}`,
    color: msg.includes("successfully")?"#4CAF50":"#F93C65", fontWeight:600,
  });

  if (!account) return <div style={{ padding: 30 }}>Loading...</div>;

  return (
    <>
      <h1 className="box-title">My Profile</h1>

      {/* Edit profile */}
      <div className="section-8">
        <form onSubmit={handleProfileSubmit}>
          {msgProfile && <div style={msgStyle(msgProfile)}>{msgProfile}</div>}
          <div className="inner-group">
            <label className="inner-label" htmlFor="fullName">Full Name *</label>
            <input id="fullName" type="text" value={form.fullName} required
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="email">Email *</label>
            <input id="email" type="email" value={form.email} required
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="inner-group inner-two-col">
            <label className="inner-label">Avatar</label>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              {account.avatar
                ? <img src={account.avatar} alt={account.fullName} style={{ width:60, height:60, borderRadius:"50%", objectFit:"cover" }} />
                : <div style={{ width:60, height:60, borderRadius:"50%", background:"#4880FF", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:22 }}>{account.fullName?.[0]?.toUpperCase()}</div>
              }
              <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files?.[0] ?? null)} style={{ height:"auto", padding:"12px 22px" }} />
            </div>
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={savingProfile}>{savingProfile ? "Saving..." : "Save Profile"}</button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="section-8" style={{ marginTop: 30 }}>
        <form onSubmit={handlePasswordSubmit}>
          {msgPwd && <div style={msgStyle(msgPwd)}>{msgPwd}</div>}
          <div className="inner-group">
            <label className="inner-label" htmlFor="currentPassword">Current Password *</label>
            <input id="currentPassword" type="password" value={pwdForm.currentPassword} required
              onChange={e => setPwdForm(p => ({ ...p, currentPassword: e.target.value }))} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="newPassword">New Password *</label>
            <input id="newPassword" type="password" value={pwdForm.newPassword} required
              onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="confirmPassword">Confirm Password *</label>
            <input id="confirmPassword" type="password" value={pwdForm.confirmPassword} required
              onChange={e => setPwdForm(p => ({ ...p, confirmPassword: e.target.value }))} />
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={savingPwd}>{savingPwd ? "Changing..." : "Change Password"}</button>
          </div>
        </form>
      </div>
    </>
  );
}
