import React from "react";
import styles from "../page.module.css";
import clientPromise from "@/lib/db";
import Carousel from "./Carousel";

async function getProject(id) {
  const client = await clientPromise;
  const db = client.db("yourDatabaseName");
  const { ObjectId } = require("mongodb");
  const project = await db.collection("project").findOne(
    { _id: ObjectId.createFromHexString(id) },
    {
      projection: {
        title: 1,
        images: 1,
        location: 1,
        date: 1,
        description: 1,
      },
    }
  );
  if (!project) return null;
  return {
    title: project.title,
    location: project.location || "Unknown Location",
    date: project.date ? new Date(project.date).toLocaleDateString() : "",
    images:
      Array.isArray(project.images) && project.images.length > 0
        ? project.images
        : ["/building.jpg"],
    description: project.description || "",
  };
}

const ProjectPage = async (props) => {
  const { params } = await props;
  const project = await getProject(params.id);
  if (!project) return <div className={styles.error}>Project not found</div>;

  return (
    <div className={styles.projectDetail}>
      <div className={styles.projectHeader}>
        <h1 className={styles.detailTitle}>{project.title}</h1>
        <div className={styles.detailMeta}>
          <span className={styles.detailLocation}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {project.location}
          </span>
          {project.date && (
            <span className={styles.detailDate}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {project.date}
            </span>
          )}
        </div>
      </div>

      <div className={styles.carouselWrapper}>
        <Carousel images={project.images} />
      </div>

      <div className={styles.projectDescription}>
        <h2 className={styles.descriptionTitle}>Project Details</h2>
        <p>{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectPage;
