"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

const Contact = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    setStatusMsg("Sending...");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatusMsg("Message sent!");
        setForm({ name: "", email: "", message: "" });
      } else {
        const err = await res.json();
        setStatusMsg("Failed: " + err.error);
      }
    } catch (err) {
      setStatusMsg("Failed to send.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Let's Keep In Touch</h1>
      <div className={styles.content}>
        <div className={styles.imgContainer}>
          <Image
            className={styles.img}
            src="/contact.png"
            alt="Contact"
            fill={true}
          />
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            className={styles.textArea}
          />
          <button type="submit" className={styles.button}>
            Send
          </button>
          <div>{statusMsg}</div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
