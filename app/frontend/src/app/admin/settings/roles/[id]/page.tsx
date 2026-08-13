"use client";
import { useEffect, useState } from "react";
import { adminSettingService } from "@/services/admin.service";
import { useRouter, useParams } from "next/navigation";

const PERMISSIONS = [
  { label: "Dashboard View",           value: "dashboard-view" },
  { label: "Category View",            value: "category-view" },
  { label: "Category Create",          value: "category-create" },
  { label: "Category Edit",            value: "category-edit" },
  { label: "Category Delete",          value: "category-delete" },
  { label: "Tour View",                value: "tour-view" },
  { label: "Tour Create",              value: "tour-create" },
  { label: "Tour Edit",                value: "tour-edit" },
  { label: "Tour Delete",              value: "tour-delete" },
  { label: "Order View",               value: "order-view" },
  { label: "Order Edit",               value: "order-edit" },
  { label: "User View",                value: "user-view" },
  { label: "Setting View",             value: "setting-view" },
  { label: "Setting Account Create",   value: "setting-account-create" },
  { label: "Setting Account Edit",     value: "setting-account-edit" },
  { label: "Setting Account Delete",   value: "setting-account-delete" },
  { label: "Setting Role Create",      value: "setting-role-create" },
  { label: "Setting Role Edit",        value: "setting-role-edit" },
  { label: "Setting Role Delete",      value: "setting-role-delete" },
];

export default function RoleEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [name,     setName]     = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState("");

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
    setSaving(true); setMsg("");
    try {
      const res = await adminSettingService.updateRole(id, { name, permissions: selected });
      if (res.code === "success") {
        setMsg("Role updated successfully!");
      } else {
        setMsg(res.message ?? "Error");
      }
    } catch { setMsg("Connection error."); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;

  return (
    <>
      <h1 className="box-title">Edit Role</h1>
      <div className="section-8">
        {msg && (
          <div style={{
            gridColumn: "span 2", padding: "12px 16px", borderRadius: 8, marginBottom: 8,
            background: msg.includes("successfully") ? "#f0fff4" : "#fff0f0",
            border: `1px solid ${msg.includes("successfully") ? "#4CAF50" : "#F93C65"}`,
            color: msg.includes("successfully") ? "#4CAF50" : "#F93C65", fontWeight: 600,
          }}>{msg}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="inner-group inner-two-col">
            <label className="inner-label" htmlFor="name">Role Name *</label>
            <input id="name" type="text" value={name}
              onChange={e => setName(e.target.value)} required />
          </div>

          <div className="inner-group inner-two-col">
            <label className="inner-label">Permissions</label>
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
            <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
        <div className="inner-back">
          <a href="/admin/settings/roles">Back to list</a>
        </div>
      </div>
    </>
  );
}
