"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useTranslation } from "@/hooks/useTranslation";

const banners = [
  "/client/assets/images/banner-1.png",
  "/client/assets/images/banner-2.png",
  "/client/assets/images/banner-3.png",
  "/client/assets/images/banner-3.png",
  "/client/assets/images/banner-3.png",
];

export default function HomeSection3() {
  const { t } = useTranslation();
  return (
    <div className="section-3">
      <div className="container">
        <h2 className="box-title" data-aos="fade-up" data-aos-duration="800">
          {t.home.explosiveDealsTitle}
        </h2>
        <div className="inner-wrap" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
          <Swiper
            className="swiperSection3"
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={20}
            loop={true}
            autoplay={{ delay: 4000 }}
            pagination={{ clickable: true }}
            breakpoints={{
              576: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
            }}
          >
            {banners.map((src, i) => (
              <SwiperSlide key={i}>
                <div className="inner-item">
                  <a href="#">
                    <img alt="" src={src} />
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
