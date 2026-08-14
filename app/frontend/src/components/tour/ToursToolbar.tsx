"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  sortBy: string;
  totalRecord: number;
}

export default function ToursToolbar({ sortBy, totalRecord }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const openFilter = () => {
    document.getElementById("tour-filter-sidebar")?.classList.add("active");
  };

  return (
    <>
      <div className="inner-sort">
        <div className="inner-label">{t.toolbar.sortBy}</div>
        <button
          className={sortBy === "price-asc" ? "active" : ""}
          onClick={() => setSort("price-asc")}
        >
          {t.toolbar.priceLowToHigh}
          <i className="fa-solid fa-circle-arrow-up"></i>
        </button>
        <button
          className={sortBy === "price-desc" ? "active" : ""}
          onClick={() => setSort("price-desc")}
        >
          {t.toolbar.priceHighToLow}
          <i className="fa-solid fa-circle-arrow-down"></i>
        </button>
        <button
          className={!sortBy || sortBy === "hot" ? "active" : ""}
          onClick={() => setSort("hot")}
        >
          {t.toolbar.hotDeals}
          <i className="fa-solid fa-tag"></i>
        </button>
      </div>
      <div className="inner-total-item">
        {t.toolbar.allTours} <b>{totalRecord} {t.toolbar.toursSuffix}</b>
      </div>
      <button className="inner-button-filter" onClick={openFilter}>
        {t.filter.title}
        <i className="fa-solid fa-filter"></i>
      </button>
    </>
  );
}
