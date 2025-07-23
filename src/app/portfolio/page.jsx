import React from "react";
import styles from "./page.module.css";
import clientPromise from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PortfolioClient from "./PortfolioClient";

// Server Component: fetch data from MongoDB
async function getProjects() {
  const client = await clientPromise;
  const db = client.db("yourDatabaseName"); // <-- replace with your DB name
  const projects = await db
    .collection("project")
    .find({}, { projection: { title: 1, images: 1, location: 1 } })
    .toArray();
  return projects.map((p) => ({
    _id: p._id.toString(),
    title: p.title,
    location: p.location || "Unknown Location",
    img:
      Array.isArray(p.images) && p.images.length > 0
        ? p.images[0]
        : "/building.jpg", // fallback image
  }));
}

const Portfolio = async () => {
  const session = await getServerSession(authOptions);
  const projects = await getProjects();

  // Pass data to a client component for filtering/search
  return <PortfolioClient projects={projects} session={session} />;
};

export default Portfolio;
