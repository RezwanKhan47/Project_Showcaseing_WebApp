import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle} >Dashboard</h1>
      <h1 className={styles.selectTitle}>Only for Admin</h1>
      <div className={styles.items}>
        <Link href="/dashboard/dash_blog" className={styles.item}>
          <span className={styles.title}>Blogs</span>
        </Link>
        <Link href="/dashboard/dash_contact" className={styles.item}>
          <span className={styles.title}>Contacts</span>
        </Link>
        <Link href="/dashboard/dash_portfolio" className={styles.item}>
          <span className={styles.title}>Projects</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
