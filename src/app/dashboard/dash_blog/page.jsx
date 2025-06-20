"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FiEdit } from "react-icons/fi"; // Add this import at the top

const ADMIN_EMAIL = "admin@example.com"; // <-- set your admin email here

const DashBlog = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    // If not logged in or not admin, redirect to login
    if (!session || session.user.email !== ADMIN_EMAIL) {
      router.push("/login");
    }
  }, [session, status, router]);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    content: "",
    img: "",
    author: "",
    authorImage: "",
  });
  const [editingId, setEditingId] = useState(null);

  // SWR Data Fetching
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(
    `/api/blogs`, // <-- changed from /api/posts to /api/blogs
    fetcher
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      desc: post.desc,
      content: post.content,
      img: post.img,
      author: post.author,
      authorImage: post.authorImage,
    });
    setEditingId(post._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Edit mode: send PUT request
        await fetch(`/api/blogs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        setEditingId(null);
      } else {
        // Create mode: send POST request
        await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setFormData({
        title: "",
        desc: "",
        content: "",
        img: "",
        author: "",
        authorImage: "",
      });
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/blogs/${id}`, {
        // <-- changed from /api/posts to /api/blogs
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  if (status === "loading" || !session || session.user.email !== ADMIN_EMAIL) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.posts}>
        {isLoading
          ? "loading"
          : data?.map((post) => (
              <div className={styles.post} key={post._id}>
                <div className={styles.imgContainer}>
                  <Image
                    src={post.img || "/default-image.jpg"}
                    alt=""
                    width={200}
                    height={100}
                  />
                </div>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <span
                  className={styles.delete}
                  onClick={() => handleDelete(post._id)}
                >
                  X
                </span>
                <span
                  className={styles.edit}
                  onClick={() => handleEdit(post)}
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  title="Edit"
                >
                  <FiEdit size={18} />
                </span>
              </div>
            ))}
      </div>

      <form className={styles.new} onSubmit={handleSubmit}>
        <h1>Add New Post</h1>
        <input
          type="text"
          name="title"
          placeholder="Title"
          className={styles.input}
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="desc"
          placeholder="Description"
          className={styles.input}
          value={formData.desc}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="img"
          placeholder="Image URL"
          className={styles.input}
          value={formData.img}
          onChange={handleChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          className={styles.input}
          value={formData.author}
          onChange={handleChange}
        />
        <input
          type="text"
          name="authorImage"
          placeholder="Author Image URL"
          className={styles.input}
          value={formData.authorImage}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Content"
          className={styles.textArea}
          cols="30"
          rows="10"
          value={formData.content}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className={styles.button}>
          {editingId ? "Update" : "Send"}
        </button>
      </form>
    </div>
  );
};

export default DashBlog;
