import { tourService } from "@/services/tour.service";
import TourCard from "@/components/tour/TourCard";
import HomeHero from "./_components/HomeHero";
import HomeSection2 from "./_components/HomeSection2";
import HomeSection3 from "./_components/HomeSection3";
import T from "@/components/shared/T";

export default async function HomePage() {
  let featured: any[] = [], domestic: any[] = [], international: any[] = [];

  try {
    const data = await tourService.getHome();
    featured = data.featured || [];
    domestic = data.domestic || [];
    international = data.international || [];
  } catch (err) {
    console.error("[Home] Failed to fetch tours:", err);
  }

  return (
    <>
      {/* Section 1 - Hero Search */}
      <HomeHero />

      {/* Section 2 - Deals + Featured Tours */}
      <HomeSection2 tours={featured} />

      {/* Section 3 - Banner Carousel */}
      <HomeSection3 />

      {/* Section 4 - Domestic Tours */}
      {domestic.length > 0 && (
        <div className="section-4">
          <div className="container">
            <h2 className="box-title" data-aos="fade-up" data-aos-duration="800">
              <T ns="home" k="domesticTours" />
            </h2>
            <div className="inner-wrap">
              {domestic.map((tour: any) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
            <div className="inner-button" data-aos="fade-up" data-aos-duration="800">
              <a className="button-outline" href="/tours"><T ns="home" k="viewAll" /></a>
            </div>
          </div>
        </div>
      )}

      {/* Section 5 - Banner */}
      <div className="section-5">
        <div className="container">
          <a className="inner-image" href="#">
            <img alt="" src="/client/assets/images/banner-4.png" />
          </a>
        </div>
      </div>

      {/* Section 6 - International Tours */}
      {international.length > 0 && (
        <div className="section-4">
          <div className="container">
            <h2 className="box-title" data-aos="fade-up" data-aos-duration="800">
              <T ns="home" k="internationalTours" />
            </h2>
            <div className="inner-wrap">
              {international.map((tour: any) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
            <div className="inner-button" data-aos="fade-up" data-aos-duration="800">
              <a className="button-outline" href="/tours"><T ns="home" k="viewAll" /></a>
            </div>
          </div>
        </div>
      )}

      {/* Section 7 - Banner */}
      <div className="section-5">
        <div className="container">
          <a className="inner-image" href="#">
            <img alt="" src="/client/assets/images/banner-5.png" />
          </a>
        </div>
      </div>

      {/* Section 8 - Latest News */}
      <div className="section-8">
        <div className="container">
          <h2 className="box-title" data-aos="fade-up" data-aos-duration="800">
            <T ns="home" k="latestNews" />
          </h2>
          <div className="inner-wrap">
            <div className="blog-item-1">
              <a href="#">
                <div className="inner-image">
                  <img alt="" src="/client/assets/images/blog-1.png" />
                </div>
                <div className="inner-content">
                  <div className="inner-date">23/05/2024</div>
                  <h3 className="inner-title">Fairytale Homestay in the Heart of Da Lat</h3>
                </div>
              </a>
            </div>
            <div className="blog-item-2">
              <a href="#">
                <div className="inner-image">
                  <img alt="" src="/client/assets/images/blog-2.png" />
                </div>
                <div className="inner-content">
                  <div className="inner-date">23/05/2024</div>
                  <h3 className="inner-title">Top 5 Unique Check-In Spots in Singapore</h3>
                  <div className="inner-desc">
                    If you think traveling to Singapore is boring because it&apos;s just surrounded
                    by cold concrete blocks, think again.
                  </div>
                </div>
              </a>
            </div>
            <div className="blog-item-1">
              <a href="#">
                <div className="inner-image">
                  <img alt="" src="/client/assets/images/blog-3.png" />
                </div>
                <div className="inner-content">
                  <div className="inner-date">23/05/2024</div>
                  <h3 className="inner-title">Must-Try Local Dishes in Da Nang – Hoi An</h3>
                </div>
              </a>
            </div>
            <div className="blog-item-1">
              <a href="#">
                <div className="inner-image">
                  <img alt="" src="/client/assets/images/blog-4.png" />
                </div>
                <div className="inner-content">
                  <div className="inner-date">23/05/2024</div>
                  <h3 className="inner-title">Fairytale Homestay in the Heart of Da Lat</h3>
                </div>
              </a>
            </div>
            <div className="blog-item-1">
              <a href="#">
                <div className="inner-image">
                  <img alt="" src="/client/assets/images/blog-5.png" />
                </div>
                <div className="inner-content">
                  <div className="inner-date">23/05/2024</div>
                  <h3 className="inner-title">Fairytale Homestay in the Heart of Da Lat</h3>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
