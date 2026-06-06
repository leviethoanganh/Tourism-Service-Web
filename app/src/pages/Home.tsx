import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TourCard from '../components/tour/TourCard';
import { tourService } from '../services/tour.service';
import { Tour } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Tour[]>([]);
  const [domestic, setDomestic] = useState<Tour[]>([]);
  const [international, setInternational] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tourService.getHome().then(data => {
      setFeatured(data.featured);
      setDomestic(data.domestic);
      setInternational(data.international);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    data.forEach((v, k) => { if (v) params.set(k, v.toString()); });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <>
      {/* Section 1 - Hero */}
      <div className="section-1">
        <div className="container">
          <div className="inner-wrap">
            <h1 className="inner-title">
              Travel Asia - Discover America, Australia, Europe
              <br />Go wherever you want
            </h1>
            <p className="inner-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua
            </p>
            <form className="inner-form" onSubmit={handleSearch}>
              <div className="inner-box inner-address">
                <div className="inner-input-group">
                  <img className="inner-icon" alt="" src="/client/assets/images/icon-address.png" />
                  <input className="inner-input" placeholder="Where do you want to go?" type="text" name="locationTo" />
                  <i className="fa-solid fa-angle-down inner-down" />
                </div>
              </div>
              <div className="inner-box inner-calendar">
                <div className="inner-input-group">
                  <img className="inner-icon" alt="" src="/client/assets/images/icon-calendar.png" />
                  <input className="inner-input" placeholder="Departure Date" type="date" name="departureDate" />
                  <i className="fa-solid fa-angle-down inner-down" />
                </div>
              </div>
              <button className="inner-button" type="submit">
                <i className="fa-solid fa-magnifying-glass" /> Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Section 2 - Featured Tours */}
      <div className="section-2">
        <div className="container">
          <div className="inner-wrap">
            <div className="inner-info">
              <h2 className="inner-title">2024 DEALS<br />LAST MINUTE TOURS</h2>
              <p className="inner-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="inner-list">
              {loading ? (
                <p>Loading...</p>
              ) : (
                featured.map(item => <TourCard key={item._id} item={item} />)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 - Banner */}
      <div className="section-3">
        <div className="container">
          <h2 className="box-title">Explosive Deals - Beat the Heat</h2>
          <div className="inner-wrap">
            {[1, 2, 3].map(n => (
              <div className="inner-item" key={n}>
                <a href="#"><img alt="" src={`/client/assets/images/banner-${n}.png`} /></a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4 - Domestic Tours */}
      <div className="section-4">
        <div className="container">
          <h2 className="box-title">Domestic Tours</h2>
          <div className="inner-wrap">
            {loading ? (
              <p>Loading...</p>
            ) : (
              domestic.map(item => <TourCard key={item._id} item={item} />)
            )}
          </div>
          <div className="inner-button">
            <a className="button-outline" href="/tours">View All</a>
          </div>
        </div>
      </div>

      {/* Section 5 - Banner */}
      <div className="section-5">
        <div className="container">
          <a className="inner-image" href="#">
            <img alt="" src="/client/assets/images/banner-4.png" />
          </a>
        </div>
      </div>

      {/* Section 6 - International Tours */}
      <div className="section-4">
        <div className="container">
          <h2 className="box-title">International Tours</h2>
          <div className="inner-wrap">
            {loading ? (
              <p>Loading...</p>
            ) : (
              international.map(item => <TourCard key={item._id} item={item} />)
            )}
          </div>
          <div className="inner-button">
            <a className="button-outline" href="/tours">View All</a>
          </div>
        </div>
      </div>
    </>
  );
}
