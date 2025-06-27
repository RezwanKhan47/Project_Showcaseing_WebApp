"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "admin@example.com"; // Set your admin email here

const ContactDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect non-admin users to login
  useEffect(() => {
    if (status === "authenticated") {
      if (!session?.user || session.user.email !== ADMIN_EMAIL) {
        router.replace("/login");
      }
    } else if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email === ADMIN_EMAIL) {
      fetch("/api/contact")
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
          setLoading(false);
        });
    }
  }, [status, session]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((msgs) => msgs.filter((msg) => msg._id !== id));
    } else {
      alert("Failed to delete message.");
    }
  };

  if (status === "loading" || loading)
    return <div className={styles.loading}>Loading...</div>;

  // Only admin can see the dashboard
  if (!session?.user || session.user.email !== ADMIN_EMAIL) return null;

  return (
    <div className={styles.fullPage}>
      <div className={styles.headerArea}>
        <h1 className={styles.heading}>Contact Messages</h1>
        <p className={styles.subheading}>
          View and reply to user messages. Only authenticated users can send
          messages.
        </p>
      </div>
      <div className={styles.grid}>
        {messages.length === 0 && (
          <p className={styles.noMessages}>No messages found.</p>
        )}
        {messages.map((msg) => (
          <div key={msg._id} className={styles.card}>
            <button
              className={styles.deleteButtonX}
              onClick={() => handleDelete(msg._id)}
              type="button"
              aria-label="Delete message"
            >
              ×
            </button>
            <div className={styles.info}>
              <p>
                <span className={styles.label}>Name:</span> {msg.name}
              </p>
              <p>
                <span className={styles.label}>Email:</span> {msg.email}
              </p>
              <p>
                <span className={styles.label}>Message:</span> {msg.message}
              </p>
            </div>
            <ReplyForm userEmail={msg.email} />
          </div>
        ))}
      </div>
    </div>
  );
};

const ReplyForm = ({ userEmail }) => {
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("");

  const handleReply = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    const res = await fetch("/api/contact/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, message: reply }),
    });
    if (res.ok) {
      setStatus("Reply sent!");
      setReply("");
    } else {
      setStatus("Failed to send reply.");
    }
  };

  return (
    <form onSubmit={handleReply} className={styles.replyForm}>
      <input
        type="text"
        placeholder="Type your reply"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        required
        className={styles.input}
      />
      <button type="submit" className={styles.greenButton}>
        Send Reply
      </button>
      <div className={styles.status}>{status}</div>
    </form>
  );
};

export default ContactDashboard;