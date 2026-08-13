"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function HomeHero() {
  const router = useRouter();
  const [locationTo, setLocationTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [adultCount, setAdultCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [babyCount, setBabyCount] = useState(0);
  const [showQuantity, setShowQuantity] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const quantityRef = useRef<HTMLDivElement>(null);

  const passengerDisplay = `${adultCount} Adult${adultCount !== 1 ? "s" : ""}, ${childrenCount} Children, ${babyCount} Baby`;

  useEffect(() => {
    if (!showQuantity) return;
    const handler = (e: MouseEvent) => {
      if (quantityRef.current && !quantityRef.current.contains(e.target as Node)) {
        setShowQuantity(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showQuantity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locationTo) params.set("locationTo", locationTo);
    if (departureDate) params.set("departureDate", departureDate);
    if (adultCount > 0) params.set("stockAdult", String(adultCount));
    if (childrenCount > 0) params.set("stockChildren", String(childrenCount));
    if (babyCount > 0) params.set("stockBaby", String(babyCount));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="section-1">
      <div className="container">
        <div className="inner-wrap">
          <h1
            className="inner-title"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            Travel Asia - Discover America, Australia, Europe
            <br />
            Go wherever you want
          </h1>
          <p
            className="inner-desc"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="200"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua
          </p>

          <form
            className="inner-form"
            onSubmit={handleSearch}
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="400"
          >
            {/* Destination */}
            <div className={`inner-box inner-address${showSuggest ? " active" : ""}`}>
              <div className="inner-input-group">
                <img className="inner-icon" alt="" src="/client/assets/images/icon-address.png" />
                <input
                  className="inner-input"
                  placeholder="Where do you want to go?"
                  type="text"
                  name="locationTo"
                  value={locationTo}
                  onChange={(e) => setLocationTo(e.target.value)}
                  onFocus={() => setShowSuggest(true)}
                  onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
                />
                <i className="fa-solid fa-angle-down inner-down"></i>
              </div>
              <div className="inner-suggest">
                <div className="inner-suggest-title">
                  <i className="fa-solid fa-location-dot"></i>
                  Hot Destinations
                </div>
                <div className="inner-suggest-list">
                  {["Japan", "Phu Quoc", "Singapore"].map((place) => (
                    <div
                      key={place}
                      className="inner-item"
                      onMouseDown={() => setLocationTo(place)}
                    >
                      <div className="inner-item-image">
                        <img alt="" src="/client/assets/images/product-1.png" />
                      </div>
                      <div className="inner-item-content">
                        <div className="inner-item-title">{place}</div>
                        <div className="inner-item-desc">50 tours</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Passengers */}
            <div
              className={`inner-box inner-user${showQuantity ? " active" : ""}`}
              ref={quantityRef}
            >
              <div className="inner-input-group">
                <img className="inner-icon" alt="" src="/client/assets/images/icon-user.png" />
                <input
                  className="inner-input"
                  readOnly
                  placeholder="Passengers"
                  type="text"
                  value={passengerDisplay}
                  onFocus={() => setShowQuantity(true)}
                />
                <i className="fa-solid fa-angle-down inner-down"></i>
              </div>
              <div className="inner-quantity">
                {[
                  { label: "Adult", count: adultCount, set: setAdultCount },
                  { label: "Children", count: childrenCount, set: setChildrenCount },
                  { label: "Baby", count: babyCount, set: setBabyCount },
                ].map(({ label, count, set }) => (
                  <div key={label} className="inner-item">
                    <div className="inner-label">{label}</div>
                    <div className="inner-count">
                      <span
                        className="inner-down"
                        onMouseDown={(e) => { e.preventDefault(); set(Math.max(0, count - 1)); }}
                      >-</span>
                      <span className="inner-number">{count}</span>
                      <span
                        className="inner-up"
                        onMouseDown={(e) => { e.preventDefault(); set(count + 1); }}
                      >+</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="inner-box inner-calendar">
              <div className="inner-input-group">
                <img className="inner-icon" alt="" src="/client/assets/images/icon-calendar.png" />
                <input
                  className="inner-input"
                  placeholder="Departure Date"
                  type="date"
                  name="departureDate"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
                <i className="fa-solid fa-angle-down inner-down"></i>
              </div>
            </div>

            <button type="submit" className="inner-button">
              <i className="fa-solid fa-magnifying-glass"></i>
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
