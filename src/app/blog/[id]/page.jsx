import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Feedback from "./Feedback";

const getBlogPost = async (id) => {
  try {
    if (!ObjectId.isValid(id)) return null;

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const blog = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });

    return blog ? JSON.parse(JSON.stringify(blog)) : null;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
};

const BlogPost = async (props) => {
  const params = await props.params;
  const { id } = params;
  const blog = await getBlogPost(id);
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (!blog) {
    return (
      <div className={styles.notFound}>
        <h1>404 - Blog post not found</h1>
        <Link href="/blog">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.info}>
          <h1 className={styles.title}>{blog.title || "Untitled Post"}</h1>
          <p className={styles.desc}>{blog.desc || "No description"}</p>
          <div className={styles.author}>
            <Image
              src={blog.authorImage || "/default-avatar.jpg"}
              alt={blog.author || "Unknown author"}
              width={40}
              height={40}
              className={styles.avatar}
              priority={false}
            />
            <span className={styles.username}>
              {blog.author || "Anonymous"}
            </span>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src={blog.img || "/fallback-image.jpg"}
            alt={blog.title || "Blog image"}
            fill
            className={styles.image}
            priority={true}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
      <div className={styles.content}>
        <p className={styles.text}>{blog.content || "No content available."}</p>
      </div>
      <Feedback blogId={id} session={session} />
    </div>
  );
};

export default BlogPost;
