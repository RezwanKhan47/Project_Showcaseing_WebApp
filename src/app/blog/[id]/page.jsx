import React from "react";
import styles from "./page.module.css";
import Image from "next/image";



const BlogPost =  () => {
 
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.info}>
          <h1 className={styles.title}>Test</h1>
          <p className={styles.desc}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatibus, quos, voluptates, voluptatibus, quos, voluptates,
            voluptatibus, quos, voluptates, voluptatibus, quos, voluptates,
            voluptatibus, quos, voluptates.
          </p>
          <div className={styles.author}>
            <Image
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww.jpg"
              alt=""
              width={40}
              height={40}
              className={styles.avatar}
            />
            <span className={styles.username}>Rezwan Khan</span>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/building.jpg"
            alt=""
            fill={true}
            className={styles.image}
          />
        </div>
      </div>
      <div className={styles.content}>
        <p className={styles.text}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          voluptatibus, quos, voluptates, voluptatibus, quos, voluptates,
          voluptatibus, quos, voluptates, voluptatibus, quos, voluptates,
          voluptatibus, quos, voluptates.
        </p>
      </div>
    </div>
  );
};

export default BlogPost;
