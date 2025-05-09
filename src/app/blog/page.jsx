import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";



const Blog = () => {
  return (
    <div className={styles.mainContainer}>
     
        <Link href='/blog/testid' className={styles.container}>
          <div className={styles.imageContainer}>
            <Image
              src="/building.jpg"
              alt=""
              width={400}
              height={250}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>test</h1>
            <p className={styles.desc}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit consequatur exercitationem pariatur fuga qui explicabo saepe doloribus iusto in doloremque. Excepturi vitae sit nobis maxime, asperiores reprehenderit placeat. Necessitatibus, molestias.</p>
          </div>
        </Link>
        <Link href='/blog/testid' className={styles.container}>
          <div className={styles.imageContainer}>
            <Image
              src="/building.jpg"
              alt=""
              width={400}
              height={250}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>test</h1>
            <p className={styles.desc}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit consequatur exercitationem pariatur fuga qui explicabo saepe doloribus iusto in doloremque. Excepturi vitae sit nobis maxime, asperiores reprehenderit placeat. Necessitatibus, molestias.</p>
          </div>
        </Link>
        <Link href='/blog/testid' className={styles.container}>
          <div className={styles.imageContainer}>
            <Image
              src="/building.jpg"
              alt=""
              width={400}
              height={250}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>test</h1>
            <p className={styles.desc}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit consequatur exercitationem pariatur fuga qui explicabo saepe doloribus iusto in doloremque. Excepturi vitae sit nobis maxime, asperiores reprehenderit placeat. Necessitatibus, molestias.</p>
          </div>
        </Link>
      
    </div>
  );
};

export default Blog;
