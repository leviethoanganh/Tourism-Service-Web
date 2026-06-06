import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TourCard from '../components/tour/TourCard';
import Pagination from '../components/ui/Pagination';
import { tourService } from '../services/tour.service';
import { settingService } from '../services/setting.service';
import { Tour, Pagination as PaginationType, City } from '../types';

export default function TourList() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tours, setTours] = useState<Tour[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    settingService.getCities().then(d => setCities(d.cityList));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page: currentPage };
    if (slug) params.category = slug;
    searchParams.forEach((v, k) => { if (k !== 'page') params[k] = v; });

    tourService.getList(params).then(data => {
      setTours(data.tourList);
      setPagination(data.pagination);
    }).finally(() => setLoading(false));
  }, [slug, searchParams]);

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    data.forEach((v, k) => { if (v) params.set(k, v.toString()); });
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className="section-9">
      <div className="container">
        <div className="inner-wrap">
          {/* Filter sidebar */}
          <div className="inner-left">
            <div className="box-filter">
              <form onSubmit={handleFilter}>
                <div className="inner-filter-list">
                  <div className="inner-head">
                    <div className="inner-title">Filter</div>
                    <i className="fa-solid fa-filter" />
                  </div>
                  <div className="inner-group">
                    <div className="inner-label">Departure From</div>
                    <select name="locationFrom">
                      <option value="">-- Select departure --</option>
                      {cities.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="inner-group">
                    <div className="inner-label">Departure Date</div>
                    <input type="date" name="departureDate" />
                  </div>
                  <div className="inner-group">
                    <div className="inner-label">Price Range</div>
                    <select name="priceRange">
                      <option value="">-- Select price range --</option>
                      <option value="under-1m">Under 1M</option>
                      <option value="1m-2m">1M to 2M</option>
                      <option value="2m-6m">2M to 6M</option>
                      <option value="over-6m">Over 6M</option>
                    </select>
                  </div>
                  <button className="inner-button" type="submit">Apply</button>
                </div>
              </form>
            </div>
          </div>

          {/* Tour list */}
          <div className="inner-right">
            <div className="inner-list-tour">
              {loading ? (
                <p>Loading...</p>
              ) : tours.length > 0 ? (
                tours.map(item => <TourCard key={item._id} item={item} />)
              ) : (
                <p>No tours found.</p>
              )}
            </div>
            {pagination && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPage={pagination.totalPage}
                onPageChange={p => setSearchParams(prev => { prev.set('page', String(p)); return prev; })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
