import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TourCard from '../components/tour/TourCard';
import { tourService } from '../services/tour.service';
import { Tour } from '../types';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => { params[k] = v; });
    if (Object.keys(params).length === 0) return;

    setLoading(true);
    tourService.search(params)
      .then(data => setTours(data.tourList))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    data.forEach((v, k) => { if (v) params.set(k, v.toString()); });
    setSearchParams(params);
  };

  return (
    <div className="section-9">
      <div className="container">
        <div className="inner-wrap">
          <div className="inner-left">
            <div className="box-filter">
              <form onSubmit={handleSearch}>
                <div className="inner-filter-list">
                  <div className="inner-head">
                    <div className="inner-title">Search</div>
                    <i className="fa-solid fa-magnifying-glass" />
                  </div>
                  <div className="inner-group">
                    <div className="inner-label">Destination</div>
                    <input type="text" name="locationTo"
                      defaultValue={searchParams.get('locationTo') || ''}
                      placeholder="Where do you want to go?" />
                  </div>
                  <div className="inner-group">
                    <div className="inner-label">Departure Date</div>
                    <input type="date" name="departureDate"
                      defaultValue={searchParams.get('departureDate') || ''} />
                  </div>
                  <div className="inner-group">
                    <div className="inner-label">Adult seats (min)</div>
                    <input type="number" name="stockAdult" min="0"
                      defaultValue={searchParams.get('stockAdult') || '0'} />
                  </div>
                  <div className="inner-group">
                    <div className="inner-label">Price Range</div>
                    <select name="price" defaultValue={searchParams.get('price') || ''}>
                      <option value="">-- All prices --</option>
                      <option value="0-999999">Under 1M</option>
                      <option value="1000000-3000000">1M to 3M</option>
                      <option value="3000000-6000000">3M to 6M</option>
                      <option value="6000000-10000000">6M to 10M</option>
                    </select>
                  </div>
                  <button className="inner-button" type="submit">Search</button>
                </div>
              </form>
            </div>
          </div>

          <div className="inner-right">
            <div className="inner-info-2">
              <div className="inner-total-item">
                Found: <b>{tours.length} Tours</b>
              </div>
            </div>
            <div className="inner-list-tour">
              {loading ? (
                <p>Searching...</p>
              ) : tours.length > 0 ? (
                tours.map(item => <TourCard key={item._id} item={item} />)
              ) : (
                <p>No tours found matching your search.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
