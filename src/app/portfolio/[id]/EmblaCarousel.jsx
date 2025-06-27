"use client";
import React, { useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import styles from "./page.module.css";

export default function EmblaCarousel({ images, title }) {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  if (!images || images.length === 0) return null;

  return (
    <div className={styles.embla} ref={emblaRef}>
      <div className={styles.embla__container}>
        {images.map((img, idx) => (
          <div className={styles.embla__slide} key={idx}>
            <div className={styles.embla__imageWrapper}>
              <Image
                src={img}
                alt={`${title} image ${idx + 1}`}
                fill
                className={styles.embla__img}
                sizes="(max-width: 700px) 100vw, 800px"
                priority={idx === 0}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
