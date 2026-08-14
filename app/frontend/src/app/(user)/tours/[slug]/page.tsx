"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { tourService } from "@/services/tour.service";
import { settingService } from "@/services/setting.service";
import { useCartStore } from "@/store/cart.store";
import { Tour, City } from "@/types";
import TourImageGallery from "./_TourImageGallery";
import { useTranslation } from "@/hooks/useTranslation";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function TourDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const addItem = useCartStore((s) => s.addItem);

  const [tour, setTour] = useState<Tour | null>(null);
  const [category, setCategory] = useState<{ name: string; slug: string } | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const [locationFrom, setLocationFrom] = useState("");
  const [qtyAdult, setQtyAdult] = useState(1);
  const [qtyChildren, setQtyChildren] = useState(0);
  const [qtyBaby, setQtyBaby] = useState(0);
  const [showTourInfo, setShowTourInfo] = useState(false);

  useEffect(() => {
    Promise.all([tourService.getDetail(slug), settingService.getCities()])
      .then(([tourData, cityData]) => {
        setTour(tourData.tour);
        setCategory(tourData.category);
        setCities(cityData.cityList);
        if (cityData.cityList.length > 0) setLocationFrom(cityData.cityList[0]._id);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const total =
    qtyAdult * (tour?.priceNewAdult || 0) +
    qtyChildren * (tour?.priceNewChildren || 0) +
    qtyBaby * (tour?.priceNewBaby || 0);

  const handleAddToCart = () => {
    if (!tour) return;
    if (!locationFrom) { alert(t.tourDetail.selectDepartureCityAlert); return; }
    addItem({
      tourId: tour._id, name: tour.name, avatar: tour.avatar, slug: tour.slug,
      quantityAdult: qtyAdult, quantityChildren: qtyChildren, quantityBaby: qtyBaby,
      priceNewAdult: tour.priceNewAdult, priceNewChildren: tour.priceNewChildren,
      priceNewBaby: tour.priceNewBaby, locationFrom, departureDate: tour.departureDateFormat,
    });
    alert(t.tourDetail.addedToCartAlert);
  };

  if (loading) return <div style={{ textAlign: "center", padding: "80px 0" }}>{t.common.loading}</div>;
  if (!tour) return <div style={{ textAlign: "center", padding: "80px 0" }}>{t.tourDetail.tourNotFound}</div>;

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="inner-image">
          <img alt={tour.name} src={tour.avatar} />
        </div>
        <div className="inner-content">
          <div className="container">
            <div className="inner-wrap">
              <h1 className="inner-title">{tour.name}</h1>
              <nav className="inner-links">
                <a href="/">{t.header.home}</a>
                {category && (
                  <>
                    <i className="fa-solid fa-angles-right"></i>
                    <a href={`/category/${category.slug}`}>{category.name}</a>
                  </>
                )}
                <i className="fa-solid fa-angles-right"></i>
                <a href={`/tours/${tour.slug}`}>{tour.name}</a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Section 10 */}
      <div className="section-10">
        <div className="container">
          <div className="inner-wrap">
            {/* Left */}
            <div className="inner-left">
              {/* Box Images */}
              <TourImageGallery images={tour.images} avatar={tour.avatar} name={tour.name} />
              {/* End Box Images */}

              {/* Box Tour Info */}
              <div className={`box-tour-info${showTourInfo ? " active" : ""}`}>
                <div className="inner-title-main">{t.tourDetail.tourInformation}</div>
                <div
                  className="inner-content"
                  dangerouslySetInnerHTML={{ __html: tour.information || "" }}
                />
                <div className="inner-read-more">
                  <button
                    className="button-outline"
                    onClick={() => setShowTourInfo(!showTourInfo)}
                  >
                    {showTourInfo ? t.tourDetail.showLess : t.tourDetail.viewAll}
                  </button>
                </div>
              </div>
              {/* End Box Tour Info */}

              {/* Box Tour Schedule */}
              {tour.schedules?.length > 0 && (
                <div className="box-tour-schedule">
                  <div className="inner-title-main">{t.tourDetail.tourSchedule}</div>
                  <div className="inner-list">
                    <div className="inner-line"></div>
                    {tour.schedules.map((s, i) => (
                      <div key={i} className="inner-item">
                        <div className="inner-dot"></div>
                        <div className="inner-title">{s.title}</div>
                        <div
                          className="inner-content"
                          dangerouslySetInnerHTML={{ __html: s.description }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* End Box Tour Schedule */}
            </div>

            {/* Right */}
            <div className="inner-right">
              <div className="box-tour-detail">
                <div className="inner-title-main">{t.tourDetail.yourTrip}</div>

                <div className="inner-product">
                  <div className="inner-image">
                    <img alt={tour.name} src={tour.avatar} />
                  </div>
                  <div className="inner-info">
                    <div className="inner-title">{tour.name}</div>
                    <div className="inner-rating">
                      <div className="inner-stars">
                        {[1,2,3,4].map((i) => <i key={i} className="fa-solid fa-star"></i>)}
                        <i className="fa-regular fa-star"></i>
                      </div>
                      <div className="inner-number">{t.tourDetail.reviews}</div>
                    </div>
                  </div>
                </div>

                <div className="inner-meta">
                  <div className="inner-item">
                    <i className="fa-solid fa-calendar-days"></i>
                    <span>{t.common.duration}:</span>
                    <span className="inner-highlight">{tour.time}</span>
                  </div>
                  <div className="inner-item">
                    <i className="fa-solid fa-car"></i>
                    <span>{t.tourDetail.transport}</span>
                    <span className="inner-highlight">{tour.vehicle}</span>
                  </div>
                  <div className="inner-item">
                    <i className="fa-solid fa-calendar-days"></i>
                    <span>{t.common.departureDate}:</span>
                    <span className="inner-highlight">{tour.departureDateFormat}</span>
                  </div>
                </div>

                <div className="inner-group">
                  <div className="inner-label">{t.tourDetail.departureFrom}</div>
                  <select value={locationFrom} onChange={(e) => setLocationFrom(e.target.value)}>
                    {cities.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="inner-group">
                  <div className="inner-label">{t.filter.passengerCount}</div>
                  <div className="inner-list">
                    <div className="inner-item">
                      <div className="inner-item-label">{t.common.adult}:</div>
                      <div className="inner-item-input">
                        <input
                          type="number" min={0} max={tour.stockAdult}
                          value={qtyAdult}
                          onChange={(e) => setQtyAdult(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="inner-item-price">
                        <span>{qtyAdult}</span> x{" "}
                        <span className="inner-highlight">{fmt(tour.priceNewAdult)} VND</span>
                      </div>
                    </div>
                    <div className="inner-item">
                      <div className="inner-item-label">{t.common.children}:</div>
                      <div className="inner-item-input">
                        <input
                          type="number" min={0} max={tour.stockChildren}
                          value={qtyChildren}
                          onChange={(e) => setQtyChildren(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="inner-item-price">
                        <span>{qtyChildren}</span> x{" "}
                        <span className="inner-highlight">{fmt(tour.priceNewChildren)} VND</span>
                      </div>
                    </div>
                    <div className="inner-item">
                      <div className="inner-item-label">{t.common.baby}:</div>
                      <div className="inner-item-input">
                        <input
                          type="number" min={0} max={tour.stockBaby}
                          value={qtyBaby}
                          onChange={(e) => setQtyBaby(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="inner-item-price">
                        <span>{qtyBaby}</span> x{" "}
                        <span className="inner-highlight">{fmt(tour.priceNewBaby)} VND</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="inner-total">
                  <div className="inner-label">{t.common.total}:</div>
                  <div className="inner-price">
                    <span>{fmt(total)}</span> VND
                  </div>
                </div>

                <button className="inner-button-add-cart" onClick={handleAddToCart}>
                  {t.tourDetail.addToCart}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Section 10 */}
    </>
  );
}
