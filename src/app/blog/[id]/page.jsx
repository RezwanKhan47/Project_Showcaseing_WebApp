// "use client";
import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const getBlogPost = async (id) => {
  try {
    if (!ObjectId.isValid(id)) return null;
    const client = await clientPromise;
    const db = client.db("yourDatabaseName"); // <-- use your real DB name
    const blog = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });
    return blog;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
};

const BlogPost = async ({ params }) => {
  const { id } = params;
  const blog = await getBlogPost(id);

  // Server-side session check
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (!blog) {
    return <div>Blog post not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.info}>
          <h1 className={styles.title}>{blog.title}</h1>
          <p className={styles.desc}>{blog.desc}</p>
          <div className={styles.author}>
            <Image
              src={
                blog.authorImage ||
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww.jpg"
              }
              alt={blog.author || "Author"}
              width={40}
              height={40}
              className={styles.avatar}
            />
            <span className={styles.username}>
              {blog.author || "Rezwan Khan"}
            </span>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src={blog.img || "/building.jpg"}
            alt={blog.title}
            fill={true}
            className={styles.image}
          />
        </div>
      </div>
      <div className={styles.content}>
        <p className={styles.text}>{blog.content}</p>
      </div>
    </div>
  );
};

export default BlogPost;
