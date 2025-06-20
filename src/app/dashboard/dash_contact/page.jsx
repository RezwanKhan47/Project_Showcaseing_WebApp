"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

const ContactDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;

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
