import { Link } from 'react-router-dom';
import { Tour } from '../../types';

interface Props {
  item: Tour;
}

export default function TourCard({ item }: Props) {
  const priceAdult = item.priceAdult || 0;
  const priceNewAdult = item.priceNewAdult || 0;
  const discount = priceAdult > 0
    ? Math.floor(((priceAdult - priceNewAdult) / priceAdult) * 100)
    : 0;

  return (
    <div className="product-item">
      <div className="inner-image">
        <Link to={`/tours/detail/${item.slug}`}>
          <img
            src={item.avatar || '/client/assets/images/product-1.png'}
            alt={item.name}
          />
        </Link>
      </div>

      {discount > 0 && (
        <div className="inner-discount">
          <i className="fa-solid fa-bolt" /> Sale -{discount}%
        </div>
      )}

      <div className="inner-content">
        <h3 className="inner-title">
          <Link to={`/tours/detail/${item.slug}`}>{item.name || 'Tour name updating'}</Link>
        </h3>

        <div className="inner-prices">
          <div className="inner-price-old">
            {priceAdult.toLocaleString('en-US')}
            <span className="inner-unit"> VND</span>
          </div>
          <div className="inner-price-new">
            {priceNewAdult.toLocaleString('en-US')}
            <span className="inner-unit"> VND</span>
          </div>
        </div>

        <div className="inner-desc">
          <div>Departure Date: <span>{item.departureDateFormat || 'Contact us'}</span></div>
          <div>Duration: <span>{item.time || 'Updating'}</span></div>
        </div>

        <div className="inner-meta">
          <div className="inner-rating">
            <div className="inner-stars">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={i < 5 ? 'fa-solid fa-star' : 'fa-regular fa-star'} />
              ))}
            </div>
            <div className="inner-number">(5)</div>
          </div>
          <div className="inner-stock">
            <div className="inner-label">Seats left:</div>
            <div className="inner-number">{item.stockAdult || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
