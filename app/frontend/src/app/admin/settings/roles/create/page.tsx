"use client";
import { useState } from "react";
import { adminSettingService } from "@/services/admin.service";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

const PERMISSION_VALUES = [
  "dashboard-view",
  "category-view", "category-create", "category-edit", "category-delete",
  "tour-view", "tour-create", "tour-edit", "tour-delete",
  "order-view", "order-edit",
  "user-view",
  "setting-view",
  "setting-account-create", "setting-account-edit", "setting-account-delete",
  "setting-role-create", "setting-role-edit", "setting-role-delete",
];

export default function RoleCreatePage() {
  const { t } = useTranslation();
  const PERMISSIONS = PERMISSION_VALUES.map(value => ({ value, label: t.permissions[value] }));
  const router = useRouter();
  const [name, setName]         = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState("");

  const toggle = (val: string) =>
    setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setMsg(t.adminRoleForm.roleNameRequired); return; }
    setSaving(true); setMsg("");
    try {
      const res = await adminSettingService.createRole({ name, permissions: selected });
      if (res.code === "success") router.push("/admin/settings/roles");
      else setMsg(res.message ?? t.adminCategoryForm.errorGeneric);
    } catch { setMsg(t.common.connectionError); }
    finally { setSaving(false); }
  };

  return (
    <>
      <h1 className="box-title">{t.adminRoleForm.createTitle}</h1>
      <div className="section-8">
        {msg && (
          <div style={{
            gridColumn: "span 2", padding: "12px 16px", borderRadius: 8, marginBottom: 8,
            background: "#fff0f0", border: "1px solid #F93C65", color: "#F93C65", fontWeight: 600,
          }}>{msg}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="inner-group inner-two-col">
            <label className="inner-label" htmlFor="name">{t.adminRoleForm.roleNameLabel}</label>
            <input id="name" type="text" value={name}
              onChange={e => setName(e.target.value)} placeholder={t.adminRoleForm.roleNamePlaceholder} required />
          </div>

          <div className="inner-group inner-two-col">
            <label className="inner-label">{t.adminRoleForm.permissionsLabel}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 24px", paddingTop: 8 }}>
              {PERMISSIONS.map(p => (
                <label key={p.value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#606060" }}>
                  <input type="checkbox" checked={selected.includes(p.value)}
                    onChange={() => toggle(p.value)} style={{ width: 16, height: 16, cursor: "pointer" }} />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          <div className="inner-button inner-two-col">
            <button type="submit" disabled={saving}>{saving ? t.common.creating : t.common.create}</button>
          </div>
        </form>
        <div className="inner-back">
          <a href="/admin/settings/roles">{t.common.backToList}</a>
        </div>
      </div>
    </>
  );
}
