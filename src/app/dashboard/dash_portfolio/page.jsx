"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiUpload,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";

const fetcher = (url) => fetch(url).then((res) => res.json());

export function ProjectList() {
  const { data, error, isLoading } = useSWR("/api/projects", fetcher);

  if (isLoading)
    return <div className={styles.loading}>Loading projects...</div>;
  if (error) return <div className={styles.error}>Error loading projects</div>;

  return (
    <div className={styles.listContainer}>
      <h1 className={styles.listHeading}>My Projects</h1>
      <div className={styles.projectGrid}>
        {(!data || data.length === 0) && (
          <div className={styles.noProjects}>
            <FiPlus size={48} />
            <p>No projects found. Create your first project!</p>
          </div>
        )}
        {data?.map((project) => (
          <div key={project._id} className={styles.projectCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{project.title}</h2>
              <div className={styles.cardMeta}>
                <span className={styles.metaItem}>
                  <FiMapPin size={14} /> {project.location}
                </span>
                <span className={styles.metaItem}>
                  <FiCalendar size={14} />{" "}
                  {new Date(project.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className={styles.cardDescription}>{project.description}</p>
            {project.images?.length > 0 && (
              <div className={styles.cardImages}>
                {project.images.map((img, idx) => (
                  <div key={idx} className={styles.imageThumbnail}>
                    <img src={img} alt={`${project.title} - ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const ADMIN_EMAIL = "admin@example.com";

const ProjectForm = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const {
    data: projects,
    mutate,
    error,
    isLoading,
  } = useSWR("/api/projects", fetcher);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
  });
  const [images, setImages] = useState([]);

  React.useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.email !== ADMIN_EMAIL) {
      router.push("/login");
    }
  }, [session, status, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImages(files);
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      location: project.location,
      date: project.date.split("T")[0], // Format date for input[type="date"]
    });
    setEditingId(project._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await fetch(`/api/projects/${id}`, { method: "DELETE" });
        mutate();
        setStatusMessage("Project deleted successfully");
        setTimeout(() => setStatusMessage(""), 3000);
      } catch (error) {
        setStatusMessage("Failed to delete project");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage(editingId ? "Updating project..." : "Creating project...");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("date", form.date);
      images.forEach((img) => formData.append("images", img));

      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });

      if (!res.ok) throw new Error(await res.text());

      setStatusMessage(editingId ? "Project updated!" : "Project created!");
      setForm({ title: "", description: "", location: "", date: "" });
      setImages([]);
      setEditingId(null);
      mutate();
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (error) {
      setStatusMessage(error.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || !session || session.user.email !== ADMIN_EMAIL) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.dashboard}>
      {/* Place the dashboard title at the very top left */}
      <h2 className={styles.dashboardTitle}>Project Dashboard</h2>
      <div className={styles.mainContent}>
        <form className={styles.projectForm} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <h2>{editingId ? "Edit Project" : "Create New Project"}</h2>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    title: "",
                    description: "",
                    location: "",
                    date: "",
                  });
                  setImages([]);
                }}
                className={styles.cancelButton}
              >
                <FiX size={20} /> Cancel
              </button>
            )}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Project Title</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="Amazing Project"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your project..."
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location">Location</label>
              <div className={styles.inputWithIcon}>
                <FiMapPin className={styles.inputIcon} />
                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="City, Country"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <div className={styles.inputWithIcon}>
                <FiCalendar className={styles.inputIcon} />
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="images">Images (Max 3)</label>
              <div className={styles.fileUpload}>
                <label htmlFor="images" className={styles.uploadButton}>
                  <FiUpload size={18} />
                  <span>
                    {images.length > 0
                      ? `${images.length} selected`
                      : "Choose files"}
                  </span>
                </label>
                <input
                  id="images"
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  required={!editingId}
                />
              </div>
              {images.length > 0 && (
                <div className={styles.imagePreviews}>
                  {images.map((img, idx) => (
                    <div key={idx} className={styles.imagePreview}>
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${idx}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages(images.filter((_, i) => i !== idx))
                        }
                        className={styles.removeImage}
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formFooter}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? editingId
                  ? "Saving..."
                  : "Creating..."
                : editingId
                ? "Save Changes"
                : "Create Project"}
            </button>
            {statusMessage && (
              <div
                className={`${styles.statusMessage} ${
                  statusMessage.includes("success")
                    ? styles.success
                    : styles.error
                }`}
              >
                {statusMessage}
              </div>
            )}
          </div>
        </form>
      </div>
      <div className={styles.sidebar}>
        <div className={styles.projectList}>
          <h3 className={styles.listTitle}>Existing Projects</h3>
          {isLoading ? (
            <div className={styles.loading}>Loading...</div>
          ) : error ? (
            <div className={styles.error}>Error loading projects</div>
          ) : (
            <div className={styles.scrollContainer}>
              {projects?.map((project) => (
                <div key={project._id} className={styles.listItem}>
                  <div className={styles.itemContent}>
                    <h4 className={styles.itemTitle}>{project.title}</h4>
                    <p className={styles.itemDate}>
                      {new Date(project.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      onClick={() => handleEdit(project)}
                      className={styles.actionButton}
                      aria-label="Edit"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className={styles.actionButton}
                      aria-label="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
