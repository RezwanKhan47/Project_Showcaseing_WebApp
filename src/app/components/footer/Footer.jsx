import React from "react";
import styles from "./page.module.css";
import Image from "next/image";

const Footer = () => {
return (
  <div>
    <div className={styles.container}>

    </div>

    <div className={styles.social}>
      <Image src="/1.png" width={25} height={25} className={styles.icon}alt="error" />
      <Image src="/2.png" width={25} height={25} className={styles.icon}alt="error" />
      <Image src="/3.png" width={25} height={25} className={styles.icon}alt="error" />
      <Image src="/4.png" width={25} height={25} className={styles.icon}alt="error" />
    </div>
  </div>
);
};
export default Footer;
