"use client";
import { useEffect, useState } from "react";
import { adminDashboardService } from "@/services/admin.service";

export default function DashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    adminDashboardService.get()
      .then(d => setOverview(d.overview ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 30, fontFamily: "'Nunito Sans', sans-serif" }}>Loading...</div>;
  }

  const totalAdmin   = overview?.totalAdmin   ?? 0;
  const totalOrder   = overview?.totalOrder   ?? 0;
  const totalRevenue = overview?.totalRevenue ?? 0;

  return (
    <>
      <h1 className="box-title">Dashboard</h1>

      {/* Section 1 — Stat cards */}
      <div className="section-1">
        <div className="inner-item">
          <div className="inner-icon">
            <img src="/admin/assets/images/section-1-icon-1.svg" alt="" />
          </div>
          <div className="inner-content">
            <div className="inner-title">Admin Accounts</div>
            <div className="inner-number">{totalAdmin.toLocaleString("en-US")}</div>
          </div>
        </div>

        <div className="inner-item">
          <div className="inner-icon">
            <img src="/admin/assets/images/section-1-icon-2.svg" alt="" />
          </div>
          <div className="inner-content">
            <div className="inner-title">Orders</div>
            <div className="inner-number">{totalOrder.toLocaleString("en-US")}</div>
          </div>
        </div>

        <div className="inner-item">
          <div className="inner-icon">
            <img src="/admin/assets/images/section-1-icon-3.svg" alt="" />
          </div>
          <div className="inner-content">
            <div className="inner-title">Revenue</div>
            <div className="inner-number">
              {totalRevenue.toLocaleString("en-US")} VND
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 — Revenue chart */}
      <div className="section-2">
        <div className="inner-head">
          <h2 className="inner-title">Revenue Chart</h2>
          <input className="inner-filter" type="month" />
        </div>
        <div className="inner-chart" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#bbb", fontWeight: 600, fontSize: 15,
        }}>
          Chart coming soon
        </div>
      </div>

      {/* Section 3 — New orders placeholder */}
      <div className="section-3">
        <h2 className="inner-title-main">New Orders</h2>

        <div className="table-1">
          <table>
            <thead>
              <tr>
                <th className="text-left">Code</th>
                <th className="text-left">Customer Info</th>
                <th className="text-left">Tour List</th>
                <th className="text-left">Payment</th>
                <th className="text-left">Status</th>
                <th className="text-right">Order Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="text-center"
                    style={{ padding: "40px 0", color: "#bbb" }}>
                  No recent orders
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
