"use client";
import React, { useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "admin@example.com"; // Set your admin email here

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Only redirect if session and session.user exist
      if (!session?.user || session.user.email !== ADMIN_EMAIL) {
        router.replace("/login");
      }
    } else if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, session, router]);

  if (status === "loading") return <div>Loading...</div>;

  // Only admin can see the dashboard
  if (!session?.user || session.user.email !== ADMIN_EMAIL) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Dashboard</h1>
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
