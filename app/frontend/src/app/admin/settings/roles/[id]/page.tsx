"use client";
import { useEffect, useState } from "react";
import { adminSettingService } from "@/services/admin.service";
import { useRouter, useParams } from "next/navigation";
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

export default function RoleEditPage() {
  const { t } = useTranslation();
  const PERMISSIONS = PERMISSION_VALUES.map(value => ({ value, label: t.permissions[value] }));
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [name,     setName]     = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState("");
  const [success,  setSuccess]  = useState(false);

  useEffect(() => {
    adminSettingService.getRoleDetail(id)
      .then(d => {
        const role = d.roleDetail ?? d.role ?? d;
        setName(role.name ?? "");
        setSelected(role.permissions ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const toggle = (val: string) =>
    setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg(""); setSuccess(false);
    try {
      const res = await adminSettingService.updateRole(id, { name, permissions: selected });
      if (res.code === "success") {
        setMsg(t.adminRoleForm.updatedSuccess); setSuccess(true);
      } else {
        setMsg(res.message ?? t.adminCategoryForm.errorGeneric);
      }
    } catch { setMsg(t.common.connectionError); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 30 }}>{t.common.loading}</div>;

  return (
    <>
      <h1 className="box-title">{t.adminRoleForm.editTitle}</h1>
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
          <div className="inner-group inner-two-col">
            <label className="inner-label" htmlFor="name">{t.adminRoleForm.roleNameLabel}</label>
            <input id="name" type="text" value={name}
              onChange={e => setName(e.target.value)} required />
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
            <button type="submit" disabled={saving}>{saving ? t.common.saving : t.common.saveChanges}</button>
          </div>
        </form>
        <div className="inner-back">
          <a href="/admin/settings/roles">{t.common.backToList}</a>
        </div>
      </div>
    </>
  );
}
