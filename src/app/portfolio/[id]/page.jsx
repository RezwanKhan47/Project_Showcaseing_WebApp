import React from "react";
import styles from "./page.module.css";
import Button from "@/app/components/button/button";
import Image from "next/image";

const PortfolioPost = ({ params }) => {
  return (
    <div className={styles.catagory}>
      <h1 className={styles.catTitle}>{params.catagory}</h1>
      <div className={styles.item}>
        <div className={styles.contect}>
          <h1 className={styles.title}>Title</h1>
          <p className={styles.desc}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatibus, quisquam voluptatibus, quisquam voluptatibus,
            quisquam voluptatibus, quisquam voluptatibus, quisquam
            voluptatibus, quisquam voluptatibus, quisquam voluptatibus,
            quisquam voluptatibus, quisquam voluptatibus, quisquam
            voluptatibus, quisquam voluptatibus, quisquam voluptatibus,
            quisquam voluptatibus, quisquam voluptatibus.</p>
            <Button url="#" text="See More" />
        </div>
        <div className={styles.imgContainer}>
          <Image
            className={styles.img}
            src="/building.jpg"
            fill={true}
            alt=""
            />
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.contect}>
          <h1 className={styles.title}>Title</h1>
          <p className={styles.desc}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatibus, quisquam voluptatibus, quisquam voluptatibus,
            quisquam voluptatibus, quisquam voluptatibus, quisquam
            voluptatibus, quisquam voluptatibus, quisquam voluptatibus,
            quisquam voluptatibus, quisquam voluptatibus, quisquam
            voluptatibus, quisquam voluptatibus, quisquam voluptatibus,
            quisquam voluptatibus, quisquam voluptatibus.</p>
            <Button url="#" text="See More" />
        </div>
        <div className={styles.imgContainer}>
          <Image
            className={styles.img}
            src="/building.jpg"
            fill={true}
            alt=""
            />
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.contect}>
          <h1 className={styles.title}>Title</h1>
          <p className={styles.desc}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatibus, quisquam voluptatibus, quisquam voluptatibus,
            quisquam voluptatibus, quisquam voluptatibus, quisquam
            voluptatibus, quisquam voluptatibus, quisquam voluptatibus,
            quisquam voluptatibus, quisquam voluptatibus, quisquam
            voluptatibus, quisquam voluptatibus, quisquam voluptatibus,
            quisquam voluptatibus, quisquam voluptatibus.</p>
            <Button url="#" text="See More" />
        </div>
        <div className={styles.imgContainer}>
          <Image
            className={styles.img}
            src="/building.jpg"
            fill={true}
            alt=""
            />
        </div>
      </div>
    </div>
  );
};

export default PortfolioPost;
