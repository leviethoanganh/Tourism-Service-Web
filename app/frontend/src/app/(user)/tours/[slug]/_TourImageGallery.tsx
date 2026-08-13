"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import type { Swiper as SwiperType } from "swiper";

interface Props {
  images: string[];
  avatar: string;
  name: string;
}

export default function TourImageGallery({ images, avatar, name }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const allImages = images?.length > 0 ? images : [avatar];

  return (
    <div className="box-images">
      <div className="inner-image-main">
        <Swiper
          className="swiperImagesMain"
          modules={[Thumbs]}
          loop={true}
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
        >
          {allImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="inner-image">
                <img alt={name} src={img} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="inner-image-thumb">
        <Swiper
          className="swiperImagesThumb"
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={5}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          breakpoints={{ 576: { spaceBetween: 10 } }}
        >
          {allImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="inner-image">
                <img alt="" src={img} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
