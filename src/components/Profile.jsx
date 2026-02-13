import { useUser } from "../contexts/UserProvider";
import { useEffect, useRef, useState } from "react";

export default function Profile() {
  const { logout } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [hasImage, setHasImage] = useState(false);

  const fileInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  async function onUpdateImage() {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("Image updated successfully.");
        fetchProfile();
      } else {
        alert("Failed to update image.");
      }
    } catch (err) {
      alert("Error uploading image.");
    }
  }

  async function onRemoveImage() {
    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        alert("Image removed successfully.");
        setHasImage(false);
        fetchProfile();
      } else {
        alert("Failed to remove image.");
      }
    } catch (err) {
      alert("Error removing image.");
    }
  }

  async function fetchProfile() {
    const result = await fetch(`${API_URL}/api/user/profile`, {
      credentials: "include",
    });

    if (result.status == 401) {
      logout();
    } else {
      const data = await result.json();
      setHasImage(data.profileImage != null);
      setIsLoading(false);
      setData(data);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const avatarSrc =
    hasImage && data.profileImage ? `${API_URL}${data.profileImage}` : null;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.title}>My Profile</div>
            <div style={styles.subtitle}>Manage your information and profile picture</div>
          </div>
        </div>

        {isLoading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <div style={styles.content}>
            <div style={styles.grid}>
              {/* Left: Image */}
              <div style={styles.imageCol}>
                <div style={styles.avatarWrap}>
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="Profile" style={styles.avatarImg} />
                  ) : (
                    <div style={styles.avatarPlaceholder}>
                      <div style={styles.placeholderText}>No image</div>
                    </div>
                  )}
                </div>

                <div style={styles.fileRow}>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    ref={fileInputRef}
                    style={styles.fileInput}
                    accept="image/*"
                  />
                </div>

                <div style={styles.buttonRow}>
                  <button onClick={onUpdateImage} style={{ ...styles.btn, ...styles.btnPrimary }}>
                    Update Image
                  </button>
                  <button
                    onClick={onRemoveImage}
                    disabled={!hasImage}
                    style={{
                      ...styles.btn,
                      ...(hasImage ? styles.btnGhost : styles.btnDisabled),
                    }}
                  >
                    Remove Image
                  </button>
                </div>

                <div style={styles.tip}>
                  Allowed: JPG, PNG, GIF, WEBP
                </div>
              </div>

              {/* Right: Info */}
              <div style={styles.infoCol}>
                <div style={styles.sectionTitle}>Details</div>

                <div style={styles.row}>
                  <div style={styles.label}>ID</div>
                  <div style={styles.valueMono}>{data._id}</div>
                </div>

                <div style={styles.row}>
                  <div style={styles.label}>Email</div>
                  <div style={styles.value}>{data.email}</div>
                </div>

                <div style={styles.row}>
                  <div style={styles.label}>First Name</div>
                  <div style={styles.value}>{data.firstname}</div>
                </div>

                <div style={styles.row}>
                  <div style={styles.label}>Last Name</div>
                  <div style={styles.value}>{data.lastname}</div>
                </div>

                <div style={styles.badgeRow}>
                  <span style={styles.badge}>Authenticated</span>
                  {hasImage ? <span style={styles.badgeMuted}>Image set</span> : <span style={styles.badgeMuted}>No image</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 40px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    width: "min(980px, 100%)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
  },
  title: {
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "0.2px",
  },
  subtitle: {
    marginTop: "6px",
    opacity: 0.75,
    fontSize: "14px",
  },
  loading: {
    padding: "30px 0",
    textAlign: "center",
    opacity: 0.8,
  },
  content: {},
  grid: {
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gap: "18px",
  },
  imageCol: {
    padding: "14px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.16)",
  },
  infoCol: {
    padding: "14px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.12)",
  },
  avatarWrap: {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: "14px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  avatarPlaceholder: {
    textAlign: "center",
    opacity: 0.85,
  },
  placeholderIcon: {
    fontSize: "42px",
  },
  placeholderText: {
    marginTop: "8px",
    fontSize: "14px",
    opacity: 0.8,
  },
  fileRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
  },
  fileInput: {
    width: "100%",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "8px",
  },
  btn: {
    flex: 1,
    borderRadius: "12px",
    padding: "10px 12px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    cursor: "pointer",
    fontWeight: 600,
  },
  btnPrimary: {
    background: "rgba(130, 170, 255, 0.18)",
    border: "1px solid rgba(130, 170, 255, 0.35)",
  },
  btnGhost: {},
  btnDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
  tip: {
    marginTop: "10px",
    fontSize: "12px",
    opacity: 0.7,
  },
  sectionTitle: {
    fontWeight: 700,
    marginBottom: "12px",
    opacity: 0.9,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: "10px",
    padding: "10px 10px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    marginBottom: "10px",
  },
  label: {
    opacity: 0.7,
    fontSize: "13px",
    alignSelf: "center",
  },
  value: {
    fontSize: "14px",
    alignSelf: "center",
  },
  valueMono: {
    fontSize: "13px",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    opacity: 0.95,
    wordBreak: "break-all",
    alignSelf: "center",
  },
  badgeRow: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    flexWrap: "wrap",
  },
  badge: {
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(90, 210, 140, 0.18)",
    border: "1px solid rgba(90, 210, 140, 0.30)",
    fontWeight: 600,
  },
  badgeMuted: {
    fontSize: "12px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    opacity: 0.9,
    fontWeight: 600,
  },
};
