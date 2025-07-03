import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import clientPromise from "@/lib/db";

const getBlogs = async () => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); // Use env variable
    const blogs = await db
      .collection("posts")
      .find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray();
    return JSON.parse(JSON.stringify(blogs)); // Fix Next.js serialization issue
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
};

const Blog = async () => {
  const blogs = await getBlogs();

  if (blogs.length === 0) {
    return <div className={styles.noBlogs}>No blogs found. Create one!</div>;
  }

  return (
    <div className={styles.mainContainer}>
      {blogs.map((blog) => (
        <Link
          href={`/blog/${blog._id.toString()}`}
          className={styles.container}
          key={blog._id.toString()}
          prefetch={false} // Disable prefetch for better performance
        >
          <div className={styles.imageContainer}>
            <Image
              src={blog.img || "/fallback-image.jpg"}
              alt={blog.title || "Blog image"}
              width={400}
              height={250}
              className={styles.image}
              priority={false} // Lazy load images
            />
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>{blog.title || "Untitled Blog"}</h1>
            <p className={styles.desc}>
              {blog.desc || "No description provided."}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Blog;