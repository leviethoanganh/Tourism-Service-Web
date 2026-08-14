"use client";
import { useEffect, useState, Suspense } from "react";
import { adminTourService } from "@/services/admin.service";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import T from "@/components/shared/T";

function TourListContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") || "1";
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const priceRange = searchParams.get("priceRange") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(keyword);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const buildQuery = (overrides: Record<string, string> = {}) => {
    const params: Record<string, string> = {
      page, keyword, status, category, priceRange, startDate, endDate, ...overrides,
    };
    const qs = Object.entries(params)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    return `/admin/tours${qs ? "?" + qs : ""}`;
  };

  const load = () => {
    setLoading(true);
    adminTourService
      .getList({ page, keyword, status, category, priceRange, startDate, endDate })
      .then(setData)
      .catch((err: any) => {
        if (err?.response?.status === 401) router.push("/admin/auth/login");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page, keyword, status, category, priceRange, startDate, endDate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildQuery({ keyword: search, page: "1" }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.adminTours.moveToTrashConfirm)) return;
    await adminTourService.softDelete(id);
    load();
  };

  const handleReset = () => {
    setSearch("");
    router.push("/admin/tours");
  };

  const handleFilterChange = (key: string, value: string) => {
    router.push(buildQuery({ [key]: value, page: "1" }));
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(buildQuery({ page: e.target.value }));
  };

  const pag = data?.pagination;
  const skip = pag?.skip ?? 0;
  const totalRecord = pag?.totalRecord ?? 0;
  const currentPage = pag?.currentPage ?? 1;
  const totalPage = pag?.totalPage ?? 1;
  const showingFrom = totalRecord === 0 ? 0 : skip + 1;
  const showingTo = Math.min(skip + (data?.tourList?.length ?? 0), totalRecord);
  const categoryList: any[] = data?.categoryList ?? [];

  return (
    <>
      <h1 className="box-title">{t.adminTours.title}</h1>

      {/* Section 4 — Filters */}
      <div className="section-4">
        <div className="inner-wrap">
          <div className="inner-item inner-label">
            <i className="fa-solid fa-filter"></i>
          </div>

          <div className="inner-item">
            <span>{t.adminTours.statusLabel}</span>
            <select value={status} onChange={(e) => handleFilterChange("status", e.target.value)}>
              <option value="">{t.adminTours.all}</option>
              <option value="active">{t.common.active}</option>
              <option value="inactive">{t.common.inactive}</option>
            </select>
          </div>

          <div className="inner-item">
            <span>{t.adminTours.categoryLabel}</span>
            <select value={category} onChange={(e) => handleFilterChange("category", e.target.value)}>
              <option value="">{t.adminTours.all}</option>
              {categoryList.map((c: any) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="inner-item">
            <span>{t.adminTours.priceLabel}</span>
            <select value={priceRange} onChange={(e) => handleFilterChange("priceRange", e.target.value)}>
              <option value="">{t.adminTours.all}</option>
              <option value="0-1000000">{t.adminTours.priceUnder1M}</option>
              <option value="1000000-5000000">{t.adminTours.price1to5M}</option>
              <option value="5000000-10000000">{t.adminTours.price5to10M}</option>
              <option value="10000000-99999999">{t.adminTours.priceOver10M}</option>
            </select>
          </div>

          <div className="inner-item">
            <span>{t.adminTours.fromLabel}</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          <div className="inner-item">
            <span>{t.adminTours.toLabel}</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>

          <div className="inner-item">
            <a className="inner-reset" onClick={handleReset} style={{ cursor: "pointer" }}>
              {t.common.reset}
            </a>
          </div>
        </div>
      </div>

      {/* Section 5 — Action bar */}
      <div className="section-5">
        <div className="inner-wrap">
          <div className="inner-change-status">
            <div className="inner-item">
              <span>{t.adminTours.selectedPrefix} ({selectedIds.length}):</span>
              <select defaultValue="">
                <option value="">{t.adminTours.actionPlaceholder}</option>
                <option value="active">{t.common.active}</option>
                <option value="inactive">{t.common.inactive}</option>
              </select>
            </div>
            <div className="inner-item">
              <button onClick={() => load()}>{t.common.apply}</button>
            </div>
          </div>

          <form className="inner-search" onSubmit={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder={t.adminTours.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className="inner-button-create">
            <Link href="/admin/tours/create">
              <i className="fa-solid fa-plus"></i> {t.adminTours.addTour}
            </Link>
          </div>

          <div className="inner-button-trash">
            <Link href="/admin/tours/trash">
              <i className="fa-solid fa-trash"></i> {t.adminTours.trash}
            </Link>
          </div>
        </div>
      </div>

      {/* Section 6 — Table */}
      <div className="section-6">
        {loading ? (
          <p>{t.common.loading}</p>
        ) : (
          <div className="table-2">
            <table>
              <thead>
                <tr>
                  <th className="text-center">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked ? (data?.tourList ?? []).map((t: any) => t._id) : []
                        )
                      }
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === (data?.tourList?.length ?? 0)
                      }
                    />
                  </th>
                  <th className="text-left">{t.adminTours.colTourName}</th>
                  <th className="text-center">{t.adminCategories.colAvatar}</th>
                  <th className="text-right">{t.adminTours.colPriceAdult}</th>
                  <th className="text-right">{t.adminTours.colPriceChildren}</th>
                  <th className="text-right">{t.adminTours.colPriceBaby}</th>
                  <th className="text-center">{t.adminTours.colStock}</th>
                  <th className="text-center">{t.common.status}</th>
                  <th className="text-center">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {(!data?.tourList || data.tourList.length === 0) && (
                  <tr>
                    <td colSpan={9} className="text-center">{t.adminTours.noToursFound}</td>
                  </tr>
                )}
                {data?.tourList?.map((tour: any) => (
                  <tr key={tour._id}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(tour._id)}
                        onChange={(e) =>
                          setSelectedIds((prev) =>
                            e.target.checked
                              ? [...prev, tour._id]
                              : prev.filter((x) => x !== tour._id)
                          )
                        }
                      />
                    </td>
                    <td className="text-left">{tour.name}</td>
                    <td className="text-center">
                      {tour.avatar && (
                        <img src={tour.avatar} alt={tour.name} className="inner-avatar" />
                      )}
                    </td>
                    <td className="text-right">
                      {(tour.priceNewAdult ?? tour.priceAdult ?? 0).toLocaleString("en-US")} ₫
                      {tour.priceNewAdult && tour.priceNewAdult !== tour.priceAdult && (
                        <div className="inner-small" style={{ textDecoration: "line-through", color: "#999" }}>
                          {(tour.priceAdult ?? 0).toLocaleString("en-US")} ₫
                        </div>
                      )}
                    </td>
                    <td className="text-right">
                      {(tour.priceNewChildren ?? tour.priceChildren ?? 0).toLocaleString("en-US")} ₫
                    </td>
                    <td className="text-right">
                      {(tour.priceNewBaby ?? tour.priceBaby ?? 0).toLocaleString("en-US")} ₫
                    </td>
                    <td className="text-center">
                      <span className="inner-small">
                        A:{tour.stockAdult ?? 0} C:{tour.stockChildren ?? 0} B:{tour.stockBaby ?? 0}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`tag ${tour.status === "active" ? "tag-green" : "tag-red"}`}>
                        {tour.status === "active" ? t.common.active : t.common.inactive}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="box-actions">
                        <Link href={`/admin/tours/${tour._id}`} className="inner-edit">
                          <i className="fa-solid fa-pen"></i>
                        </Link>
                        <a
                          className="inner-remove"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(tour._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 7 — Pagination */}
      {!loading && pag && (
        <div className="section-7">
          <span className="inner-label">
            {t.adminCommon.showingLabel} {showingFrom}-{showingTo} {t.adminCommon.ofLabel} {totalRecord}
          </span>
          {totalPage > 1 && (
            <select
              className="inner-pagination"
              value={String(currentPage)}
              onChange={handlePageChange}
            >
              {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
                <option key={p} value={String(p)}>
                  {t.adminCommon.pageLabel} {p}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={<p><T ns="common" k="loading" /></p>}>
      <TourListContent />
    </Suspense>
  );
}
