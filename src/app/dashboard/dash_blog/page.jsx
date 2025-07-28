"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FiEdit } from "react-icons/fi";

const ADMIN_EMAIL = "admin@example.com"; // <-- set your admin email here

const DashBlog = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const formRef = useRef(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.email !== ADMIN_EMAIL) {
      router.push("/login");
    }
  }, [session, status, router]);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    content: "",
    img: "",
  });
  const [editingId, setEditingId] = useState(null);

  // SWR Data Fetching
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(`/api/blogs`, fetcher);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img" && files && files[0]) {
      const formDataCloud = new FormData();
      formDataCloud.append("file", files[0]);
      formDataCloud.append(
        "upload_preset",
        process.env.CLOUDINARY_UPLOAD_PRESET
      );

      fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formDataCloud,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setFormData((prev) => ({ ...prev, img: data.secure_url }));
        });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      desc: post.desc,
      content: post.content,
      img: post.img,
    });
    setEditingId(post._id);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
      const firstInput = formRef.current.querySelector("input, textarea");
      if (firstInput) firstInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/blogs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        setEditingId(null);
      } else {
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
      });
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/blogs/${id}`, {
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

      <form ref={formRef} className={styles.new} onSubmit={handleSubmit}>
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
          type="file"
          name="img"
          accept="image/*"
          className={styles.input}
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
