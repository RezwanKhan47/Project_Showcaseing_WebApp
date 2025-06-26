"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../page.module.css"

export default function Carousel({ images }) {
  const [idx, setIdx] = useState(0);

  // Reset index if images change
  useEffect(() => {
    setIdx(0);
  }, [images]);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setIdx((prevIdx) => (prevIdx + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className={styles.carousel} tabIndex={0}>
      <div className={styles.carouselImgWrapper}>
        <Image
          src={images[idx]}
          alt={`Project image ${idx + 1}`}
          width={1200}
          height={600}
          className={styles.carouselImg}
          priority
        />
      </div>
      {images.length > 1 && (
        <div className={styles.carouselControls}>
          <button
            onClick={() => setIdx((idx - 1 + images.length) % images.length)}
            aria-label="Previous image"
            disabled={images.length <= 1}
            type="button"
          >
            &lt;
          </button>
          <span>
            {idx + 1} / {images.length}
          </span>
          <button
            onClick={() => setIdx((idx + 1) % images.length)}
            aria-label="Next image"
            disabled={images.length <= 1}
            type="button"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
