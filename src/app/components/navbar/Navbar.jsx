"use client";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./page.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const ADMIN_EMAIL = "admin@example.com"; // Set your admin email here

const link = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "Portfolio", url: "/portfolio" },
  { id: 3, title: "Blog", url: "/blog" },
  { id: 4, title: "About", url: "/about" },
  { id: 5, title: "Contact", url: "/contact" },
  // Dashboard will be conditionally rendered
];

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className={styles.container}>
      <Link href="/" className={styles.logo}>
        HITCON
      </Link>
      <div className={styles.links}>
        <DarkModeToggle />
        {link.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            className={`${styles.link} ${
              pathname === link.url ? styles.linkActive : ""
            }`}
          >
            {link.title}
          </Link>
        ))}
        {isAdmin && (
          <Link href="/dashboard" className={styles.link}>
            Dashboard
          </Link>
        )}
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
      <button
        className={styles.drawerToggle}
        onClick={() => setDrawerOpen(true)}
        aria-label="Open menu"
      >
        &#9776;
      </button>
      {drawerOpen && (
        <div className={styles.drawer}>
          <button
            className={styles.drawerClose}
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
          <DarkModeToggle />
          {link.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className={`${styles.link} ${
                pathname === link.url ? styles.linkActive : ""
              }`}
              onClick={() => setDrawerOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/dashboard"
              className={styles.link}
              onClick={() => setDrawerOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {status === "authenticated" ? (
            <button
              className={styles.logout}
              onClick={() => {
                signOut({ callbackUrl: "/login" });
                setDrawerOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className={styles.login}
              onClick={() => {
                router.push("/login");
                setDrawerOpen(false);
              }}
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
