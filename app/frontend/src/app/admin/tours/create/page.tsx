"use client";
import { useEffect, useState } from "react";
import { adminTourService } from "@/services/admin.service";
import { useRouter } from "next/navigation";

export default function TourCreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({ name:"", category:"", position:"", status:"active", time:"", vehicle:"", departureDate:"", information:"", priceAdult:"", priceChildren:"", priceBaby:"", priceNewAdult:"", priceNewChildren:"", priceNewBaby:"", stockAdult:"", stockChildren:"", stockBaby:"" });
  const [locations, setLocations]   = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [cityList, setCityList]         = useState<any[]>([]);
  const [avatar, setAvatar]             = useState<File | null>(null);
  const [images, setImages]             = useState<FileList | null>(null);
  const [saving, setSaving]             = useState(false);
  const [msg, setMsg]                   = useState("");

  useEffect(() => {
    adminTourService.getFormData()
      .then(d => { setCategoryList(d.categoryList ?? []); setCityList(d.cityList ?? []); })
      .catch(() => {});
  }, []);

  const set = (k: string, v: string) => setFormData((p: any) => ({ ...p, [k]: v }));

  const toggleLocation = (id: string) =>
    setLocations(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg("");
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v as string));
      fd.append("locations", JSON.stringify(locations));
      if (avatar) fd.append("avatar", avatar);
      if (images) Array.from(images).forEach(img => fd.append("images", img));
      const res = await adminTourService.create(fd);
      if (res.code === "success") router.push("/admin/tours");
      else setMsg(res.message ?? "Error");
    } catch { setMsg("Connection error."); }
    finally { setSaving(false); }
  };

  return (
    <>
      <h1 className="box-title">Create Tour</h1>
      <div className="section-8">
        {msg && <div style={{ gridColumn:"span 2", padding:"12px 16px", borderRadius:8, background:"#fff0f0", border:"1px solid #F93C65", color:"#F93C65", fontWeight:600, marginBottom:8 }}>{msg}</div>}
        <form id="tour-create-form" onSubmit={handleSubmit}>
          <div className="inner-group">
            <label className="inner-label" htmlFor="name">Tour Name *</label>
            <input id="name" type="text" value={formData.name} onChange={e => set("name", e.target.value)} required />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="category">Category</label>
            <select id="category" value={formData.category} onChange={e => set("category", e.target.value)}>
              <option value="">-- Select category --</option>
              {categoryList.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="position">Position</label>
            <input id="position" type="number" value={formData.position} onChange={e => set("position", e.target.value)} />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="status">Status</label>
            <select id="status" value={formData.status} onChange={e => set("status", e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="inner-group inner-two-col">
            <label className="inner-label">Avatar</label>
            <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files?.[0] ?? null)} style={{ height:"auto", padding:"12px 22px" }} />
          </div>
          <div className="inner-group inner-two-col">
            <label className="inner-label">Image List</label>
            <input type="file" accept="image/*" multiple onChange={e => setImages(e.target.files)} style={{ height:"auto", padding:"12px 22px" }} />
          </div>
          <div className="inner-group">
            <label className="inner-label">Original Price</label>
            <div className="inner-input-list">
              {[["Adult","priceAdult"],["Children","priceChildren"],["Baby","priceBaby"]].map(([l,k]) => (
                <div key={k} className="inner-input-item">
                  <label>{l}</label>
                  <input type="number" value={formData[k]} onChange={e => set(k, e.target.value)} placeholder="0" />
                </div>
              ))}
            </div>
          </div>
          <div className="inner-group">
            <label className="inner-label">Sale Price</label>
            <div className="inner-input-list">
              {[["Adult","priceNewAdult"],["Children","priceNewChildren"],["Baby","priceNewBaby"]].map(([l,k]) => (
                <div key={k} className="inner-input-item">
                  <label>{l}</label>
                  <input type="number" value={formData[k]} onChange={e => set(k, e.target.value)} placeholder="0" />
                </div>
              ))}
            </div>
          </div>
          <div className="inner-group">
            <label className="inner-label">Remaining Stock</label>
            <div className="inner-input-list">
              {[["Adult","stockAdult"],["Children","stockChildren"],["Baby","stockBaby"]].map(([l,k]) => (
                <div key={k} className="inner-input-item">
                  <label>{l}</label>
                  <input type="number" value={formData[k]} onChange={e => set(k, e.target.value)} placeholder="0" />
                </div>
              ))}
            </div>
          </div>
          <div className="inner-group inner-two-col">
            <label className="inner-label">Departure Locations</label>
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
            <label className="inner-label" htmlFor="time">Duration</label>
            <input id="time" type="text" value={formData.time} onChange={e => set("time", e.target.value)} placeholder="e.g. 3 days 2 nights" />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="vehicle">Transport</label>
            <input id="vehicle" type="text" value={formData.vehicle} onChange={e => set("vehicle", e.target.value)} placeholder="e.g. Airplane, Bus" />
          </div>
          <div className="inner-group">
            <label className="inner-label" htmlFor="departureDate">Departure Date</label>
            <input id="departureDate" type="date" value={formData.departureDate} onChange={e => set("departureDate", e.target.value)} />
          </div>
          <div className="inner-group inner-two-col">
            <label className="inner-label" htmlFor="information">Tour Information</label>
            <textarea id="information" value={formData.information} onChange={e => set("information", e.target.value)} />
          </div>
          <div className="inner-button inner-two-col">
            <button type="submit" disabled={saving}>{saving ? "Creating..." : "Create"}</button>
          </div>
        </form>
        <div className="inner-back">
          <a href="/admin/tours">Back to list</a>
        </div>
      </div>
    </>
  );
}
