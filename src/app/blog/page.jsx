import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import clientPromise from "@/lib/db";
import BlogClient from "./BlogClient";

// Server function to fetch blogs
const getBlogs = async () => {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); // Use env variable
    const blogs = await db
      .collection("posts")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
};

const Blog = async () => {
  const blogs = await getBlogs();
  return <BlogClient blogs={blogs} />;
};

export default Blog;
