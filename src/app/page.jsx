import Image from "next/image";
import styles from "./page.module.css";
import Button from "./components/button/button";


export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>Better design for your dream home.</h1>
        <p className={styles.desc}>
          We provide unmatched quality, comfort, and style for your home. Our
          team of experts is dedicated to bringing your vision to life with
          precision and care.
        </p>
        <Button url="/portfolio" text="Get Started" />
      </div>
      <div className={styles.item}>
        <Image src="/hero.png" width={500} height={500} alt="" className={styles.img} />
      </div>
    </div>
  );
}
