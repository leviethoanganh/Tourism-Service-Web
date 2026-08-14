"use client";
import { useEffect, useState } from "react";
import { adminOrderService } from "@/services/admin.service";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { Translations } from "@/i18n/types";

const getStatusList = (t: Translations) => [
  { value: "pending",   label: t.adminOrders.statusPending   },
  { value: "confirmed", label: t.adminOrders.statusConfirmed },
  { value: "cancelled", label: t.adminOrders.statusCancelled },
  { value: "completed", label: t.adminOrders.statusCompleted },
];

export default function OrderDetailPage() {
  const { t } = useTranslation();
  const STATUS_LIST = getStatusList(t);
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [order,   setOrder]   = useState<any>(null);
  const [status,  setStatus]  = useState("");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState("");
  const [success, setSuccess] = useState(false);

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
    setSaving(true); setMsg(""); setSuccess(false);
    try {
      const res = await adminOrderService.update(id, { status });
      if (res.code === "success") { setMsg(t.adminOrderDetail.updatedSuccess); setSuccess(true); }
      else setMsg(res.message ?? t.adminCategoryForm.errorGeneric);
    } catch { setMsg(t.common.connectionError); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: 30 }}>{t.common.loading}</div>;
  if (!order)  return <div style={{ padding: 30 }}>{t.adminOrderDetail.orderNotFound}</div>;

  return (
    <>
      <h1 className="box-title">{t.adminOrderDetail.title}</h1>

      <div className="section-8">
        {msg && (
          <div style={{
            gridColumn: "span 2", padding: "12px 16px", borderRadius: 8, marginBottom: 8,
            background: success ? "#f0fff4" : "#fff0f0",
            border: `1px solid ${success ? "#4CAF50" : "#F93C65"}`,
            color: success ? "#4CAF50" : "#F93C65", fontWeight: 600,
          }}>{msg}</div>
        )}

        <form onSubmit={handleSave}>
          <div className="inner-group">
            <label className="inner-label">{t.adminOrderDetail.orderCodeLabel}</label>
            <input value={order.code ?? order._id?.slice(-8).toUpperCase()} readOnly style={{ background: "#eee" }} />
          </div>
          <div className="inner-group">
            <label className="inner-label">{t.adminOrderDetail.customerNameLabel}</label>
            <input value={order.userInfo?.fullName ?? order.fullName ?? "—"} readOnly style={{ background: "#eee" }} />
          </div>
          <div className="inner-group">
            <label className="inner-label">{t.adminUsers.colPhone}</label>
            <input value={order.userInfo?.phone ?? order.phone ?? "—"} readOnly style={{ background: "#eee" }} />
          </div>
          <div className="inner-group">
            <label className="inner-label">{t.common.total}</label>
            <input value={`${(order.total ?? order.totalPrice ?? 0).toLocaleString("en-US")} VND`} readOnly style={{ background: "#eee" }} />
          </div>
          <div className="inner-group">
            <label className="inner-label">{t.adminOrderDetail.paymentMethodLabel}</label>
            <input value={order.paymentMethodName ?? order.paymentMethod ?? "—"} readOnly style={{ background: "#eee" }} />
          </div>
          <div className="inner-group">
            <label className="inner-label">{t.adminOrderDetail.paymentStatusLabel}</label>
            <input value={order.paymentStatusName ?? order.paymentStatus ?? "—"} readOnly style={{ background: "#eee" }} />
          </div>

          <div className="inner-group">
            <label className="inner-label" htmlFor="status">{t.adminOrderDetail.orderStatusLabel}</label>
            <select id="status" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUS_LIST.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="inner-group inner-two-col">
            <label className="inner-label">{t.adminOrderDetail.toursOrderedLabel}</label>
            <div className="tour-list" style={{ paddingTop: 8 }}>
              {(order.items ?? []).map((item: any, i: number) => (
                <div key={i} className="tour-item">
                  {item.avatar && <img src={item.avatar} className="inner-image" alt="" />}
                  <div className="inner-content">
                    <div className="inner-name">{item.name ?? item.tourId?.name}</div>
                    <div className="inner-desc">
                      <div>{t.common.adult}: {item.quantityAdult ?? 0} × {(item.priceNewAdult ?? 0).toLocaleString("en-US")} VND</div>
                      <div>{t.common.children}: {item.quantityChildren ?? 0} × {(item.priceNewChildren ?? 0).toLocaleString("en-US")} VND</div>
                      <div>{t.common.baby}: {item.quantityBaby ?? 0} × {(item.priceNewBaby ?? 0).toLocaleString("en-US")} VND</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="inner-button inner-two-col">
            <button type="submit" disabled={saving}>{saving ? t.common.saving : t.common.saveChanges}</button>
          </div>
        </form>

        <div className="inner-back">
          <a href="/admin/orders">{t.adminOrderDetail.backToOrders}</a>
        </div>
      </div>
    </>
  );
}
