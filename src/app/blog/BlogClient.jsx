"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";

export default function BlogClient({ blogs }) {
  const [search, setSearch] = useState("");

  const filtered = blogs.filter((blog) =>
    (blog.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className={styles.blogLayout}>
      <div className={styles.leftSidebar}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}><FiSearch /></span>
          <input
            type="text"
            placeholder="Search by blog title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      <div className={styles.mainContainer}>
        {filtered.length === 0 ? (
          <div className={styles.noBlogs}>No blogs found. Create one!</div>
        ) : (
          filtered.map((blog) => (
            <Link
              href={`/blog/${blog._id.toString()}`}
              className={styles.container}
              key={blog._id.toString()}
              prefetch={false}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={blog.img || "/fallback-image.jpg"}
                  alt={blog.title || "Blog image"}
                  width={400}
                  height={250}
                  className={styles.image}
                  priority={false}
                />
              </div>
              <div className={styles.content}>
                <h1 className={styles.title}>{blog.title || "Untitled Blog"}</h1>
                <p className={styles.desc}>
                  {blog.desc || "No description provided."}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}