"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface Props {
  sortBy: string;
  totalRecord: number;
}

export default function ToursToolbar({ sortBy, totalRecord }: Props) {
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
        <div className="inner-label">Sort by:</div>
        <button
          className={sortBy === "price-asc" ? "active" : ""}
          onClick={() => setSort("price-asc")}
        >
          Price: Low to High
          <i className="fa-solid fa-circle-arrow-up"></i>
        </button>
        <button
          className={sortBy === "price-desc" ? "active" : ""}
          onClick={() => setSort("price-desc")}
        >
          Price: High to Low
          <i className="fa-solid fa-circle-arrow-down"></i>
        </button>
        <button
          className={sortBy === "hot" || !sortBy ? "active" : ""}
          onClick={() => setSort("hot")}
        >
          Hot Deals
          <i className="fa-solid fa-tag"></i>
        </button>
      </div>
      <div className="inner-total-item">
        All: <b>{totalRecord} Tours</b>
      </div>
      <button className="inner-button-filter" onClick={openFilter}>
        Filter
        <i className="fa-solid fa-filter"></i>
      </button>
    </>
  );
}
