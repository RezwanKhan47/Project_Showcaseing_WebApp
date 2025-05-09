'use client'
import Link from 'next/link'
import React from 'react'
import styles from "./page.module.css";

const link =[
{
  id: 1,
  title: "Home",
  url: "/",
},
{
  id: 4,
  title: "About",
  url: "/about",
},
{
  id: 5,
  title: "Contact",
  url: "/contact",
},
{
  id: 3,
  title: "Blog",
  url: "/blog",
},
{
  id: 2,
  title: "Portfolio",
  url: "/portfolio",
},
{
  id: 6,
  title: "Dashboard",
  url: "/dashboard",
}
];

const Navbar = () => {
  return (
 
    
    <div className={styles.container} >
        <Link href="/" className={styles.logo}>HITCON</Link>

        <div className={styles.links}>
        {link.map((link) => (
          <Link key={link.id} href={link.url} className={styles.link}>
            {link.title}
          </Link>
        ))}
        <button className={styles.logout}
        onClick={() => { console.log("Logout"); }}
        >
          Logout
        </button>

        </div>
      </div>
  )
}

export default Navbar