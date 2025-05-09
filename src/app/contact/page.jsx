import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Button from "../components/button/button";

const Contact = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Let's Keep In Touch</h1>
      <div className={styles.content}>
        <div className={styles.imgContainer}>
          <Image className={styles.img} src="/contact.png" alt="Contact" fill={true} />
        </div>
        <div className={styles.form}>
          <input type="text" placeholder="name" className={styles.input} />
          <input type="text" placeholder="email" className={styles.input} />
          <textarea placeholder="message" cols={30} rows={10} className={styles.textArea}></textarea>
          <Button url="#" text="Send" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
