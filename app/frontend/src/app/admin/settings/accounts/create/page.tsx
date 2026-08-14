"use client";
import { useEffect, useState } from "react";
import { adminSettingService } from "@/services/admin.service";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export default function AccountCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [roles,   setRoles]   = useState<any[]>([]);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState("");
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", role: "", status: "active",
  });
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    adminSettingService.getRoles()
      .then(d => setRoles(d.roleList ?? []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append("avatar", avatar);
      const res = await adminSettingService.createAccount(fd);
      if (res.code === "success") router.push("/admin/settings/accounts");
      else setMsg(res.message ?? t.adminCategoryForm.errorGeneric);
    } catch { setMsg(t.common.connectionError); }
    finally { setSaving(false); }
  };

  return (
    <>
      <h1 className="box-title">{t.adminAccountForm.createTitle}</h1>
      <div className="section-8">
        {msg && (
          <div style={{
            gridColumn: "span 2", padding: "12px 16px", borderRadius: 8, marginBottom: 8,
            background: "#fff0f0", border: "1px solid #F93C65", color: "#F93C65", fontWeight: 600,
          }}>{msg}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="inner-group">
            <label className="inner-label" htmlFor="fullName">{t.adminAccountForm.fullNameLabel}</label>
            <input id="fullName" type="text" value={form.fullName} required
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder={t.adminAccountForm.fullNamePlaceholder} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="email">{t.adminAccountForm.emailLabel}</label>
            <input id="email" type="email" value={form.email} required
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder={t.adminAccountForm.emailPlaceholder} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="password">{t.adminAccountForm.passwordLabel}</label>
            <input id="password" type="password" value={form.password} required
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="role">{t.adminAccountForm.roleLabel}</label>
            <select id="role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              <option value="">{t.adminAccountForm.selectRolePlaceholder}</option>
              {roles.map((r: any) => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="status">{t.common.status}</label>
            <select id="status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              <option value="active">{t.common.active}</option>
              <option value="inactive">{t.common.inactive}</option>
              <option value="initial">{t.adminAccountForm.statusPendingApproval}</option>
            </select>
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="avatar">{t.adminCategoryForm.avatarLabel}</label>
            <input id="avatar" type="file" accept="image/*"
              onChange={e => setAvatar(e.target.files?.[0] ?? null)} style={{ height: "auto", padding: "12px 22px" }} />
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={saving}>{saving ? t.common.creating : t.common.create}</button>
          </div>
        </form>
        <div className="inner-back">
          <a href="/admin/settings/accounts">{t.common.backToList}</a>
        </div>
      </div>
    </>
  );
}
