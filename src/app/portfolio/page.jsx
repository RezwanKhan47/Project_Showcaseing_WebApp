import React from "react";
import styles from "./page.module.css";
import Button from "@/app/components/button/button";
import Image from "next/image";
import clientPromise from "@/lib/db";

// Server Component: fetch data from MongoDB
async function getProjects() {
  const client = await clientPromise;
  const db = client.db("yourDatabaseName");
  const projects = await db
    .collection("project")
    .find({}, { projection: { title: 1, images: 1, location: 1 } })
    .toArray();
  return projects.map((p) => ({
    _id: p._id.toString(),
    title: p.title,
    location: p.location || "Unknown Location",
    img:
      Array.isArray(p.images) && p.images.length > 0
        ? p.images[0]
        : "/building.jpg", // fallback image
  }));
}

const Portfolio = async () => {
  const projects = await getProjects();

  return (
    <div className={styles.catagory}>
      <h1 className={styles.catTitle}>Portfolio</h1>
      {projects.map((item) => (
        <div className={styles.item} key={item._id}>
          <div className={styles.contect}>
            <h1 className={styles.title}>{item.title}</h1>
            <p className={styles.location}>{item.location}</p>
            <Button url={`/portfolio/${item._id}`} text="See More" />
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
};

export default Portfolio;
