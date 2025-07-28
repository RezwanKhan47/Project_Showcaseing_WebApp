import React from "react";
import styles from "./page.module.css";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import EmblaCarousel from "./EmblaCarousel";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Feedback from "./Feedback"; // Import the Feedback component

async function getProjectDetails(id) {
  const client = await clientPromise;
  const db = client.db("yourDatabaseName");
  const project = await db
    .collection("project")
    .findOne({ _id: new ObjectId(id) });

  if (!project) return null;

  return {
    _id: project._id.toString(),
    title: project.title,
    location: project.location || "Unknown Location",
    date: project.date || "Unknown Date",
    description: project.description || "No description available",
    images: Array.isArray(project.images) ? project.images : [],
  };
}

const PortfolioDetail = async (props) => {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const { id } = params;
  const project = await getProjectDetails(id);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        <div className={styles.meta}>
          <span className={styles.location}>{project.location}</span>
          <span className={styles.date}>{project.date}</span>
        </div>
      </div>
      <EmblaCarousel images={project.images} title={project.title} />
      <div className={styles.description}>
        <h2>Description</h2>
        <p>{project.description}</p>
      </div>
      <Feedback projectId={id} session={session} />
    </div>
  );
};

export default PortfolioDetail;
