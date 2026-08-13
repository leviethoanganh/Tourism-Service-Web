"use client";
import { useEffect, useState } from "react";
import { adminOrderService } from "@/services/admin.service";
import { useRouter, useParams } from "next/navigation";

const STATUS_LIST = [
  { value: "pending",   label: "Pending"   },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

export default function OrderDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [order,   setOrder]   = useState<any>(null);
  const [status,  setStatus]  = useState("");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState("");

  useEffect(() => {
    adminOrderService.getDetail(id)
      .then(d => {
        const o = d.orderDetail ?? d.order ?? d;
        setOrder(o);
        setStatus(o.status ?? "pending");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg("");
    try {
      const res = await adminOrderService.update(id, { status });
      setMsg(res.code === "success" ? "Order updated successfully!" : (res.message ?? "Error"));
    } catch { setMsg("Connection error."); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;
  if (!order)  return <div style={{ padding: 30 }}>Order not found.</div>;

  return (
    <>
      <h1 className="box-title">Order Detail</h1>

      <div className="section-8">
        {msg && (
          <div style={{
            gridColumn: "span 2", padding: "12px 16px", borderRadius: 8, marginBottom: 8,
            background: msg.includes("successfully") ? "#f0fff4" : "#fff0f0",
            border: `1px solid ${msg.includes("successfully") ? "#4CAF50" : "#F93C65"}`,
            color: msg.includes("successfully") ? "#4CAF50" : "#F93C65", fontWeight: 600,
          }}>{msg}</div>
        )}

        <form onSubmit={handleSave}>
          <div className="inner-group">
            <label className="inner-label">Order Code</label>
            <input value={order.code ?? order._id?.slice(-8).toUpperCase()} readOnly style={{ background: "#eee" }} />
          </div>
          <div className="inner-group">
            <label className="inner-label">Customer Name</label>
            <input value={order.userInfo?.fullName ?? order.fullName ?? "—"} readOnly style={{ background: "#eee" }} />
          </div>
          <div className="inner-group">
            <label className="inner-label">Phone</label>
            <input value={order.userInfo?.phone ?? order.phone ?? "—"} readOnly style={{ background: "#eee" }} />
          </div>
          <div className="inner-group">
            <label className="inner-label">Total</label>
            <input value={`${(order.total ?? order.totalPrice ?? 0).toLocaleString("en-US")} VND`} readOnly style={{ background: "#eee" }} />
          </div>
          <div className="inner-group">
            <label className="inner-label">Payment Method</label>
            <input value={order.paymentMethodName ?? order.paymentMethod ?? "—"} readOnly style={{ background: "#eee" }} />
          </div>
          <div className="inner-group">
            <label className="inner-label">Payment Status</label>
            <input value={order.paymentStatusName ?? order.paymentStatus ?? "—"} readOnly style={{ background: "#eee" }} />
          </div>

          <div className="inner-group">
            <label className="inner-label" htmlFor="status">Order Status</label>
            <select id="status" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUS_LIST.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="inner-group inner-two-col">
            <label className="inner-label">Tours Ordered</label>
            <div className="tour-list" style={{ paddingTop: 8 }}>
              {(order.items ?? []).map((item: any, i: number) => (
                <div key={i} className="tour-item">
                  {item.avatar && <img src={item.avatar} className="inner-image" alt="" />}
                  <div className="inner-content">
                    <div className="inner-name">{item.name ?? item.tourId?.name}</div>
                    <div className="inner-desc">
                      <div>Adult: {item.quantityAdult ?? 0} × {(item.priceNewAdult ?? 0).toLocaleString("en-US")} VND</div>
                      <div>Children: {item.quantityChildren ?? 0} × {(item.priceNewChildren ?? 0).toLocaleString("en-US")} VND</div>
                      <div>Baby: {item.quantityBaby ?? 0} × {(item.priceNewBaby ?? 0).toLocaleString("en-US")} VND</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="inner-button inner-two-col">
            <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>

        <div className="inner-back">
          <a href="/admin/orders">← Back to Orders</a>
        </div>
      </div>
    </>
  );
}
