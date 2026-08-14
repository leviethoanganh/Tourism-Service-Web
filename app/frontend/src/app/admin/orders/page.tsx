"use client";
import { useEffect, useState, Suspense } from "react";
import { adminOrderService } from "@/services/admin.service";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Translations } from "@/i18n/types";
import T from "@/components/shared/T";

const getStatusList = (t: Translations) => [
  { value: "pending",   label: t.adminOrders.statusPending,   color: "tag-orange" },
  { value: "confirmed", label: t.adminOrders.statusConfirmed, color: "tag-green"  },
  { value: "cancelled", label: t.adminOrders.statusCancelled, color: "tag-red"    },
  { value: "completed", label: t.adminOrders.statusCompleted, color: "tag-green"  },
];
const PAYMENT_METHODS  = ["Bank Transfer", "Cash", "MoMo", "VNPay", "ZaloPay"];
const PAYMENT_STATUSES = ["Unpaid", "Paid", "Refunded"];

function OrderListContent() {
  const { t } = useTranslation();
  const STATUS_LIST = getStatusList(t);
  const paymentMethodLabel = (m: string): string => {
    const map: Record<string, string> = { "Bank Transfer": t.adminOrders.paymentBankTransfer, "Cash": t.adminOrders.paymentCash };
    return map[m] ?? m;
  };
  const paymentStatusLabel = (s: string): string => {
    const map: Record<string, string> = {
      "Unpaid": t.adminOrders.paymentUnpaid, "Paid": t.adminOrders.paymentPaid, "Refunded": t.adminOrders.paymentRefunded,
    };
    return map[s] ?? s;
  };
  const router = useRouter();
  const sp = useSearchParams();

  const page          = sp.get("page") || "1";
  const keyword       = sp.get("keyword") || "";
  const status        = sp.get("status") || "";
  const startDate     = sp.get("startDate") || "";
  const endDate       = sp.get("endDate") || "";
  const paymentMethod = sp.get("paymentMethod") || "";
  const paymentStatus = sp.get("paymentStatus") || "";

  const [data, setData]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(keyword);

  const buildQuery = (overrides: Record<string, string> = {}) => {
    const p: Record<string, string> = {
      page, keyword, status, startDate, endDate, paymentMethod, paymentStatus, ...overrides,
    };
    const qs = Object.entries(p).filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
    return `/admin/orders${qs ? "?" + qs : ""}`;
  };

  const load = () => {
    setLoading(true);
    adminOrderService.getList({ page, keyword, status, startDate, endDate, paymentMethod, paymentStatus })
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, keyword, status, startDate, endDate, paymentMethod, paymentStatus]);

  const pushParam = (key: string, value: string) =>
    router.push(buildQuery({ [key]: value, page: "1" }));

  const pag         = data?.pagination;
  const list        = data?.orderList ?? [];
  const skip        = pag?.skip ?? 0;
  const totalRecord = pag?.totalRecord ?? list.length;
  const currentPage = pag?.currentPage ?? parseInt(page);
  const totalPage   = pag?.totalPage ?? 1;
  const showFrom    = totalRecord === 0 ? 0 : skip + 1;
  const showTo      = Math.min(skip + list.length, totalRecord);

  return (
    <>
      <h1 className="box-title">{t.adminOrders.title}</h1>

      {/* Section 4 */}
      <div className="section-4">
        <div className="inner-wrap">
          <div className="inner-item inner-label">
            <i className="fa-solid fa-filter" />
          </div>
          <div className="inner-item">
            <select value={status} onChange={e => pushParam("status", e.target.value)}>
              <option value="">{t.adminOrders.statusPlaceholder}</option>
              {STATUS_LIST.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="inner-item inner-date">
            <input type="date" value={startDate} onChange={e => pushParam("startDate", e.target.value)} />
            <span>-</span>
            <input type="date" value={endDate} onChange={e => pushParam("endDate", e.target.value)} />
          </div>
          <div className="inner-item">
            <select value={paymentMethod} onChange={e => pushParam("paymentMethod", e.target.value)}>
              <option value="">{t.adminOrders.paymentMethodPlaceholder}</option>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{paymentMethodLabel(m)}</option>)}
            </select>
          </div>
          <div className="inner-item">
            <select value={paymentStatus} onChange={e => pushParam("paymentStatus", e.target.value)}>
              <option value="">{t.adminOrders.paymentStatusPlaceholder}</option>
              {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{paymentStatusLabel(s)}</option>)}
            </select>
          </div>
          <div className="inner-item inner-reset">
            <a style={{ cursor: "pointer" }} onClick={() => router.push("/admin/orders")}>
              <i className="fa-solid fa-rotate-left" />
            </a>
          </div>
        </div>
      </div>

      {/* Section 5 */}
      <div className="section-5">
        <div className="inner-wrap">
          <form className="inner-search" onSubmit={e => { e.preventDefault(); router.push(buildQuery({ keyword: search, page: "1" })); }}>
            <i className="fa-solid fa-magnifying-glass" />
            <input type="text" placeholder={t.adminOrders.searchPlaceholder} value={search}
              onChange={e => setSearch(e.target.value)} />
          </form>
        </div>
      </div>

      {/* Section 6 */}
      <div className="section-6">
        {loading ? <p style={{ padding: 20 }}>{t.common.loading}</p> : (
          <div className="table-2">
            <table>
              <thead>
                <tr>
                  <th className="text-left">{t.adminOrders.colCode}</th>
                  <th className="text-left">{t.adminOrders.colCustomerInfo}</th>
                  <th className="text-left">{t.adminOrders.colTourList}</th>
                  <th className="text-left">{t.adminOrders.colPayment}</th>
                  <th className="text-left">{t.common.status}</th>
                  <th className="text-right">{t.adminOrders.colOrderDate}</th>
                  <th className="text-left">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0
                  ? <tr><td colSpan={7} className="text-center" style={{ padding: 30, color: "#bbb" }}>{t.adminOrders.noOrdersFound}</td></tr>
                  : list.map((o: any) => {
                    const d  = new Date(o.createdAt ?? Date.now());
                    const st = STATUS_LIST.find(s => s.value === o.status);
                    return (
                      <tr key={o._id}>
                        <td className="text-left">
                          <span className="text-primary">{o.code ?? o._id?.slice(-8).toUpperCase()}</span>
                        </td>
                        <td className="text-left">
                          <div>{o.userInfo?.fullName ?? o.fullName ?? "—"}</div>
                          <div className="inner-small">{o.userInfo?.phone ?? o.phone ?? ""}</div>
                          {(o.userInfo?.note ?? o.note) && <div className="inner-small">{o.userInfo?.note ?? o.note}</div>}
                        </td>
                        <td className="text-left">
                          <div className="tour-list">
                            {(o.items ?? []).map((item: any, idx: number) => (
                              <div key={idx} className="tour-item">
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
                        </td>
                        <td className="text-left">
                          <div>{t.common.subtotal}: {(o.subTotal ?? o.totalPrice ?? 0).toLocaleString("en-US")} VND</div>
                          {o.discount > 0 && <div className="inner-small">{t.common.discount}: -{o.discount.toLocaleString("en-US")} VND</div>}
                          <div>{t.common.total}: {(o.total ?? o.totalPrice ?? 0).toLocaleString("en-US")} VND</div>
                          <div className="inner-small">{t.adminOrders.methodLabel} {o.paymentMethodName ?? o.paymentMethod ?? "—"}</div>
                          <div className="inner-small">{t.adminOrders.paymentLabel} {o.paymentStatusName ?? o.paymentStatus ?? "—"}</div>
                        </td>
                        <td className="text-left">
                          <span className={`tag ${st?.color ?? ""}`}>{st?.label ?? o.status}</span>
                        </td>
                        <td className="text-right">
                          <div>{d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
                          <div className="inner-small">{d.toLocaleDateString("vi-VN")}</div>
                        </td>
                        <td className="text-left">
                          <div className="box-actions">
                            <Link href={`/admin/orders/${o._id}`} className="inner-edit">
                              <i className="fa-solid fa-pen-to-square" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 7 */}
      {!loading && totalRecord > 0 && (
        <div className="section-7">
          <span className="inner-label">{t.adminCommon.showingLabel} {showFrom}–{showTo} {t.adminCommon.ofLabel} {totalRecord}</span>
          <select className="inner-pagination" value={currentPage}
            onChange={e => router.push(buildQuery({ page: e.target.value }))}>
            {Array.from({ length: totalPage }, (_, i) => i + 1).map(p =>
              <option key={p} value={p}>{t.adminCommon.pageLabel} {p}</option>
            )}
          </select>
        </div>
      )}
    </>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}><T ns="common" k="loading" /></div>}>
      <OrderListContent />
    </Suspense>
  );
}
