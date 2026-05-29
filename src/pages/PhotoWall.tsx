import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Copy, Check, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../lib/api";

interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  uploadedBy: string;
  createdAt: string;
  approved: boolean;
}

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function PhotoWall() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<PhotoItem[]>([]);
  const [caption, setCaption] = useState("");
  const [uploadedBy, setUploadedBy] = useState("Couple");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState("");
  const [partyToken, setPartyToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  async function loadPhotos() {
    const [approved, pending] = await Promise.all([
      apiRequest<{ items: Array<{ _id: string; url: string; caption?: string; uploadedBy?: string; createdAt: string; approved?: boolean }> }>("/photos"),
      apiRequest<{ items: Array<{ _id: string; url: string; caption?: string; uploadedBy?: string; createdAt: string; approved?: boolean }> }>("/photos?pending=true"),
    ]);
    const toItem = (p: { _id: string; url: string; caption?: string; uploadedBy?: string; createdAt: string; approved?: boolean }): PhotoItem => ({
      id: p._id,
      url: p.url,
      caption: p.caption ?? "",
      uploadedBy: p.uploadedBy ?? "Guest",
      createdAt: p.createdAt,
      approved: p.approved !== false,
    });
    setPhotos(approved.items.map(toItem));
    const unapproved = pending.items.filter((p) => p.approved === false);
    setPendingPhotos(unapproved.map(toItem));
  }

  useEffect(() => {
    void loadPhotos();
  }, []);

  function onFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  }

  async function savePhoto() {
    if (!selectedFile) return;
    if (!cloudName || !uploadPreset) {
      window.alert("Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
      return;
    }
    setIsUploading(true);
    const form = new FormData();
    form.append("file", selectedFile);
    form.append("upload_preset", uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
    const result = (await res.json()) as { secure_url?: string };
    if (!result.secure_url) { setIsUploading(false); return; }
    await apiRequest("/photos", { method: "POST", bodyData: { url: result.secure_url, caption, uploadedBy } });
    await loadPhotos();
    setSelectedFile(null);
    setCaption("");
    setIsUploading(false);
  }

  async function approvePhoto(id: string) {
    await apiRequest(`/photos?photoId=${id}`, { method: "PUT", bodyData: { approved: true } });
    await loadPhotos();
  }

  async function rejectPhoto(id: string) {
    await apiRequest(`/photos?photoId=${id}`, { method: "DELETE" });
    await loadPhotos();
  }

  async function getPartyLink() {
    const data = await apiRequest<{ token: string }>("/photos?action=party-token", { method: "PATCH" });
    setPartyToken(data.token);
    const url = `${window.location.origin}/party-upload/${data.token}`;
    await navigator.clipboard.writeText(url);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  }

  const groupedByMonth = photos.reduce<Record<string, PhotoItem[]>>((acc, p) => {
    const key = new Date(p.createdAt).toLocaleString(undefined, { month: "long", year: "numeric" });
    acc[key] = [...(acc[key] ?? []), p];
    return acc;
  }, {});

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <GlassCard title="Photo Wall">
        <p className="muted-label">Shared album for your wedding party. Approve photos before they appear.</p>
        <button
          className="btn btn-muted"
          type="button"
          onClick={() => void getPartyLink()}
          style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}
        >
          {copiedToken ? <Check size={14} /> : <Copy size={14} />}
          {copiedToken ? "Party upload link copied!" : "Copy party upload link"}
        </button>
        {partyToken ? (
          <p className="muted-label" style={{ fontSize: "0.78rem", marginTop: 4 }}>
            Share this link with guests so they can upload photos — all uploads need your approval.
          </p>
        ) : null}
      </GlassCard>

      {pendingPhotos.length > 0 ? (
        <GlassCard title={`Pending approval (${pendingPhotos.length})`}>
          <div style={{ display: "grid", gap: 10 }}>
            {pendingPhotos.map((photo) => (
              <div key={photo.id} style={{ display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "0.5rem" }}>
                <img src={photo.url} alt={photo.caption || "Pending"} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0 }}>{photo.caption || "No caption"}</p>
                  <p className="muted-label" style={{ margin: 0, fontSize: "0.8rem" }}>{photo.uploadedBy}</p>
                </div>
                <button className="btn btn-muted" type="button" onClick={() => void approvePhoto(photo.id)} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <ShieldCheck size={14} /> Approve
                </button>
                <button className="btn btn-muted" type="button" onClick={() => void rejectPhoto(photo.id)} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <ShieldOff size={14} /> Reject
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      ) : null}

      <GlassCard title="Upload a photo">
        <div style={{ display: "grid", gap: 8 }}>
          <input type="file" accept="image/*" onChange={onFileSelect} />
          <input value={uploadedBy} onChange={(e) => setUploadedBy(e.target.value)} placeholder="Uploaded by" />
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" />
          <button className="btn btn-primary" type="button" onClick={() => void savePhoto()} disabled={isUploading || !selectedFile}>
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
                style={{ padding: "0.5rem", breakInside: "avoid", marginBottom: 12, cursor: "pointer", position: "relative" }}
                onClick={() => setLightboxUrl(photo.url)}
              >
                <img src={photo.url} alt={photo.caption || "Wedding photo"} style={{ width: "100%", borderRadius: 10 }} />
                <p style={{ margin: "8px 0 0" }}>{photo.caption || "Untitled memory"}</p>
                <p className="muted-label" style={{ margin: "4px 0 0" }}>{photo.uploadedBy}</p>
                <button
                  type="button"
                  style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", padding: 4, cursor: "pointer", color: "#fff", display: "flex" }}
                  onClick={(e) => { e.stopPropagation(); void rejectPhoto(photo.id); }}
                  title="Delete photo"
                >
                  <Trash2 size={12} />
                </button>
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
          onKeyDown={(e) => { if (e.key === "Escape" || e.key === "Enter") setLightboxUrl(""); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "grid", placeItems: "center", zIndex: 100 }}
        >
          <img src={lightboxUrl} alt="Expanded wedding memory" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 16 }} />
        </div>
      ) : null}
    </section>
  );
}
