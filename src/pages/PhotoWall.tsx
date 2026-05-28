import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";

interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  uploadedBy: string;
  createdAt: string;
}

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function PhotoWall() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [caption, setCaption] = useState("");
  const [uploadedBy, setUploadedBy] = useState("Couple");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState("");

  async function loadPhotos() {
    const data = await apiRequest<{ items: Array<{ _id: string; url: string; caption?: string; uploadedBy?: string; createdAt: string }> }>("/photos");
    setPhotos(
      data.items.map((photo) => ({
        id: photo._id,
        url: photo.url,
        caption: photo.caption ?? "",
        uploadedBy: photo.uploadedBy ?? "Guest",
        createdAt: photo.createdAt,
      })),
    );
  }

  useEffect(() => {
    void loadPhotos();
  }, []);

  function onFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedFile(file);
  }

  async function savePhoto() {
    if (!selectedFile) {
      return;
    }
    if (!cloudName || !uploadPreset) {
      window.alert("Cloudinary env missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", uploadPreset);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { secure_url?: string };
    if (!result.secure_url) {
      setIsUploading(false);
      return;
    }
    await apiRequest("/photos", {
      method: "POST",
      bodyData: { url: result.secure_url, caption, uploadedBy },
    });
    await loadPhotos();
    setSelectedFile(null);
    setCaption("");
    setIsUploading(false);
  }

  const groupedByMonth = photos.reduce<Record<string, PhotoItem[]>>((acc, photo) => {
    const key = new Date(photo.createdAt).toLocaleString(undefined, { month: "long", year: "numeric" });
    const monthItems = acc[key] ?? [];
    monthItems.push(photo);
    acc[key] = monthItems;
    return acc;
  }, {});

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <GlassCard title="Photo Wall">
        <p className="muted-label">Cloudinary upload + masonry gallery + lightbox.</p>
      </GlassCard>
      <GlassCard title="Upload a photo">
        <div style={{ display: "grid", gap: 8 }}>
          <input type="file" accept="image/*" onChange={onFileSelect} />
          <input value={uploadedBy} onChange={(event) => setUploadedBy(event.target.value)} placeholder="Uploaded by" />
          <input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Caption" />
          <button className="btn btn-primary" type="button" onClick={() => void savePhoto()} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Save photo"}
          </button>
        </div>
      </GlassCard>
      {Object.entries(groupedByMonth).map(([month, monthPhotos]) => (
        <section key={month}>
          <h3 style={{ fontFamily: "var(--font-display)" }}>{month}</h3>
          <div style={{ columnCount: 3, columnGap: 12 }}>
            {monthPhotos.map((photo) => (
              <article
                key={photo.id}
                className="glass"
                style={{ padding: "0.5rem", breakInside: "avoid", marginBottom: 12, cursor: "pointer" }}
                onClick={() => setLightboxUrl(photo.url)}
              >
                <img src={photo.url} alt={photo.caption || "Wedding photo"} style={{ width: "100%", borderRadius: 10 }} />
                <p style={{ margin: "8px 0 0" }}>{photo.caption || "Untitled memory"}</p>
                <p className="muted-label" style={{ margin: "4px 0 0" }}>
                  {photo.uploadedBy}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}
      {lightboxUrl ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setLightboxUrl("")}
          onKeyDown={(event) => {
            if (event.key === "Escape" || event.key === "Enter") {
              setLightboxUrl("");
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "grid",
            placeItems: "center",
            zIndex: 100,
          }}
        >
          <img src={lightboxUrl} alt="Expanded wedding memory" style={{ maxWidth: "88vw", maxHeight: "88vh", borderRadius: 16 }} />
        </div>
      ) : null}
    </section>
  );
}
