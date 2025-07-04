import React from "react";
import styles from "./page.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <div>
      <div className={styles.container}></div>

      <div className={styles.social}>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/1.png"
            width={25}
            height={25}
            className={styles.icon}
            alt="Facebook"
          />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/2.png"
            width={25}
            height={25}
            className={styles.icon}
            alt="Instagram"
          />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <Image
            src="/3.png"
            width={25}
            height={25}
            className={styles.icon}
            alt="Twitter"
          />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <Image
            src="/4.png"
            width={25}
            height={25}
            className={styles.icon}
            alt="YouTube"
          />
        </a>
      </div>
    </div>
  );
};

export default Footer;
