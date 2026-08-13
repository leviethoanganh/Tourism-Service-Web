"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import TourCard from "@/components/tour/TourCard";
import { Tour } from "@/types";

interface Props {
  tours: Tour[];
}

export default function HomeSection2({ tours }: Props) {
  const expireDate = new Date("2025-10-28T20:00:00");
  const [time, setTime] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = expireDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (24 * 3600 * 1000));
        const hours = Math.floor((diff / 3600000) % 24);
        const mins = Math.floor((diff / 60000) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setTime({
          days: days < 10 ? `0${days}` : `${days}`,
          hours: hours < 10 ? `0${hours}` : `${hours}`,
          minutes: mins < 10 ? `0${mins}` : `${mins}`,
          seconds: secs < 10 ? `0${secs}` : `${secs}`,
        });
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!tours.length) return null;

  return (
    <div className="section-2">
      <div className="container">
        <div className="inner-wrap">
          <div className="inner-info">
            <h2 className="inner-title" data-aos="fade-up" data-aos-duration="800">
              2024 DEALS
              <br />
              LAST MINUTE TOURS
            </h2>
            <p className="inner-desc" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            </p>
            <div className="inner-clock-title" data-aos="fade-up" data-aos-duration="800" data-aos-delay="400">
              Ends in
            </div>
            <div className="inner-clock-number" data-aos="fade-up" data-aos-duration="800" data-aos-delay="400">
              {[
                { val: time.days, label: "Days" },
                { val: time.hours, label: "Hours" },
                { val: time.minutes, label: "Minutes" },
                { val: time.seconds, label: "Seconds" },
              ].map(({ val, label }) => (
                <div key={label} className="inner-item">
                  <div className="inner-number">{val}</div>
                  <div className="inner-label">{label}</div>
                </div>
              ))}
            </div>
            <div className="inner-discount-title" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600">
              UP TO
            </div>
            <div className="inner-discount-price" data-aos="fade-up" data-aos-duration="800" data-aos-delay="600">
              990,000<span>VND</span>
            </div>
          </div>

          <div className="inner-list" data-aos="fade-up" data-aos-duration="800" data-aos-delay="800">
            <Swiper
              className="swiperSection2"
              modules={[Autoplay]}
              slidesPerView={1}
              spaceBetween={20}
              loop={true}
              autoplay={{ delay: 4000 }}
              breakpoints={{
                992: { slidesPerView: 2 },
                1200: { slidesPerView: 3 },
              }}
            >
              {tours.map((tour) => (
                <SwiperSlide key={tour._id}>
                  <TourCard tour={tour} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
