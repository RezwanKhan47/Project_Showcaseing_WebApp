import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import clientPromise from "@/lib/db";

const getBlogs = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("yourDatabaseName"); // replace with your DB name
    const blogs = await db.collection("posts").find().toArray(); // <-- changed to "posts"
    return blogs;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
};

const Blog = async () => {
  const blogs = await getBlogs();

  return (
    <div className={styles.mainContainer}>
      {blogs.map((blog) => (
        <Link
          href={`/blog/${blog._id.toString()}`}
          className={styles.container}
          key={blog._id.toString()}
        >
          <div className={styles.imageContainer}>
            <Image
              src={blog.img || "/building.jpg"}
              alt={blog.title}
              width={400}
              height={250}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>{blog.title}</h1>
            <p className={styles.desc}>{blog.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Blog;