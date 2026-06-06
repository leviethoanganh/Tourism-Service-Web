import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tourService } from '../services/tour.service';
import { useCartStore } from '../store/cartStore';
import { Tour } from '../types';

export default function TourDetail() {
  const { slug } = useParams<{ slug: string }>();
  const addItem = useCartStore(s => s.addItem);

  const [tour, setTour] = useState<Tour | null>(null);
  const [category, setCategory] = useState<{ name: string; slug: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const [locationFrom, setLocationFrom] = useState('');
  const [qtyAdult, setQtyAdult] = useState(1);
  const [qtyChildren, setQtyChildren] = useState(0);
  const [qtyBaby, setQtyBaby] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    tourService.getDetail(slug).then(data => {
      setTour(data.tour);
      setCategory(data.category);
      if (data.tour.cityList?.[0]) setLocationFrom(data.tour.cityList[0]._id);
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!tour) return <div className="container"><p>Tour not found.</p></div>;

  const total = (tour.priceNewAdult * qtyAdult)
    + (tour.priceNewChildren * qtyChildren)
    + (tour.priceNewBaby * qtyBaby);

  const handleAddToCart = () => {
    addItem({
      tourId: tour._id,
      locationFrom,
      quantityAdult: qtyAdult,
      quantityChildren: qtyChildren,
      quantityBaby: qtyBaby,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="section-10">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          {category && <><span> / </span><Link to={`/category/${category.slug}`}>{category.name}</Link></>}
          <span> / </span><span>{tour.name}</span>
        </nav>

        <div className="inner-wrap">
          {/* Left - Images & Info */}
          <div className="inner-left">
            <div className="box-images">
              <div className="inner-image-main">
                {tour.images.length > 0 ? (
                  <div className="inner-image">
                    <img alt={tour.name} src={tour.images[0]} />
                  </div>
                ) : (
                  <div className="inner-image">
                    <img alt={tour.name} src={tour.avatar} />
                  </div>
                )}
              </div>
              {tour.images.length > 1 && (
                <div className="inner-image-thumb">
                  {tour.images.map((img, i) => (
                    <div className="inner-image" key={i}>
                      <img alt="" src={img} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="box-tour-info">
              <div className="inner-title-main">Tour Information</div>
              <div className="inner-content" dangerouslySetInnerHTML={{ __html: tour.information }} />
            </div>

            {tour.schedules.length > 0 && (
              <div className="box-tour-schedule">
                <div className="inner-title-main">Tour Schedule</div>
                <div className="inner-list">
                  <div className="inner-line" />
                  {tour.schedules.map((s, i) => (
                    <div className="inner-item" key={i}>
                      <div className="inner-dot" />
                      <div className="inner-title">{s.title}</div>
                      <div className="inner-content" dangerouslySetInnerHTML={{ __html: s.description }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Booking */}
          <div className="inner-right">
            <div className="box-tour-detail">
              <div className="inner-title-main">Your Trip</div>
              <div className="inner-product">
                <div className="inner-image">
                  <img alt={tour.name} src={tour.avatar} />
                </div>
                <div className="inner-info">
                  <div className="inner-title">{tour.name}</div>
                  <div className="inner-rating">
                    <div className="inner-stars">
                      {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star" />)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="inner-meta">
                <div className="inner-item">
                  <i className="fa-solid fa-calendar-days" />
                  <span>Duration:</span>
                  <span className="inner-highlight">{tour.time}</span>
                </div>
                <div className="inner-item">
                  <i className="fa-solid fa-car" />
                  <span>Transport:</span>
                  <span className="inner-highlight">{tour.vehicle}</span>
                </div>
                <div className="inner-item">
                  <i className="fa-solid fa-calendar-days" />
                  <span>Departure Date:</span>
                  <span className="inner-highlight">{tour.departureDateFormat}</span>
                </div>
              </div>

              {tour.cityList && tour.cityList.length > 0 && (
                <div className="inner-group">
                  <div className="inner-label">Departure From:</div>
                  <select value={locationFrom} onChange={e => setLocationFrom(e.target.value)}>
                    {tour.cityList.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="inner-group">
                <div className="inner-label">Passenger Count</div>
                <div className="inner-list">
                  <div className="inner-item">
                    <div className="inner-item-label">Adult:</div>
                    <div className="inner-item-input">
                      <input type="number" min={0} max={tour.stockAdult} value={qtyAdult}
                        onChange={e => setQtyAdult(Number(e.target.value))} />
                    </div>
                    <div className="inner-item-price">
                      <span>{qtyAdult}</span> x{' '}
                      <span className="inner-highlight">{tour.priceNewAdult.toLocaleString('en-US')} VND</span>
                    </div>
                  </div>
                  <div className="inner-item">
                    <div className="inner-item-label">Children:</div>
                    <div className="inner-item-input">
                      <input type="number" min={0} max={tour.stockChildren} value={qtyChildren}
                        onChange={e => setQtyChildren(Number(e.target.value))} />
                    </div>
                    <div className="inner-item-price">
                      <span>{qtyChildren}</span> x{' '}
                      <span className="inner-highlight">{tour.priceNewChildren.toLocaleString('en-US')} VND</span>
                    </div>
                  </div>
                  <div className="inner-item">
                    <div className="inner-item-label">Baby:</div>
                    <div className="inner-item-input">
                      <input type="number" min={0} max={tour.stockBaby} value={qtyBaby}
                        onChange={e => setQtyBaby(Number(e.target.value))} />
                    </div>
                    <div className="inner-item-price">
                      <span>{qtyBaby}</span> x{' '}
                      <span className="inner-highlight">{tour.priceNewBaby.toLocaleString('en-US')} VND</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="inner-total">
                <div className="inner-label">Total:</div>
                <div className="inner-price">
                  <span>{total.toLocaleString('en-US')}</span> VND
                </div>
              </div>

              <button className="inner-button-add-cart" onClick={handleAddToCart}>
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
