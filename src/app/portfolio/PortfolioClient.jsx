"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Button from "@/app/components/button/button";
import Image from "next/image";

export default function PortfolioClient({ projects, session }) {
  const [search, setSearch] = useState("");

  const handleClearSearch = () => {
    setSearch("");
  };

  const filtered = projects.filter((item) =>
    item.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.catagory}>
      <h1 className={styles.catTitle}>Our Works</h1>
      
      {/* Enhanced Dark Search Bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        {search && (
          <button 
            onClick={handleClearSearch} 
            className={styles.clearButton}
          >
            ✕
          </button>
        )}
      </div>

      {/* Rest of your code remains unchanged */}
      {filtered.map((item) => (
        <div className={styles.item} key={item._id}>
          <div className={styles.contect}>
            <h1 className={styles.title}>{item.title}</h1>
            <p className={styles.location}>{item.location}</p>
            <Button
              url={session ? `/portfolio/${item._id}` : "/login"}
              text="See More"
            />
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
      {filtered.length === 0 && (
        <div className={styles.noResults}>
          No projects found for this location.
        </div>
      )}
    </div>
  );
}