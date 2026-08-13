import { Suspense } from "react";
import { tourService } from "@/services/tour.service";
import { settingService } from "@/services/setting.service";
import TourCard from "@/components/tour/TourCard";
import Pagination from "@/components/ui/Pagination";
import TourListFilter from "@/components/tour/TourListFilter";
import ToursToolbar from "@/components/tour/ToursToolbar";

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export default async function ToursPage({ searchParams }: Props) {
  const params = await searchParams;

  let tourList: any[] = [];
  let pagination = { currentPage: 1, totalPage: 1, totalRecord: 0, limitItems: 6 };
  let cities: any[] = [];

  const [toursData, citiesData] = await Promise.allSettled([
    tourService.getList({
      page:          params.page          || 1,
      keyword:       params.keyword       || "",
      locationFrom:  params.locationFrom  || "",
      locationTo:    params.locationTo    || "",
      departureDate: params.departureDate || "",
      stockAdult:    params.stockAdult    || "",
      stockChildren: params.stockChildren || "",
      stockBaby:     params.stockBaby     || "",
      price:         params.price         || "",
      sortBy:        params.sortBy        || "hot",
    }),
    settingService.getCities(),
  ]);

  if (toursData.status === "fulfilled") {
    tourList  = toursData.value.tourList;
    pagination = toursData.value.pagination;
  }
  if (citiesData.status === "fulfilled") {
    cities = citiesData.value.cityList;
  }

  const sortBy = params.sortBy || "hot";

  return (
    <div className="section-9">
      <div className="container">
        <div className="inner-wrap">

          {/* Filter sidebar */}
          <div className="inner-left" id="tour-filter-sidebar">
            <Suspense fallback={null}>
              <TourListFilter cities={cities} />
            </Suspense>
            <div className="inner-overlay" id="tour-filter-overlay"></div>
          </div>

          {/* Right content */}
          <div className="inner-right">
            <div className="inner-info-1">
              <h2 className="inner-title">All Tours</h2>
              <div className="inner-desc">Discover amazing tours for every budget and interest.</div>
            </div>

            <div className="inner-info-2">
              <Suspense fallback={null}>
                <ToursToolbar sortBy={sortBy} totalRecord={pagination.totalRecord} />
              </Suspense>
            </div>

            {tourList.length === 0 ? (
              <p style={{ padding: "40px 0", color: "#888" }}>No tours found matching your criteria.</p>
            ) : (
              <div className="inner-list-tour">
                {tourList.map((tour) => (
                  <TourCard key={tour._id} tour={tour} />
                ))}
              </div>
            )}

            <Suspense fallback={null}>
              <Pagination currentPage={pagination.currentPage} totalPage={pagination.totalPage} />
            </Suspense>
          </div>

        </div>
      </div>
    </div>
  );
}
