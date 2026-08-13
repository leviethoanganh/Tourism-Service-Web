"use client";
import { useEffect, useState } from "react";
import { adminSettingService } from "@/services/admin.service";
import { useRouter, useParams } from "next/navigation";

export default function AccountEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [roles,   setRoles]   = useState<any[]>([]);
  const [form,    setForm]    = useState({ fullName: "", email: "", role: "", status: "active" });
  const [avatar,  setAvatar]  = useState<File | null>(null);
  const [current, setCurrent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState("");

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
    setSaving(true); setMsg("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append("avatar", avatar);
      const res = await adminSettingService.updateAccount(id, fd);
      if (res.code === "success") setMsg("Account updated successfully!");
      else setMsg(res.message ?? "Error");
    } catch { setMsg("Connection error."); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;

  return (
    <>
      <h1 className="box-title">Edit Admin Account</h1>
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
          <div className="inner-group">
            <label className="inner-label" htmlFor="role">Role</label>
            <select id="role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              <option value="">-- Select role --</option>
              {roles.map((r: any) => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="status">Status</label>
            <select id="status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="initial">Pending Approval</option>
            </select>
          </div>
          <div className="inner-group inner-two-col">
            <label className="inner-label">Avatar</label>
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
            <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
        <div className="inner-back">
          <a href="/admin/settings/accounts">Back to list</a>
        </div>
      </div>
    </>
  );
}
