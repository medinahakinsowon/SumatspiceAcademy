import CertificateView from "./../components/CertificateView.jsx";
import React, { useState, useEffect, useRef } from "react";

const API_URL = "http://localhost:4000/api";

const api = (path, options = {}) => {
  const token = localStorage.getItem("token");
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e0d5",
        borderRadius: 12,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#1a1a1a",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Courses Tab ─────────────────────────────────────────────────────────────
function CoursesTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    shortDesc: "",
    description: "",
    price: "",
    level: "Beginner",
    category: "",
    tags: "",
    thumbnail: "",
    isPublished: true,
    isFeatured: false,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await api("/courses?limit=100");
    const data = await res.json();
    setCourses(data.data?.courses || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      shortDesc: "",
      description: "",
      price: "",
      level: "Beginner",
      category: "",
      tags: "",
      thumbnail: "",
      isPublished: true,
      isFeatured: false,
    });
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c._id);
    setForm({
      title: c.title,
      shortDesc: c.shortDesc,
      description: c.description,
      price: c.price,
      level: c.level,
      category: c.category,
      tags: (c.tags || []).join(", "),
      thumbnail: c.thumbnail,
      isPublished: c.isPublished,
      isFeatured: c.isFeatured,
    });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    const body = {
      ...form,
      price: Number(form.price),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const res = await api(editing ? `/courses/${editing}` : "/courses", {
      method: editing ? "PATCH" : "POST",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setMsg("✅ Saved!");
      load();
      setTimeout(() => {
        setShowForm(false);
        setMsg("");
      }, 1200);
    } else setMsg("❌ " + (data.message || "Error"));
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    await api(`/courses/${id}`, { method: "DELETE" });
    load();
  };

  const F = ({ label, field, type = "text", options }) => (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#555",
          display: "block",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </label>
      {options ? (
        <select
          value={form[field]}
          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          style={inputStyle}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          value={form[field]}
          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      ) : type === "checkbox" ? (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={form[field]}
            onChange={(e) =>
              setForm((p) => ({ ...p, [field]: e.target.checked }))
            }
          />
          <span style={{ fontSize: 13, color: "#555" }}>{label}</span>
        </label>
      ) : (
        <input
          type={type}
          value={form[field]}
          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          style={inputStyle}
        />
      )}
    </div>
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a" }}>
          Courses
        </h2>
        <button onClick={openCreate} style={btnPrimary}>
          + New Course
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading…</p>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e8e0d5",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#faf7f4",
                  borderBottom: "1px solid #e8e0d5",
                }}
              >
                {[
                  "Thumbnail",
                  "Title",
                  "Level",
                  "Price",
                  "Lessons",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr
                  key={c._id}
                  style={{
                    borderBottom: "1px solid #f0ebe4",
                    background: i % 2 === 0 ? "#fff" : "#fdfcfb",
                  }}
                >
                  <td style={{ padding: "10px 16px" }}>
                    <img
                      src={c.thumbnail}
                      alt=""
                      style={{
                        width: 60,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: "#1a1a1a",
                      }}
                    >
                      {c.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                      {c.category}
                    </div>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span
                      style={{
                        ...badge,
                        background: levelColor(c.level) + "20",
                        color: levelColor(c.level),
                      }}
                    >
                      {c.level}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "10px 16px",
                      fontWeight: 700,
                      color: "#2d6a4f",
                    }}
                  >
                    ${c.price}
                  </td>
                  <td style={{ padding: "10px 16px", color: "#555" }}>
                    {c.totalLessons}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span
                      style={{
                        ...badge,
                        background: c.isPublished ? "#e8f5e9" : "#fce4ec",
                        color: c.isPublished ? "#2e7d32" : "#c62828",
                      }}
                    >
                      {c.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(c)} style={btnSmall}>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCourse(c._id)}
                        style={{
                          ...btnSmall,
                          background: "#fce4ec",
                          color: "#c62828",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={modalOverlay} onClick={() => setShowForm(false)}>
          <div
            style={{ ...modalBox, maxWidth: 600 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h3 style={{ fontSize: 22, fontWeight: 800 }}>
                {editing ? "Edit Course" : "New Course"}
              </h3>
              <button onClick={() => setShowForm(false)} style={closeBtn}>
                ×
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0 16px",
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <F label="Title" field="title" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <F
                  label="Short Description"
                  field="shortDesc"
                  type="textarea"
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <F
                  label="Full Description"
                  field="description"
                  type="textarea"
                />
              </div>
              <F label="Price ($)" field="price" type="number" />
              <F
                label="Level"
                field="level"
                options={["Beginner", "Intermediate", "Advanced"]}
              />
              <F label="Category" field="category" />
              <F label="Tags (comma separated)" field="tags" />
              <div style={{ gridColumn: "1 / -1" }}>
                <F label="Thumbnail URL" field="thumbnail" />
              </div>
              <F label="Published" field="isPublished" type="checkbox" />
              <F label="Featured" field="isFeatured" type="checkbox" />
            </div>
            {msg && (
              <div
                style={{
                  marginBottom: 12,
                  fontSize: 13,
                  color: msg.startsWith("✅") ? "#2e7d32" : "#c62828",
                }}
              >
                {msg}
              </div>
            )}
            <button
              onClick={save}
              disabled={saving}
              style={{ ...btnPrimary, width: "100%", padding: "12px" }}
            >
              {saving ? "Saving…" : editing ? "Update Course" : "Create Course"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Videos Tab ──────────────────────────────────────────────────────────────
function VideosTab() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    order: "1",
    isFree: false,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const videoRef = useRef();
  const thumbRef = useRef();

  useEffect(() => {
    api("/courses?limit=100")
      .then((r) => r.json())
      .then((d) => setCourses(d.data?.courses || []));
  }, []);

  const loadVideos = async (courseId) => {
    setLoading(true);
    const res = await api(`/videos/course/${courseId}/admin`);
    const data = await res.json();
    setVideos(data.data?.videos || []);
    setLoading(false);
  };

  const handleCourseChange = (id) => {
    setSelectedCourse(id);
    if (id) loadVideos(id);
    else setVideos([]);
  };

  const upload = async () => {
    if (!videoFile || !form.title || !selectedCourse) {
      setMsg("❌ Title, course and video file are required.");
      return;
    }
    setUploading(true);
    setMsg("");
    const fd = new FormData();
    fd.append("video", videoFile);
    if (thumbFile) fd.append("thumbnail", thumbFile);
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("courseId", selectedCourse);
    fd.append("order", form.order);
    fd.append("isFree", form.isFree);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/videos/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();
    setUploading(false);
    if (res.ok) {
      setMsg("✅ Uploaded!");
      loadVideos(selectedCourse);
      setTimeout(() => {
        setShowUpload(false);
        setMsg("");
        setForm({ title: "", description: "", order: "1", isFree: false });
        setVideoFile(null);
        setThumbFile(null);
      }, 1500);
    } else setMsg("❌ " + (data.message || "Upload failed"));
  };

  const deleteVideo = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    await api(`/videos/${id}`, { method: "DELETE" });
    loadVideos(selectedCourse);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a" }}>
          Videos
        </h2>
        <button onClick={() => setShowUpload(true)} style={btnPrimary}>
          + Upload Video
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            display: "block",
            marginBottom: 8,
          }}
        >
          Filter by Course
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => handleCourseChange(e.target.value)}
          style={{ ...inputStyle, maxWidth: 400 }}
        >
          <option value="">— Select a course —</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading…</p>
      ) : selectedCourse ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e8e0d5",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#faf7f4",
                  borderBottom: "1px solid #e8e0d5",
                }}
              >
                {[
                  "#",
                  "Thumbnail",
                  "Title",
                  "Duration",
                  "Free",
                  "Views",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    No videos for this course yet.
                  </td>
                </tr>
              ) : (
                videos.map((v, i) => (
                  <tr
                    key={v._id}
                    style={{
                      borderBottom: "1px solid #f0ebe4",
                      background: i % 2 === 0 ? "#fff" : "#fdfcfb",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 16px",
                        color: "#888",
                        fontWeight: 700,
                      }}
                    >
                      {v.order}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      {v.thumbnail ? (
                        <img
                          src={v.thumbnail}
                          alt=""
                          style={{
                            width: 60,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 60,
                            height: 40,
                            background: "#f0ebe4",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                          }}
                        >
                          🎬
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: "#1a1a1a",
                        }}
                      >
                        {v.title}
                      </div>
                      {v.description && (
                        <div
                          style={{ fontSize: 12, color: "#888", marginTop: 2 }}
                        >
                          {v.description.slice(0, 60)}…
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px", color: "#555" }}>
                      {v.duration
                        ? `${Math.floor(v.duration / 60)}:${String(v.duration % 60).padStart(2, "0")}`
                        : "—"}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span
                        style={{
                          ...badge,
                          background: v.isFree ? "#e8f5e9" : "#f5f5f5",
                          color: v.isFree ? "#2e7d32" : "#888",
                        }}
                      >
                        {v.isFree ? "Free" : "Paid"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px", color: "#555" }}>
                      {v.views || 0}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <button
                        onClick={() => deleteVideo(v._id)}
                        style={{
                          ...btnSmall,
                          background: "#fce4ec",
                          color: "#c62828",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#aaa",
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e8e0d5",
          }}
        >
          Select a course above to manage its videos
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div style={modalOverlay} onClick={() => setShowUpload(false)}>
          <div
            style={{ ...modalBox, maxWidth: 500 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h3 style={{ fontSize: 22, fontWeight: 800 }}>Upload Video</h3>
              <button onClick={() => setShowUpload(false)} style={closeBtn}>
                ×
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                style={inputStyle}
              >
                <option value="">— Select course —</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Title *</label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                style={inputStyle}
                placeholder="e.g. Introduction to Turmeric"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <label style={labelStyle}>Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, order: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
              <div style={{ paddingTop: 28 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.isFree}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, isFree: e.target.checked }))
                    }
                  />
                  <span
                    style={{ fontSize: 13, color: "#555", fontWeight: 600 }}
                  >
                    Free preview lesson
                  </span>
                </label>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Video File *</label>
              <div onClick={() => videoRef.current.click()} style={fileZone}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🎬</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>
                  {videoFile ? videoFile.name : "Click to select MP4 / MOV"}
                </div>
                <input
                  ref={videoRef}
                  type="file"
                  accept="video/*"
                  style={{ display: "none" }}
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Thumbnail (optional)</label>
              <div onClick={() => thumbRef.current.click()} style={fileZone}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>
                  {thumbFile ? thumbFile.name : "Click to select image"}
                </div>
                <input
                  ref={thumbRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setThumbFile(e.target.files[0])}
                />
              </div>
            </div>
            {msg && (
              <div
                style={{
                  marginBottom: 12,
                  fontSize: 13,
                  color: msg.startsWith("✅") ? "#2e7d32" : "#c62828",
                }}
              >
                {msg}
              </div>
            )}
            <button
              onClick={upload}
              disabled={uploading}
              style={{ ...btnPrimary, width: "100%", padding: "12px" }}
            >
              {uploading ? "Uploading… ⏳" : "Upload Video →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Students Tab ────────────────────────────────────────────────────────────
function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await api("/users?role=student&limit=100");
    const data = await res.json();
    setStudents(data.data?.users || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id, isActive) => {
    await api(`/users/${id}/toggle-active`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !isActive }),
    });
    load();
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a" }}>
          Students
        </h2>
        <input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, width: 280, marginBottom: 0 }}
        />
      </div>
      {loading ? (
        <p style={{ color: "#888" }}>Loading…</p>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e8e0d5",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#faf7f4",
                  borderBottom: "1px solid #e8e0d5",
                }}
              >
                {["Name", "Email", "Plan", "Joined", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#888",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    No students found.
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr
                    key={s._id}
                    style={{
                      borderBottom: "1px solid #f0ebe4",
                      background: i % 2 === 0 ? "#fff" : "#fdfcfb",
                    }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: "var(--terracotta, #c45c3a)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#555",
                        fontSize: 13,
                      }}
                    >
                      {s.email}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          ...badge,
                          background: "#fff3e0",
                          color: "#e65100",
                          textTransform: "capitalize",
                        }}
                      >
                        {s.plan}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#888",
                        fontSize: 13,
                      }}
                    >
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          ...badge,
                          background: s.isActive ? "#e8f5e9" : "#fce4ec",
                          color: s.isActive ? "#2e7d32" : "#c62828",
                        }}
                      >
                        {s.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        onClick={() => toggle(s._id, s.isActive)}
                        style={{
                          ...btnSmall,
                          background: s.isActive ? "#fce4ec" : "#e8f5e9",
                          color: s.isActive ? "#c62828" : "#2e7d32",
                        }}
                      >
                        {s.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Enrollments Tab ─────────────────────────────────────────────────────────
function EnrollmentsTab() {
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("enrollments");

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      const [eRes, pRes] = await Promise.all([
        api("/enrollments?limit=100"),
        api("/payments?limit=100"),
      ]);
      const eData = await eRes.json();
      const pData = await pRes.json();
      setEnrollments(eData.data?.enrollments || []);
      setPayments(pData.data?.payments || []);
      setLoading(false);
    };
    loadAll();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a" }}>
          Enrollments & Payments
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["enrollments", "payments"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                ...btnSmall,
                background: view === v ? "#2d6a4f" : "#f0ebe4",
                color: view === v ? "#fff" : "#555",
                textTransform: "capitalize",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading…</p>
      ) : view === "enrollments" ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e8e0d5",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#faf7f4",
                  borderBottom: "1px solid #e8e0d5",
                }}
              >
                {["Student", "Course", "Progress", "Status", "Enrolled On"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#888",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    No enrollments yet.
                  </td>
                </tr>
              ) : (
                enrollments.map((e, i) => (
                  <tr
                    key={e._id}
                    style={{
                      borderBottom: "1px solid #f0ebe4",
                      background: i % 2 === 0 ? "#fff" : "#fdfcfb",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {e.student?.name || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#555",
                        fontSize: 13,
                      }}
                    >
                      {e.course?.title || "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: 6,
                            background: "#f0ebe4",
                            borderRadius: 3,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${e.progressPercent || 0}%`,
                              background: "#2d6a4f",
                              borderRadius: 3,
                            }}
                          />
                        </div>
                        <span
                          style={{ fontSize: 12, color: "#888", minWidth: 32 }}
                        >
                          {e.progressPercent || 0}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          ...badge,
                          background:
                            e.status === "active" ? "#e8f5e9" : "#f5f5f5",
                          color: e.status === "active" ? "#2e7d32" : "#888",
                          textTransform: "capitalize",
                        }}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#888",
                        fontSize: 13,
                      }}
                    >
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e8e0d5",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#faf7f4",
                  borderBottom: "1px solid #e8e0d5",
                }}
              >
                {[
                  "Student",
                  "Course",
                  "Amount",
                  "Reference",
                  "Status",
                  "Date",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    No payments yet.
                  </td>
                </tr>
              ) : (
                payments.map((p, i) => (
                  <tr
                    key={p._id}
                    style={{
                      borderBottom: "1px solid #f0ebe4",
                      background: i % 2 === 0 ? "#fff" : "#fdfcfb",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {p.user?.name || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#555",
                        fontSize: 13,
                      }}
                    >
                      {p.course?.title || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 700,
                        color: "#2d6a4f",
                      }}
                    >
                      ${p.amount}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#888",
                        fontSize: 12,
                        fontFamily: "monospace",
                      }}
                    >
                      {p.reference?.slice(0, 16)}…
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          ...badge,
                          background:
                            p.status === "success" ? "#e8f5e9" : "#fce4ec",
                          color: p.status === "success" ? "#2e7d32" : "#c62828",
                          textTransform: "capitalize",
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#888",
                        fontSize: 13,
                      }}
                    >
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [cRes, sRes, eRes, pRes] = await Promise.all([
        api("/courses?limit=1"),
        api("/users?role=student&limit=1"),
        api("/enrollments?limit=1"),
        api("/payments?limit=1"),
      ]);
      const [cD, sD, eD, pD] = await Promise.all([
        cRes.json(),
        sRes.json(),
        eRes.json(),
        pRes.json(),
      ]);
      setStats({
        courses: cD.data?.total || cD.data?.courses?.length || 0,
        students: sD.data?.total || sD.data?.users?.length || 0,
        enrollments: eD.data?.total || eD.data?.enrollments?.length || 0,
        revenue:
          pD.data?.payments?.reduce(
            (s, p) => (p.status === "success" ? s + p.amount : s),
            0,
          ) || 0,
      });
    };
    load();
  }, []);

  return (
    <div>
      <h2
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: "#1a1a1a",
          marginBottom: 24,
        }}
      >
        Overview
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginBottom: 32,
        }}
      >
        <StatCard
          icon="📚"
          label="Total Courses"
          value={stats?.courses ?? "—"}
          color="#2d6a4f"
        />
        <StatCard
          icon="👥"
          label="Total Students"
          value={stats?.students ?? "—"}
          color="#c45c3a"
        />
        <StatCard
          icon="🎓"
          label="Total Enrollments"
          value={stats?.enrollments ?? "—"}
          color="#1565c0"
        />
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={stats ? `$${stats.revenue}` : "—"}
          color="#e65100"
        />
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e8e0d5",
          padding: "28px 32px",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Quick Actions
        </h3>
        <p style={{ color: "#888", fontSize: 14 }}>
          Use the tabs above to manage courses, videos, students, and payments.
        </p>
      </div>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid #e8e0d5",
  borderRadius: 8,
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box",
  background: "#faf7f4",
  marginBottom: 0,
};
const labelStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: "#555",
  display: "block",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
const btnPrimary = {
  background: "linear-gradient(135deg, #2d6a4f, #1a3a2a)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "10px 22px",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};
const btnSmall = {
  background: "#f0ebe4",
  color: "#555",
  border: "none",
  borderRadius: 6,
  padding: "6px 14px",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 600,
  fontSize: 12,
  cursor: "pointer",
};
const badge = {
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 700,
};
const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};
const modalBox = {
  background: "#fff",
  borderRadius: 16,
  padding: "32px",
  width: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  position: "relative",
};
const closeBtn = {
  background: "none",
  border: "none",
  fontSize: 24,
  cursor: "pointer",
  color: "#888",
  lineHeight: 1,
};
const fileZone = {
  border: "2px dashed #e8e0d5",
  borderRadius: 8,
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  background: "#faf7f4",
};
const levelColor = (l) =>
  l === "Beginner" ? "#2e7d32" : l === "Intermediate" ? "#e65100" : "#c62828";

// ─── Main AdminPanel ──────────────────────────────────────────────────────────
function AdminPanel({ user, setPage }) {
  const [tab, setTab] = useState("overview");

  // Guard: only admins can access
  if (!user || user.role !== "admin") {
    return (
      <div style={{ textAlign: "center", padding: "80px 40px" }}>
        <h2 style={{ fontSize: 32, marginBottom: 12 }}>Access Denied</h2>
        <p style={{ color: "#888", marginBottom: 24 }}>
          You need admin privileges to view this page.
        </p>
        <button style={btnPrimary} onClick={() => setPage("home")}>
          Go Home
        </button>
      </div>
    );
  }

  const tabs = [
    { key: "overview", icon: "📊", label: "Overview" },
    { key: "courses", icon: "📚", label: "Courses" },
    { key: "videos", icon: "🎬", label: "Videos" },
    { key: "students", icon: "👥", label: "Students" },
    { key: "enrollments", icon: "🎓", label: "Enrollments" },
    { key: "certificates", icon: "🏆", label: "Certificates" },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 64px)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          width: 220,
          background: "#1a1a1a",
          flexShrink: 0,
          padding: "24px 12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "0 12px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            Admin Panel
          </div>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
            {user.name}
          </div>
        </div>
        {tabs.map((t) => (
          <div
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: 4,
              background:
                tab === t.key ? "rgba(255,255,255,0.1)" : "transparent",
              color: tab === t.key ? "#fff" : "rgba(255,255,255,0.5)",
              fontWeight: tab === t.key ? 700 : 400,
              fontSize: 14,
              transition: "all 0.15s",
              borderLeft:
                tab === t.key ? "3px solid #c45c3a" : "3px solid transparent",
            }}
          >
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            {t.label}
          </div>
        ))}
        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 16,
          }}
        >
          <div
            onClick={() => setPage("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 14px",
              borderRadius: 8,
              cursor: "pointer",
              color: "rgba(255,255,255,0.4)",
              fontSize: 14,
            }}
          >
            <span>🏠</span> Back to Site
          </div>
        </div>
      </div>

      {/* ─── Main content ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, background: "#f7f3ee", overflowY: "auto" }}>
        <div style={{ padding: "36px 40px" }}>
          {tab === "overview" && <OverviewTab />}
          {tab === "courses" && <CoursesTab />}
          {tab === "videos" && <VideosTab />}
          {tab === "students" && <StudentsTab />}
          {tab === "enrollments" && <EnrollmentsTab />}
          {tab === "certificates" && <AdminCertificatesTab />}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

// ─── Admin Certificates Tab ───────────────────────────────────────────────────
function AdminCertificatesTab() {
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(null);
  const [msg, setMsg] = useState({});
  const [viewingCert, setViewingCert] = useState(null);
  const [view, setView] = useState("pending");

  const reload = async () => {
    setLoading(true);
    const [eRes, cRes] = await Promise.all([
      api("/enrollments?limit=100"),
      api("/certificates"),
    ]);
    const eData = await eRes.json();
    const cData = await cRes.json();
    setEnrollments(eData.data?.enrollments || []);
    setCertificates(cData.data?.certificates || []);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const issue = async (enrollmentId) => {
    setIssuing(enrollmentId);
    const res = await api(`/certificates/issue/${enrollmentId}`, {
      method: "POST",
    });
    const data = await res.json();
    setIssuing(null);
    if (res.ok) {
      setMsg({ [enrollmentId]: "✅ Issued!" });
      reload();
    } else setMsg({ [enrollmentId]: "❌ " + (data.message || "Error") });
  };

  const revoke = async (certId) => {
    if (
      !window.confirm("Revoke this certificate? The student will lose access.")
    )
      return;
    await api(`/certificates/${certId}`, { method: "DELETE" });
    reload();
  };

  const issuedEnrollmentIds = new Set(
    certificates.map((c) => c.enrollment?.toString()),
  );
  const pending = enrollments.filter(
    (e) => !issuedEnrollmentIds.has(e._id?.toString()),
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a" }}>
          Certificates
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            ["pending", pending.length],
            ["issued", certificates.length],
          ].map(([v, count]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                ...btnSmall,
                background: view === v ? "#2d6a4f" : "#f0ebe4",
                color: view === v ? "#fff" : "#555",
                textTransform: "capitalize",
              }}
            >
              {v} ({count})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading…</p>
      ) : view === "pending" ? (
        // ── Pending: enrollments awaiting certificate ──
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e8e0d5",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#faf7f4",
                  borderBottom: "1px solid #e8e0d5",
                }}
              >
                {["Student", "Course", "Progress", "Enrolled On", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#888",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    No pending certificates — all enrollments have been issued.
                  </td>
                </tr>
              ) : (
                pending.map((e, i) => (
                  <tr
                    key={e._id}
                    style={{
                      borderBottom: "1px solid #f0ebe4",
                      background: i % 2 === 0 ? "#fff" : "#fdfcfb",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {e.student?.name || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#555",
                        fontSize: 13,
                      }}
                    >
                      {e.course?.title || "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: 6,
                            background: "#f0ebe4",
                            borderRadius: 3,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${e.progressPercent || 0}%`,
                              background:
                                e.progressPercent === 100
                                  ? "#2d6a4f"
                                  : "#c9a84c",
                              borderRadius: 3,
                            }}
                          />
                        </div>
                        <span
                          style={{ fontSize: 12, color: "#888", minWidth: 32 }}
                        >
                          {e.progressPercent || 0}%
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#888",
                        fontSize: 13,
                      }}
                    >
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {msg[e._id] ? (
                        <span
                          style={{
                            fontSize: 12,
                            color: msg[e._id].startsWith("✅")
                              ? "#2e7d32"
                              : "#c62828",
                          }}
                        >
                          {msg[e._id]}
                        </span>
                      ) : (
                        <button
                          onClick={() => issue(e._id)}
                          disabled={issuing === e._id}
                          style={{
                            ...btnSmall,
                            background: "#e8f5e9",
                            color: "#2e7d32",
                          }}
                        >
                          {issuing === e._id ? "Issuing…" : "Issue Certificate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // ── Issued: certificates already issued ──
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e8e0d5",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#faf7f4",
                  borderBottom: "1px solid #e8e0d5",
                }}
              >
                {[
                  "Certificate ID",
                  "Student",
                  "Course",
                  "Issued On",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certificates.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    No certificates issued yet.
                  </td>
                </tr>
              ) : (
                certificates.map((c, i) => (
                  <tr
                    key={c._id}
                    style={{
                      borderBottom: "1px solid #f0ebe4",
                      background: i % 2 === 0 ? "#fff" : "#fdfcfb",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: "#8a6d2e",
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      {c.certificateId}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {c.student?.name || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#555",
                        fontSize: 13,
                      }}
                    >
                      {c.course?.title || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#888",
                        fontSize: 13,
                      }}
                    >
                      {new Date(c.issuedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setViewingCert(c)}
                          style={{
                            ...btnSmall,
                            background: "#e8f5e9",
                            color: "#2e7d32",
                          }}
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => revoke(c._id)}
                          style={{
                            ...btnSmall,
                            background: "#fce4ec",
                            color: "#c62828",
                          }}
                        >
                          Revoke
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewingCert && (
        <CertificateView
          certificate={viewingCert}
          onClose={() => setViewingCert(null)}
        />
      )}
    </div>
  );
}
