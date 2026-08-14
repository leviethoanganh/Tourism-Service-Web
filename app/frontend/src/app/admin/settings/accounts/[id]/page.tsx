"use client";
import { useEffect, useState } from "react";
import { adminSettingService } from "@/services/admin.service";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export default function AccountEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [roles,   setRoles]   = useState<any[]>([]);
  const [form,    setForm]    = useState({ fullName: "", email: "", role: "", status: "active" });
  const [avatar,  setAvatar]  = useState<File | null>(null);
  const [current, setCurrent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      adminSettingService.getAccounts(),
      adminSettingService.getRoles(),
    ]).then(([accs, rls]) => {
      const acc = (accs.accountAdminList ?? accs.accountList ?? []).find((a: any) => a._id === id);
      if (acc) {
        setCurrent(acc);
        setForm({ fullName: acc.fullName ?? "", email: acc.email ?? "", role: acc.role ?? "", status: acc.status ?? "active" });
      }
      setRoles(rls.roleList ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg(""); setSuccess(false);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append("avatar", avatar);
      const res = await adminSettingService.updateAccount(id, fd);
      if (res.code === "success") { setMsg(t.adminAccountForm.updatedSuccess); setSuccess(true); }
      else setMsg(res.message ?? t.adminCategoryForm.errorGeneric);
    } catch { setMsg(t.common.connectionError); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 30 }}>{t.common.loading}</div>;

  return (
    <>
      <h1 className="box-title">{t.adminAccountForm.editTitle}</h1>
      <div className="section-8">
        {msg && (
          <div style={{
            gridColumn: "span 2", padding: "12px 16px", borderRadius: 8, marginBottom: 8,
            background: success ? "#f0fff4" : "#fff0f0",
            border: `1px solid ${success ? "#4CAF50" : "#F93C65"}`,
            color: success ? "#4CAF50" : "#F93C65", fontWeight: 600,
          }}>{msg}</div>
        )}
        <form onSubmit={handleSubmit}>
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
          <div className="inner-group inner-two-col">
            <label className="inner-label">{t.adminCategoryForm.avatarLabel}</label>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {current?.avatar && (
                <img src={current.avatar} alt={current.fullName}
                  style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }} />
              )}
              <input type="file" accept="image/*"
                onChange={e => setAvatar(e.target.files?.[0] ?? null)}
                style={{ height: "auto", padding: "12px 22px" }} />
            </div>
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={saving}>{saving ? t.common.saving : t.common.saveChanges}</button>
          </div>
        </form>
        <div className="inner-back">
          <a href="/admin/settings/accounts">{t.common.backToList}</a>
        </div>
      </div>
    </>
  );
}
