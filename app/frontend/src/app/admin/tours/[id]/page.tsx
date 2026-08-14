"use client";
import { useEffect, useState } from "react";
import { adminTourService } from "@/services/admin.service";
import { useRouter, useParams } from "next/navigation";
import ScheduleEditor, { ScheduleItem } from "../_components/ScheduleEditor";
import { useTranslation } from "@/hooks/useTranslation";

export default function TourEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [formData, setFormData]         = useState<any>({});
  const [locations, setLocations]       = useState<string[]>([]);
  const [schedules, setSchedules]       = useState<ScheduleItem[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [cityList, setCityList]         = useState<any[]>([]);
  const [avatar, setAvatar]             = useState<File | null>(null);
  const [images, setImages]             = useState<FileList | null>(null);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [msg, setMsg]                   = useState("");
  const [success, setSuccess]           = useState(false);

  useEffect(() => {
    Promise.all([
      adminTourService.getDetail(id),
      adminTourService.getFormData(),
    ]).then(([det, fd]) => {
      const tourData = det.tour ?? det;
      setFormData({
        name: tourData.name ?? "", category: tourData.category?._id ?? tourData.category ?? "", position: tourData.position ?? "",
        status: tourData.status ?? "active", time: tourData.time ?? "", vehicle: tourData.vehicle ?? "",
        departureDate: tourData.departureDate ? tourData.departureDate.slice(0, 10) : "",
        information: tourData.information ?? "",
        priceAdult: tourData.priceAdult ?? "", priceChildren: tourData.priceChildren ?? "", priceBaby: tourData.priceBaby ?? "",
        priceNewAdult: tourData.priceNewAdult ?? "", priceNewChildren: tourData.priceNewChildren ?? "", priceNewBaby: tourData.priceNewBaby ?? "",
        stockAdult: tourData.stockAdult ?? "", stockChildren: tourData.stockChildren ?? "", stockBaby: tourData.stockBaby ?? "",
        currentAvatar: tourData.avatar ?? "",
      });
      setLocations(tourData.locations ?? []);
      setSchedules(tourData.schedules ?? []);
      setCategoryList(fd.categoryList ?? []);
      setCityList(fd.cityList ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const set = (k: string, v: string) => setFormData((p: any) => ({ ...p, [k]: v }));
  const toggleLocation = (lid: string) =>
    setLocations(prev => prev.includes(lid) ? prev.filter(i => i !== lid) : [...prev, lid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg(""); setSuccess(false);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (k !== "currentAvatar") fd.append(k, v as string); });
      fd.append("locations", JSON.stringify(locations));
      fd.append("schedules", JSON.stringify(schedules));
      if (avatar) fd.append("avatar", avatar);
      if (images) Array.from(images).forEach(img => fd.append("images", img));
      const res = await adminTourService.update(id, fd);
      if (res.code === "success") { setMsg(t.adminTourForm.updatedSuccess); setSuccess(true); }
      else setMsg(res.message ?? t.adminCategoryForm.errorGeneric);
    } catch { setMsg(t.common.connectionError); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 30 }}>{t.common.loading}</div>;

  return (
    <>
      <h1 className="box-title">{t.adminTourForm.editTitle}</h1>
      <div className="section-8">
        {msg && <div style={{ gridColumn:"span 2", padding:"12px 16px", borderRadius:8, background: success ? "#f0fff4":"#fff0f0", border:`1px solid ${success?"#4CAF50":"#F93C65"}`, color: success?"#4CAF50":"#F93C65", fontWeight:600, marginBottom:8 }}>{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="inner-group">
            <label className="inner-label" htmlFor="name">{t.adminTourForm.tourNameLabel}</label>
            <input id="name" type="text" value={formData.name ?? ""} onChange={e => set("name", e.target.value)} required />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="category">{t.adminTourForm.categoryLabel}</label>
            <select id="category" value={formData.category ?? ""} onChange={e => set("category", e.target.value)}>
              <option value="">{t.adminTourForm.selectCategoryPlaceholder}</option>
              {categoryList.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="position">{t.adminCategoryForm.positionLabel}</label>
            <input id="position" type="number" value={formData.position ?? ""} onChange={e => set("position", e.target.value)} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="status">{t.common.status}</label>
            <select id="status" value={formData.status ?? "active"} onChange={e => set("status", e.target.value)}>
              <option value="active">{t.common.active}</option>
              <option value="inactive">{t.common.inactive}</option>
            </select>
          </div>
          <div className="inner-group inner-two-col">
            <label className="inner-label">{t.adminCategoryForm.avatarLabel}</label>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              {formData.currentAvatar && <img src={formData.currentAvatar} alt="" style={{ width:80, height:60, objectFit:"cover", borderRadius:6 }} />}
              <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files?.[0] ?? null)} style={{ height:"auto", padding:"12px 22px" }} />
            </div>
          </div>
          <div className="inner-group inner-two-col">
            <label className="inner-label">{t.adminTourForm.imageListLabel}</label>
            <input type="file" accept="image/*" multiple onChange={e => setImages(e.target.files)} style={{ height:"auto", padding:"12px 22px" }} />
          </div>
          <div className="inner-group">
            <label className="inner-label">{t.adminTourForm.originalPriceLabel}</label>
            <div className="inner-input-list">
              {[[t.common.adult,"priceAdult"],[t.common.children,"priceChildren"],[t.common.baby,"priceBaby"]].map(([l,k]) => (
                <div key={k} className="inner-input-item"><label>{l}</label><input type="number" value={formData[k] ?? ""} onChange={e => set(k, e.target.value)} /></div>
              ))}
            </div>
          </div>
          <div className="inner-group">
            <label className="inner-label">{t.adminTourForm.salePriceLabel}</label>
            <div className="inner-input-list">
              {[[t.common.adult,"priceNewAdult"],[t.common.children,"priceNewChildren"],[t.common.baby,"priceNewBaby"]].map(([l,k]) => (
                <div key={k} className="inner-input-item"><label>{l}</label><input type="number" value={formData[k] ?? ""} onChange={e => set(k, e.target.value)} /></div>
              ))}
            </div>
          </div>
          <div className="inner-group">
            <label className="inner-label">{t.adminTourForm.remainingStockLabel}</label>
            <div className="inner-input-list">
              {[[t.common.adult,"stockAdult"],[t.common.children,"stockChildren"],[t.common.baby,"stockBaby"]].map(([l,k]) => (
                <div key={k} className="inner-input-item"><label>{l}</label><input type="number" value={formData[k] ?? ""} onChange={e => set(k, e.target.value)} /></div>
              ))}
            </div>
          </div>
          <div className="inner-group inner-two-col">
            <label className="inner-label">{t.adminTourForm.departureLocationsLabel}</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"8px 20px", paddingTop:8 }}>
              {cityList.map((c: any) => (
                <label key={c._id} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontWeight:600, fontSize:14, color:"#606060" }}>
                  <input type="checkbox" checked={locations.includes(c._id)} onChange={() => toggleLocation(c._id)} style={{ width:16, height:16 }} />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="time">{t.common.duration}</label>
            <input id="time" type="text" value={formData.time ?? ""} onChange={e => set("time", e.target.value)} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="vehicle">{t.adminTourForm.transportLabel}</label>
            <input id="vehicle" type="text" value={formData.vehicle ?? ""} onChange={e => set("vehicle", e.target.value)} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="departureDate">{t.common.departureDate}</label>
            <input id="departureDate" type="date" value={formData.departureDate ?? ""} onChange={e => set("departureDate", e.target.value)} />
          </div>
          <div className="inner-group inner-two-col">
            <label className="inner-label" htmlFor="information">{t.tourDetail.tourInformation}</label>
            <textarea id="information" value={formData.information ?? ""} onChange={e => set("information", e.target.value)} />
          </div>
          <ScheduleEditor value={schedules} onChange={setSchedules} />
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={saving}>{saving ? t.common.saving : t.common.saveChanges}</button>
          </div>
        </form>
        <div className="inner-back">
          <a href="/admin/tours">{t.common.backToList}</a>
        </div>
      </div>
    </>
  );
}
