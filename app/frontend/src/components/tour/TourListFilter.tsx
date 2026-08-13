"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { City } from "@/types";

interface Props {
  cities: City[];
}

export default function TourListFilter({ cities }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [stockAdult,    setStockAdult]    = useState(searchParams.get("stockAdult")    || "0");
  const [stockChildren, setStockChildren] = useState(searchParams.get("stockChildren") || "0");
  const [stockBaby,     setStockBaby]     = useState(searchParams.get("stockBaby")     || "0");

  useEffect(() => {
    const overlay = document.getElementById("tour-filter-overlay");
    const close = () => document.getElementById("tour-filter-sidebar")?.classList.remove("active");
    overlay?.addEventListener("click", close);
    return () => overlay?.removeEventListener("click", close);
  }, []);

  const apply = () => {
    const keyword       = (document.querySelector("[name='keyword']")       as HTMLInputElement)?.value  || "";
    const locationFrom  = (document.querySelector("[name='locationFrom']")  as HTMLSelectElement)?.value || "";
    const locationTo    = (document.querySelector("[name='locationTo']")    as HTMLSelectElement)?.value || "";
    const departureDate = (document.querySelector("[name='departureDate']") as HTMLInputElement)?.value  || "";
    const price         = (document.querySelector("[name='price']")         as HTMLSelectElement)?.value || "";

    const params = new URLSearchParams(searchParams.toString());
    const set = (key: string, val: string) => val ? params.set(key, val) : params.delete(key);
    set("keyword",       keyword);
    set("locationFrom",  locationFrom);
    set("locationTo",    locationTo);
    set("departureDate", departureDate);
    set("price",         price);

    const adult    = parseInt(stockAdult)    || 0;
    const children = parseInt(stockChildren) || 0;
    const baby     = parseInt(stockBaby)     || 0;
    adult    > 0 ? params.set("stockAdult",    String(adult))    : params.delete("stockAdult");
    children > 0 ? params.set("stockChildren", String(children)) : params.delete("stockChildren");
    baby     > 0 ? params.set("stockBaby",     String(baby))     : params.delete("stockBaby");

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const reset = () => {
    setStockAdult("0");
    setStockChildren("0");
    setStockBaby("0");
    router.push(pathname);
  };

  return (
    <div className="box-filter">
      <div className="inner-filter-list">
        <div className="inner-head">
          <div className="inner-title">Filter</div>
          <i className="fa-solid fa-filter"></i>
        </div>

        <div className="inner-group">
          <div className="inner-label">Tour Name</div>
          <input
            type="text"
            name="keyword"
            defaultValue={searchParams.get("keyword") || ""}
            placeholder="Search tour name..."
          />
        </div>

        <div className="inner-group">
          <div className="inner-label">Departure From</div>
          <select name="locationFrom" defaultValue={searchParams.get("locationFrom") || ""}>
            <option value="">-- All cities --</option>
            {cities.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="inner-group">
          <div className="inner-label">Destination</div>
          <select name="locationTo" defaultValue={searchParams.get("locationTo") || ""}>
            <option value="">-- All destinations --</option>
            {cities.map((c) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="inner-group">
          <div className="inner-label">Departure Date</div>
          <input
            type="date"
            name="departureDate"
            defaultValue={searchParams.get("departureDate") || ""}
          />
        </div>

        <div className="inner-group">
          <div className="inner-label">Passenger Count</div>
          <div className="inner-input-list">
            <div className="inner-input-item">
              <div className="inner-label">Adult:</div>
              <input
                type="number" min={0}
                value={stockAdult}
                onChange={(e) => setStockAdult(e.target.value)}
              />
            </div>
            <div className="inner-input-item">
              <div className="inner-label">Children:</div>
              <input
                type="number" min={0}
                value={stockChildren}
                onChange={(e) => setStockChildren(e.target.value)}
              />
            </div>
            <div className="inner-input-item">
              <div className="inner-label">Baby:</div>
              <input
                type="number" min={0}
                value={stockBaby}
                onChange={(e) => setStockBaby(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="inner-group">
          <div className="inner-label">Price Range</div>
          <select name="price" defaultValue={searchParams.get("price") || ""}>
            <option value="">-- All prices --</option>
            <option value="0-999999">Under 1M</option>
            <option value="1000000-3000000">1M to 3M</option>
            <option value="3000000-6000000">3M to 6M</option>
            <option value="6000000-10000000">6M to 10M</option>
            <option value="10000000-99999999">Over 10M</option>
          </select>
        </div>

        <button className="inner-button" onClick={apply}>Apply</button>
        <button className="inner-button-reset" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
