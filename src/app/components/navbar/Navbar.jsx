"use client";
import Link from "next/link";
import React from "react";
import styles from "./page.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const ADMIN_EMAIL = "admin@example.com"; // Set your admin email here

const link = [
  { id: 1, title: "Home", url: "/" },
  { id: 4, title: "About", url: "/about" },
  { id: 5, title: "Contact", url: "/contact" },
  { id: 3, title: "Blog", url: "/blog" },
  { id: 2, title: "Portfolio", url: "/portfolio" },
  // Dashboard will be conditionally rendered
];

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        HITCON
      </Link>
      <div className={styles.links}>
        <DarkModeToggle />
        {link.map((link) => (
          <Link key={link.id} href={link.url} className={styles.link}>
            {link.title}
          </Link>
        ))}
        {/* Show Dashboard link only for admin */}
        {isAdmin && (
          <Link href="/dashboard" className={styles.link}>
            Dashboard
          </Link>
        )}
        {/* Show Login/Logout button */}
        {status === "authenticated" ? (
          <button
            className={styles.logout}
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </button>
        ) : (
          <button
            className={styles.login}
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
