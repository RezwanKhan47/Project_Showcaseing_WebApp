"use client";
import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import styles from "./page.module.css";

const ADMIN_EMAIL = "rezwanadmin@gmail.com"; // Set your admin email here

const Login = () => {
  const [admin, setAdmin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState(""); // "admin" or "user"
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      username: admin.username,
      password: admin.password,
      redirect: false,
    });
    if (res.ok) {
      setLoginType("admin");
      router.push("/dashboard");
    } else {
      setError("Invalid admin credentials");
    }
  };

  const handleGoogleLogin = () => {
    setLoginType("user");
    signIn("google", { callbackUrl: "/dashboard" });
  };

  // If logged in, show logout (and dashboard for admin)
  if (status === "authenticated") {
    const isAdmin = session.user.email === ADMIN_EMAIL;
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>
          {isAdmin ? "You are logged in as Admin." : "You are logged in."}
        </h1>
        {isAdmin && (
          <button
            className={styles.button}
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </button>
        )}
        <button
          className={styles.button}
          style={{ marginTop: "20px", background: "#e74c3c" }}
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </button>
      </div>
    );
  }

  // If not logged in, show login form/buttons
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome Back</h1>
      <h2 className={styles.subtitle}>Please sign in to see the dashboard.</h2>

      <form onSubmit={handleAdminLogin} className={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Admin Username"
          value={admin.username}
          onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
          required
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={admin.password}
          onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          {loginType === "admin" ? "Admin" : "Login as Admin"}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
      <button
        onClick={handleGoogleLogin}
        className={styles.button + " " + styles.google}
      >
        <FcGoogle size={24} />
        {loginType === "user" ? "User" : "Login with Google"}
      </button>
    </div>
  );
};

export default Login;
