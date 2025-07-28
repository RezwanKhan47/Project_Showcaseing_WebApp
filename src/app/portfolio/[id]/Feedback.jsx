"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { FaStar, FaTrash, FaEdit } from "react-icons/fa";
import Image from "next/image";

export default function Feedback({ projectId, session }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch feedbacks
  useEffect(() => {
    fetch(`/api/portfolio-feedback?projectId=${projectId}`)
      .then((res) => res.json())
      .then(setFeedbacks);
  }, [projectId]);

  // Fetch user info from googleUsers collection
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/googleUser?email=${session.user.email}`)
        .then((res) => res.json())
        .then(setUserInfo);
    }
  }, [session?.user?.email]);

  // Handle submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      projectId,
      stars,
      comment,
      user: session?.user?.email,
      name: userInfo?.name,
      image: userInfo?.image,
      feedbackId: editingId,
    };
    await fetch("/api/portfolio-feedback", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setStars(0);
    setComment("");
    setEditingId(null);
    fetch(`/api/portfolio-feedback?projectId=${projectId}`)
      .then((res) => res.json())
      .then(setFeedbacks);
  };

  // Handle edit
  const handleEdit = (f) => {
    setStars(f.stars);
    setComment(f.comment);
    setEditingId(f._id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    await fetch(`/api/portfolio-feedback?feedbackId=${id}`, {
      method: "DELETE",
    });
    fetch(`/api/portfolio-feedback?projectId=${projectId}`)
      .then((res) => res.json())
      .then(setFeedbacks);
    if (editingId === id) {
      setStars(0);
      setComment("");
      setEditingId(null);
    }
  };

  return (
    <div className={styles.feedbackSection}>
      <h2>Feedback</h2>
      {session ? (
        <form onSubmit={handleSubmit} className={styles.feedbackForm}>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <FaStar
                key={n}
                size={24}
                color={n <= stars ? "#53c28b" : "#222"}
                style={{ cursor: "pointer" }}
                onClick={() => setStars(n)}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave your feedback..."
            rows={3}
            className={styles.feedbackInput}
            required
          />
          <button type="submit" className={styles.feedbackBtn}>
            {editingId ? "Update Feedback" : "Submit Feedback"}
          </button>
          {editingId && (
            <button
              type="button"
              className={styles.feedbackBtn}
              style={{
                background: "#222",
                color: "#53c28b",
                marginLeft: "1rem",
              }}
              onClick={() => {
                setStars(0);
                setComment("");
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      ) : (
        <p>Please login to leave feedback.</p>
      )}

      <div className={styles.feedbackList}>
        <h3>All Reviews</h3>
        {feedbacks.length === 0 && <p>No feedback yet.</p>}
        {feedbacks.map((f) => (
          <div key={f._id} className={styles.feedbackItem}>
            <div className={styles.feedbackUserInfo}>
              <Image
                src={f.image || "/default-avatar.jpg"}
                alt={f.name || "User"}
                width={28}
                height={28}
                className={styles.feedbackAvatar}
              />
              <span className={styles.feedbackUser}>
                {f.name || "Anonymous"}
              </span>
              {[1, 2, 3, 4, 5].map((n) => (
                <FaStar
                  key={n}
                  size={16}
                  color={n <= f.stars ? "#53c28b" : "#222"}
                />
              ))}
              {session?.user?.email === f.user && (
                <>
                  <button
                    className={styles.feedbackAction}
                    title="Edit"
                    onClick={() => handleEdit(f)}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className={styles.feedbackAction}
                    title="Delete"
                    onClick={() => handleDelete(f._id)}
                  >
                    <FaTrash size={16} />
                  </button>
                </>
              )}
            </div>
            <div className={styles.feedbackComment}>{f.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
