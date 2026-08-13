"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { orderService } from "@/services/order.service";
import { Order } from "@/types";

const fmt = (price: number) => price.toLocaleString("vi-VN");

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode") || "";
  const phone = searchParams.get("phone") || "";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderCode || !phone) { setError(true); setLoading(false); return; }
    orderService
      .getSuccess(orderCode, phone)
      .then((d) => setOrder(d.order))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [orderCode, phone]);

  if (loading) return <div style={{ textAlign: "center", padding: "80px 0" }}>Loading...</div>;

  if (error || !order) {
    return (
      <div className="section-12">
        <div className="container">
          <div className="inner-wrap" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>❌</p>
            <h2 style={{ marginBottom: "16px" }}>Order not found</h2>
            <Link className="button-outline" href="/">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-12">
      <div className="container">
        <div className="inner-wrap">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
            <h1 className="inner-title-main" style={{ color: "var(--color-primary)" }}>
              Tour Booked Successfully!
            </h1>
            <p style={{ color: "#666", marginTop: "8px" }}>
              Order Code: <strong>{order.code}</strong>
            </p>
          </div>

          <div className="inner-title-main">Order Information</div>
          <div className="inner-list-group">
            <div className="inner-group">
              <div style={{ fontSize: "14px", color: "#5D5E60", marginBottom: "4px" }}>Customer</div>
              <div style={{ fontWeight: 500 }}>{order.fullName}</div>
            </div>
            <div className="inner-group">
              <div style={{ fontSize: "14px", color: "#5D5E60", marginBottom: "4px" }}>Phone</div>
              <div style={{ fontWeight: 500 }}>{order.phone}</div>
            </div>
            <div className="inner-group">
              <div style={{ fontSize: "14px", color: "#5D5E60", marginBottom: "4px" }}>Booked At</div>
              <div>{order.createdAtFormat}</div>
            </div>
            <div className="inner-group">
              <div style={{ fontSize: "14px", color: "#5D5E60", marginBottom: "4px" }}>Payment</div>
              <div>{order.paymentMethodName}</div>
            </div>
            <div className="inner-group">
              <div style={{ fontSize: "14px", color: "#5D5E60", marginBottom: "4px" }}>Payment Status</div>
              <div style={{ color: order.paymentStatus === "paid" ? "green" : "orange" }}>
                {order.paymentStatusName}
              </div>
            </div>
            <div className="inner-group">
              <div style={{ fontSize: "14px", color: "#5D5E60", marginBottom: "4px" }}>Order Status</div>
              <div>{order.statusName}</div>
            </div>
          </div>

          <div className="inner-title-main">Tour Details</div>
          {order.items.map((item, i) => (
            <div key={i} className="inner-tour-item" style={{ borderBottom: "1px solid #F2F2F2", paddingBottom: "15px", marginBottom: "15px", display: "flex", gap: "14px" }}>
              {item.avatar && (
                <div style={{ width: "120px", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                  <img src={item.avatar} alt={item.name} style={{ width: "100%", height: "90px", objectFit: "cover" }} />
                </div>
              )}
              <div>
                <div style={{ fontWeight: 600, marginBottom: "8px" }}>{item.name}</div>
                {item.departureDateFormat && (
                  <div style={{ fontSize: "14px", color: "#8C8C8C" }}>📅 {item.departureDateFormat}</div>
                )}
                {item.locationFromName && (
                  <div style={{ fontSize: "14px", color: "#8C8C8C" }}>📍 {item.locationFromName}</div>
                )}
                <div style={{ fontSize: "14px", color: "#8C8C8C", marginTop: "4px" }}>
                  {item.quantityAdult > 0 && <span>Adults: {item.quantityAdult} | </span>}
                  {item.quantityChildren > 0 && <span>Children: {item.quantityChildren} | </span>}
                  {item.quantityBaby > 0 && <span>Baby: {item.quantityBaby}</span>}
                </div>
              </div>
            </div>
          ))}

          <div className="inner-list-price">
            <div className="inner-item">
              <div className="inner-label">Subtotal:</div>
              <div className="inner-price">{fmt(order.subTotal)} VND</div>
            </div>
            {order.discount > 0 && (
              <div className="inner-item">
                <div className="inner-label">Discount:</div>
                <div className="inner-price" style={{ color: "green" }}>-{fmt(order.discount)} VND</div>
              </div>
            )}
            <div className="inner-item">
              <div className="inner-label">Total:</div>
              <div className="inner-price-highlight">{fmt(order.total)} VND</div>
            </div>
          </div>

          <div className="inner-button">
            <Link href="/" style={{ display: "inline-block" }}>
              <button>CONTINUE EXPLORING</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
