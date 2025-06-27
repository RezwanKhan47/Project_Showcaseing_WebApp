"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./page.module.css";

export default function Carousel({ images, title }) {
  if (!images || images.length === 0) return null;
  return (
    <div className={styles.carousel}>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        className={styles.swiper}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <div className={styles.imageContainer}>
              <Image
                src={img}
                alt={`${title} - Image ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
