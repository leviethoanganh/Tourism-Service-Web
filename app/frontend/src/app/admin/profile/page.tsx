"use client";
import { useEffect, useState } from "react";
import { adminAuthService, adminProfileService } from "@/services/admin.service";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProfilePage() {
  const { t } = useTranslation();
  const [account, setAccount]   = useState<any>(null);
  const [avatar, setAvatar]     = useState<File | null>(null);
  const [form, setForm]         = useState({ fullName:"", email:"" });
  const [pwdForm, setPwdForm]   = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [msgProfile, setMsgProfile] = useState("");
  const [msgPwd, setMsgPwd]         = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [pwdSuccess, setPwdSuccess]         = useState(false);
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
    setSavingProfile(true); setMsgProfile(""); setProfileSuccess(false);
    try {
      const fd = new FormData();
      fd.append("fullName", form.fullName);
      fd.append("email", form.email);
      if (avatar) fd.append("avatar", avatar);
      const res = await adminProfileService.update(fd);
      if (res.code === "success") {
        setMsgProfile(t.adminProfile.profileUpdatedSuccess); setProfileSuccess(true);
        if (res.account) { setAccount(res.account); setForm({ fullName: res.account.fullName, email: res.account.email }); }
      } else setMsgProfile(res.message ?? t.adminCategoryForm.errorGeneric);
    } catch { setMsgProfile(t.common.connectionError); }
    finally { setSavingProfile(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { setMsgPwd(t.adminProfile.passwordsDoNotMatch); setPwdSuccess(false); return; }
    setSavingPwd(true); setMsgPwd(""); setPwdSuccess(false);
    try {
      const res = await adminProfileService.changePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      if (res.code === "success") { setMsgPwd(t.adminProfile.passwordChangedSuccess); setPwdSuccess(true); setPwdForm({ currentPassword:"", newPassword:"", confirmPassword:"" }); }
      else setMsgPwd(res.message ?? t.adminCategoryForm.errorGeneric);
    } catch { setMsgPwd(t.common.connectionError); }
    finally { setSavingPwd(false); }
  };

  const msgStyle = (success: boolean) => ({
    gridColumn:"span 2" as const, padding:"12px 16px", borderRadius:8, marginBottom:8,
    background: success ? "#f0fff4":"#fff0f0",
    border:`1px solid ${success?"#4CAF50":"#F93C65"}`,
    color: success?"#4CAF50":"#F93C65", fontWeight:600,
  });

  if (!account) return <div style={{ padding: 30 }}>{t.common.loading}</div>;

  return (
    <>
      <h1 className="box-title">{t.adminProfile.title}</h1>

      {/* Edit profile */}
      <div className="section-8">
        <form onSubmit={handleProfileSubmit}>
          {msgProfile && <div style={msgStyle(profileSuccess)}>{msgProfile}</div>}
          <div className="inner-group">
            <label className="inner-label" htmlFor="fullName">{t.adminAccountForm.fullNameLabel}</label>
            <input id="fullName" type="text" value={form.fullName} required
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="email">{t.adminAccountForm.emailLabel}</label>
            <input id="email" type="email" value={form.email} required
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="inner-group inner-two-col">
            <label className="inner-label">{t.adminCategoryForm.avatarLabel}</label>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              {account.avatar
                ? <img src={account.avatar} alt={account.fullName} style={{ width:60, height:60, borderRadius:"50%", objectFit:"cover" }} />
                : <div style={{ width:60, height:60, borderRadius:"50%", background:"#4880FF", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:22 }}>{account.fullName?.[0]?.toUpperCase()}</div>
              }
              <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files?.[0] ?? null)} style={{ height:"auto", padding:"12px 22px" }} />
            </div>
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={savingProfile}>{savingProfile ? t.common.saving : t.adminProfile.saveProfile}</button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="section-8" style={{ marginTop: 30 }}>
        <form onSubmit={handlePasswordSubmit}>
          {msgPwd && <div style={msgStyle(pwdSuccess)}>{msgPwd}</div>}
          <div className="inner-group">
            <label className="inner-label" htmlFor="currentPassword">{t.adminProfile.currentPasswordLabel}</label>
            <input id="currentPassword" type="password" value={pwdForm.currentPassword} required
              onChange={e => setPwdForm(p => ({ ...p, currentPassword: e.target.value }))} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="newPassword">{t.adminProfile.newPasswordLabel}</label>
            <input id="newPassword" type="password" value={pwdForm.newPassword} required
              onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="confirmPassword">{t.adminProfile.confirmPasswordLabel}</label>
            <input id="confirmPassword" type="password" value={pwdForm.confirmPassword} required
              onChange={e => setPwdForm(p => ({ ...p, confirmPassword: e.target.value }))} />
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={savingPwd}>{savingPwd ? t.adminProfile.changing : t.adminProfile.changePassword}</button>
          </div>
        </form>
      </div>
    </>
  );
}
