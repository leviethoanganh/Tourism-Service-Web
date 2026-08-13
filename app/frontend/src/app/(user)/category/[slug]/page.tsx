import { Suspense } from "react";
import { tourService } from "@/services/tour.service";
import { settingService } from "@/services/setting.service";
import TourCard from "@/components/tour/TourCard";
import Pagination from "@/components/ui/Pagination";
import TourListFilter from "@/components/tour/TourListFilter";
import ToursToolbar from "@/components/tour/ToursToolbar";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  let tourList: any[] = [];
  let pagination = { currentPage: 1, totalPage: 1, totalRecord: 0, limitItems: 6 };
  let cities: any[] = [];

  const [toursData, citiesData] = await Promise.allSettled([
    tourService.getList({
      category:      slug,
      page:          sp.page          || 1,
      keyword:       sp.keyword       || "",
      locationFrom:  sp.locationFrom  || "",
      locationTo:    sp.locationTo    || "",
      departureDate: sp.departureDate || "",
      stockAdult:    sp.stockAdult    || "",
      stockChildren: sp.stockChildren || "",
      stockBaby:     sp.stockBaby     || "",
      price:         sp.price         || "",
      sortBy:        sp.sortBy        || "hot",
    }),
    settingService.getCities(),
  ]);

  if (toursData.status === "fulfilled") {
    tourList   = toursData.value.tourList;
    pagination = toursData.value.pagination;
  }
  if (citiesData.status === "fulfilled") {
    cities = citiesData.value.cityList;
  }

  const sortBy = sp.sortBy || "hot";
  const title  = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="inner-image">
          <img alt={title} src="/client/assets/images/banner-6.jpg" />
        </div>
        <div className="inner-content">
          <div className="container">
            <div className="inner-wrap">
              <h1 className="inner-title">{title}</h1>
              <nav className="inner-links">
                <a href="/">Home</a>
                <i className="fa-solid fa-angles-right"></i>
                <a href={`/category/${slug}`}>{title}</a>
              </nav>
            </div>
          </div>
        </div>
      </div>

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
                <h2 className="inner-title">{title}</h2>
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
    </>
  );
}
