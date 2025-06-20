import React from "react";
import styles from "./page.module.css";
import Button from "@/app/components/button/button";
import Image from "next/image";

const portfolioItems = [
  {
    title: "Modern Building",
    desc: "A modern building design with sustainable materials and innovative architecture.",
    img: "/building.jpg",
    url: "#",
  },
  {
    title: "Creative Workspace",
    desc: "A creative workspace that inspires productivity and collaboration.",
    img: "/building.jpg",
    url: "#",
  },
  {
    title: "Urban Landscape",
    desc: "An urban landscape project focusing on green spaces and community areas.",
    img: "/building.jpg",
    url: "#",
  },
];

const Portfolio = () => (
  <div className={styles.catagory}>
    <h1 className={styles.catTitle}>Portfolio</h1>
    {portfolioItems.map((item, idx) => (
      <div className={styles.item} key={idx}>
        <div className={styles.contect}>
          <h1 className={styles.title}>{item.title}</h1>
          <p className={styles.desc}>{item.desc}</p>
          <Button url={item.url} text="See More" />
        </div>
        <div className={styles.imgContainer}>
          <Image
            className={styles.img}
            src={item.img}
            fill={true}
            alt={item.title}
          />
        </div>
      </div>
    ))}
  </div>
);

export default Portfolio;
