"use client";
import { useEffect, useState } from "react";
import { adminCategoryService } from "@/services/admin.service";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export default function CategoryEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [form, setForm]   = useState({ name:"", parent:"", position:"", status:"active" });
  const [currentAvatar, setCurrentAvatar] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      adminCategoryService.getDetail(id),
      adminCategoryService.getFormData(),
    ]).then(([det, fd]) => {
      const c = det.categoryDetail ?? det.category ?? det;
      setForm({
        name: c.name ?? "", parent: c.parent?._id ?? c.parent ?? "",
        position: c.position ?? "", status: c.status ?? "active",
      });
      setCurrentAvatar(c.avatar ?? "");
      setCategoryList((fd.categoryList ?? []).filter((cat: any) => cat._id !== id));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg(""); setSuccess(false);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append("avatar", avatar);
      const res = await adminCategoryService.update(id, fd);
      if (res.code === "success") { setMsg(t.adminCategoryForm.updatedSuccess); setSuccess(true); }
      else setMsg(res.message ?? t.adminCategoryForm.errorGeneric);
    } catch { setMsg(t.common.connectionError); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 30 }}>{t.common.loading}</div>;

  return (
    <>
      <h1 className="box-title">{t.adminCategoryForm.editTitle}</h1>
      <div className="section-8">
        {msg && <div style={{ gridColumn:"span 2", padding:"12px 16px", borderRadius:8, background: success?"#f0fff4":"#fff0f0", border:`1px solid ${success?"#4CAF50":"#F93C65"}`, color: success?"#4CAF50":"#F93C65", fontWeight:600 }}>{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="inner-group">
            <label className="inner-label" htmlFor="name">{t.adminCategoryForm.categoryNameLabel}</label>
            <input id="name" type="text" value={form.name} required
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="parent">{t.adminCategoryForm.parentCategoryLabel}</label>
            <select id="parent" value={form.parent} onChange={e => setForm(p => ({ ...p, parent: e.target.value }))}>
              <option value="">{t.common.noParent}</option>
              {categoryList.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="position">{t.adminCategoryForm.positionLabel}</label>
            <input id="position" type="number" value={form.position}
              onChange={e => setForm(p => ({ ...p, position: e.target.value }))} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="status">{t.common.status}</label>
            <select id="status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              <option value="active">{t.common.active}</option>
              <option value="inactive">{t.common.inactive}</option>
            </select>
          </div>
          <div className="inner-group inner-two-col">
            <label className="inner-label">{t.adminCategoryForm.avatarLabel}</label>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              {currentAvatar && <img src={currentAvatar} alt="" style={{ width:60, height:60, objectFit:"cover", borderRadius:6 }} />}
              <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files?.[0] ?? null)} style={{ height:"auto", padding:"12px 22px" }} />
            </div>
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={saving}>{saving ? t.common.saving : t.common.saveChanges}</button>
          </div>
        </form>
        <div className="inner-back">
          <a href="/admin/categories">{t.common.backToList}</a>
        </div>
      </div>
    </>
  );
}
