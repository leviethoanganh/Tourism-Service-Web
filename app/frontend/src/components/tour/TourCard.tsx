import Link from "next/link";
import { Tour } from "@/types";

interface Props {
  tour: Tour;
}

export default function TourCard({ tour }: Props) {
  const priceAdult = tour.priceAdult || 0;
  const priceNewAdult = tour.priceNewAdult || 0;
  const discount = priceAdult > 0
    ? Math.floor(((priceAdult - priceNewAdult) / priceAdult) * 100)
    : 0;

  return (
    <div className="product-item">
      <div className="inner-image">
        <Link href={`/tours/${tour.slug}`}>
          <img
            src={tour.avatar || "/client/assets/images/product-1.png"}
            alt={tour.name}
          />
        </Link>
      </div>

      {discount > 0 && (
        <div className="inner-discount">
          <i className="fa-solid fa-bolt"></i>
          {` Sale -${discount}%`}
        </div>
      )}

      <div className="inner-content">
        <h3 className="inner-title">
          <Link href={`/tours/${tour.slug}`}>{tour.name || "Tour name updating"}</Link>
        </h3>

        <div className="inner-prices">
          <div className="inner-price-old">
            {priceAdult.toLocaleString("en-US")}
            <span className="inner-unit"> VND</span>
          </div>
          <div className="inner-price-new">
            {priceNewAdult.toLocaleString("en-US")}
            <span className="inner-unit"> VND</span>
          </div>
        </div>

        <div className="inner-desc">
          {tour.code && (
            <div>Tour Code: <span>{tour.code}</span></div>
          )}
          <div>Departure Date: <span>{tour.departureDateFormat || "Contact us"}</span></div>
          <div>Duration: <span>{tour.time || "Updating"}</span></div>
        </div>

        <div className="inner-meta">
          <div className="inner-rating">
            <div className="inner-stars">
              {[1,2,3,4,5].map((i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <div className="inner-number">(5)</div>
          </div>
          <div className="inner-stock">
            <div className="inner-label">Seats left:</div>
            <div className="inner-number">{tour.stockAdult || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
