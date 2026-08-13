"use client";
import { useEffect, useState } from "react";
import { adminSettingService } from "@/services/admin.service";
import { useRouter } from "next/navigation";

export default function AccountCreatePage() {
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
      else setMsg(res.message ?? "Error");
    } catch { setMsg("Connection error."); }
    finally { setSaving(false); }
  };

  return (
    <>
      <h1 className="box-title">Create Admin Account</h1>
      <div className="section-8">
        {msg && (
          <div style={{
            gridColumn: "span 2", padding: "12px 16px", borderRadius: 8, marginBottom: 8,
            background: "#fff0f0", border: "1px solid #F93C65", color: "#F93C65", fontWeight: 600,
          }}>{msg}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="inner-group">
            <label className="inner-label" htmlFor="fullName">Full Name *</label>
            <input id="fullName" type="text" value={form.fullName} required
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="e.g. Le Van A" />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="email">Email *</label>
            <input id="email" type="email" value={form.email} required
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="e.g. admin@example.com" />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="password">Password *</label>
            <input id="password" type="password" value={form.password} required
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
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
          <div className="inner-group">
            <label className="inner-label" htmlFor="avatar">Avatar</label>
            <input id="avatar" type="file" accept="image/*"
              onChange={e => setAvatar(e.target.files?.[0] ?? null)} style={{ height: "auto", padding: "12px 22px" }} />
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={saving}>{saving ? "Creating..." : "Create"}</button>
          </div>
        </form>
        <div className="inner-back">
          <a href="/admin/settings/accounts">Back to list</a>
        </div>
      </div>
    </>
  );
}
