"use client";
import { useEffect, useState } from "react";
import { adminDashboardService } from "@/services/admin.service";
import { useTranslation } from "@/hooks/useTranslation";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    adminDashboardService.get()
      .then(d => setOverview(d.overview ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 30, fontFamily: "'Nunito Sans', sans-serif" }}>{t.common.loading}</div>;
  }

  const totalAdmin   = overview?.totalAdmin   ?? 0;
  const totalOrder   = overview?.totalOrder   ?? 0;
  const totalRevenue = overview?.totalRevenue ?? 0;

  return (
    <>
      <h1 className="box-title">{t.adminDashboard.title}</h1>

      {/* Section 1 — Stat cards */}
      <div className="section-1">
        <div className="inner-item">
          <div className="inner-icon">
            <img src="/admin/assets/images/section-1-icon-1.svg" alt="" />
          </div>
          <div className="inner-content">
            <div className="inner-title">{t.adminAccounts.title}</div>
            <div className="inner-number">{totalAdmin.toLocaleString("en-US")}</div>
          </div>
        </div>

        <div className="inner-item">
          <div className="inner-icon">
            <img src="/admin/assets/images/section-1-icon-2.svg" alt="" />
          </div>
          <div className="inner-content">
            <div className="inner-title">{t.adminDashboard.orders}</div>
            <div className="inner-number">{totalOrder.toLocaleString("en-US")}</div>
          </div>
        </div>

        <div className="inner-item">
          <div className="inner-icon">
            <img src="/admin/assets/images/section-1-icon-3.svg" alt="" />
          </div>
          <div className="inner-content">
            <div className="inner-title">{t.adminDashboard.revenue}</div>
            <div className="inner-number">
              {totalRevenue.toLocaleString("en-US")} VND
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 — Revenue chart */}
      <div className="section-2">
        <div className="inner-head">
          <h2 className="inner-title">{t.adminDashboard.revenueChart}</h2>
          <input className="inner-filter" type="month" />
        </div>
        <div className="inner-chart" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#bbb", fontWeight: 600, fontSize: 15,
        }}>
          {t.adminDashboard.chartComingSoon}
        </div>
      </div>

      {/* Section 3 — New orders placeholder */}
      <div className="section-3">
        <h2 className="inner-title-main">{t.adminDashboard.newOrders}</h2>

        <div className="table-1">
          <table>
            <thead>
              <tr>
                <th className="text-left">{t.adminOrders.colCode}</th>
                <th className="text-left">{t.adminOrders.colCustomerInfo}</th>
                <th className="text-left">{t.adminOrders.colTourList}</th>
                <th className="text-left">{t.adminOrders.colPayment}</th>
                <th className="text-left">{t.common.status}</th>
                <th className="text-right">{t.adminOrders.colOrderDate}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="text-center"
                    style={{ padding: "40px 0", color: "#bbb" }}>
                  {t.adminDashboard.noRecentOrders}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
