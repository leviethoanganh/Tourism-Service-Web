"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { tourService } from "@/services/tour.service";
import { settingService } from "@/services/setting.service";
import { Tour, City } from "@/types";
import TourCard from "@/components/tour/TourCard";

export default function SearchContent() {
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
                  <div className="inner-title">Filter</div>
                  <i className="fa-solid fa-filter"></i>
                </div>
                <div className="inner-group">
                  <div className="inner-label">Departure From</div>
                  <select
                    name="locationFrom"
                    value={form.locationFrom}
                    onChange={(e) => setForm({ ...form, locationFrom: e.target.value })}
                  >
                    <option value="">-- Select departure --</option>
                    {cities.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="inner-group">
                  <div className="inner-label">Destination</div>
                  <input
                    type="text"
                    name="locationTo"
                    placeholder="Enter destination..."
                    value={form.locationTo}
                    onChange={(e) => setForm({ ...form, locationTo: e.target.value })}
                  />
                </div>
                <div className="inner-group">
                  <div className="inner-label">Departure Date</div>
                  <input
                    type="date"
                    name="departureDate"
                    value={form.departureDate}
                    onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
                  />
                </div>
                <div className="inner-group">
                  <div className="inner-label">Passenger Count</div>
                  <div className="inner-input-list">
                    <div className="inner-input-item">
                      <div className="inner-label">Adult:</div>
                      <input
                        type="number"
                        value={form.stockAdult}
                        onChange={(e) => setForm({ ...form, stockAdult: e.target.value })}
                      />
                    </div>
                    <div className="inner-input-item">
                      <div className="inner-label">Children:</div>
                      <input
                        type="number"
                        value={form.stockChildren}
                        onChange={(e) => setForm({ ...form, stockChildren: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="inner-group">
                  <div className="inner-label">Price Range</div>
                  <select
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  >
                    <option value="">-- Select price range --</option>
                    <option value="0-999999">Under 1M</option>
                    <option value="1000000-3000000">1M to 3M</option>
                    <option value="3000000-6000000">3M to 6M</option>
                    <option value="6000000-10000000">6M to 10M</option>
                    <option value="10000000-15999999">Over 10M</option>
                  </select>
                </div>
                <button
                  className="inner-button"
                  onClick={() => { doSearch(); setShowFilter(false); }}
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Apply"}
                </button>
              </div>
            </div>
            <div className="inner-overlay" onClick={() => setShowFilter(false)}></div>
          </div>

          {/* Right */}
          <div className="inner-right">
            <div className="inner-info-1">
              <h2 className="inner-title">Search Tours</h2>
            </div>
            <div className="inner-info-2">
              <div className="inner-sort">
                <div className="inner-label">Results:</div>
              </div>
              {searched && (
                <div className="inner-total-item">
                  Found: <b>{results.length} Tours</b>
                </div>
              )}
              <button className="inner-button-filter" onClick={() => setShowFilter(true)}>
                Filter
                <i className="fa-solid fa-filter"></i>
              </button>
            </div>

            {searched && results.length === 0 && (
              <p>No tours found matching your criteria.</p>
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
