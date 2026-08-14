"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { tourService } from "@/services/tour.service";
import { settingService } from "@/services/setting.service";
import { Tour, City } from "@/types";
import TourCard from "@/components/tour/TourCard";
import { useTranslation } from "@/hooks/useTranslation";

export default function SearchContent() {
  const { t } = useTranslation();
  const searchParamsHook = useSearchParams();
  const [cities, setCities] = useState<City[]>([]);
  const [results, setResults] = useState<Tour[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [form, setForm] = useState({
    locationFrom: searchParamsHook.get("locationFrom") || "",
    locationTo: searchParamsHook.get("locationTo") || "",
    departureDate: searchParamsHook.get("departureDate") || "",
    stockAdult: searchParamsHook.get("stockAdult") || "",
    stockChildren: searchParamsHook.get("stockChildren") || "",
    price: searchParamsHook.get("price") || "",
  });

  useEffect(() => {
    settingService.getCities().then((d) => setCities(d.cityList)).catch(() => {});
  }, []);

  useEffect(() => {
    const hasParams = [...searchParamsHook.entries()].length > 0;
    if (hasParams) doSearch();
  }, []);

  const doSearch = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      Object.entries(form).forEach(([k, v]) => { if (v) params[k] = v; });
      const data = await tourService.search(params);
      setResults(data.tourList);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-9">
      <div className="container">
        <div className="inner-wrap">
          {/* Filter sidebar */}
          <div className={`inner-left${showFilter ? " active" : ""}`}>
            <div className="box-filter">
              <div className="inner-filter-list">
                <div className="inner-head">
                  <div className="inner-title">{t.filter.title}</div>
                  <i className="fa-solid fa-filter"></i>
                </div>
                <div className="inner-group">
                  <div className="inner-label">{t.filter.departureFrom}</div>
                  <select
                    name="locationFrom"
                    value={form.locationFrom}
                    onChange={(e) => setForm({ ...form, locationFrom: e.target.value })}
                  >
                    <option value="">{t.search.selectDeparturePlaceholder}</option>
                    {cities.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="inner-group">
                  <div className="inner-label">{t.filter.destination}</div>
                  <input
                    type="text"
                    name="locationTo"
                    placeholder={t.search.enterDestinationPlaceholder}
                    value={form.locationTo}
                    onChange={(e) => setForm({ ...form, locationTo: e.target.value })}
                  />
                </div>
                <div className="inner-group">
                  <div className="inner-label">{t.common.departureDate}</div>
                  <input
                    type="date"
                    name="departureDate"
                    value={form.departureDate}
                    onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
                  />
                </div>
                <div className="inner-group">
                  <div className="inner-label">{t.filter.passengerCount}</div>
                  <div className="inner-input-list">
                    <div className="inner-input-item">
                      <div className="inner-label">{t.common.adult}:</div>
                      <input
                        type="number"
                        value={form.stockAdult}
                        onChange={(e) => setForm({ ...form, stockAdult: e.target.value })}
                      />
                    </div>
                    <div className="inner-input-item">
                      <div className="inner-label">{t.common.children}:</div>
                      <input
                        type="number"
                        value={form.stockChildren}
                        onChange={(e) => setForm({ ...form, stockChildren: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="inner-group">
                  <div className="inner-label">{t.filter.priceRange}</div>
                  <select
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  >
                    <option value="">{t.search.selectPriceRangePlaceholder}</option>
                    <option value="0-999999">{t.filter.priceUnder1M}</option>
                    <option value="1000000-3000000">{t.filter.price1to3M}</option>
                    <option value="3000000-6000000">{t.filter.price3to6M}</option>
                    <option value="6000000-10000000">{t.filter.price6to10M}</option>
                    <option value="10000000-15999999">{t.filter.priceOver10M}</option>
                  </select>
                </div>
                <button
                  className="inner-button"
                  onClick={() => { doSearch(); setShowFilter(false); }}
                  disabled={loading}
                >
                  {loading ? t.search.searching : t.common.apply}
                </button>
              </div>
            </div>
            <div className="inner-overlay" onClick={() => setShowFilter(false)}></div>
          </div>

          {/* Right */}
          <div className="inner-right">
            <div className="inner-info-1">
              <h2 className="inner-title">{t.search.searchToursTitle}</h2>
            </div>
            <div className="inner-info-2">
              <div className="inner-sort">
                <div className="inner-label">{t.search.results}</div>
              </div>
              {searched && (
                <div className="inner-total-item">
                  {t.search.found} <b>{results.length} {t.toolbar.toursSuffix}</b>
                </div>
              )}
              <button className="inner-button-filter" onClick={() => setShowFilter(true)}>
                {t.filter.title}
                <i className="fa-solid fa-filter"></i>
              </button>
            </div>

            {searched && results.length === 0 && (
              <p>{t.toolbar.noToursFound}</p>
            )}
            {results.length > 0 && (
              <div className="inner-list-tour">
                {results.map((tour) => (
                  <TourCard key={tour._id} tour={tour} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
