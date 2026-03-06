"use client";
import React, { useState, useRef } from "react";
import {
  Box, Typography, Card, CardContent, IconButton, Tooltip,
  Chip, Button, Dialog, DialogContent, DialogTitle,
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload as UploadIcon, Delete as DeleteIcon, ZoomIn as ZoomIcon,
  Image as ImageIcon, Close as CloseIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { mockGalleryImages } from "@/app/lib/mock/adminData";

type GalleryImage = {
  id: number;
  url: string;
  name: string;
  category: string;
  size: string;
  uploaded: string;
};

const CATEGORIES = ["all", "puja", "temple", "festival", "background", "banner"];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(mockGalleryImages);
  const [catFilter, setCatFilter] = useState("all");
  const [preview, setPreview] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = catFilter === "all" ? images : images.filter((img) => img.category === catFilter);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);

        const newImages: GalleryImage[] = files.map((file, idx) => ({
          id: Date.now() + idx,
          url: URL.createObjectURL(file),
          name: file.name.replace(/\.[^.]+$/, ""),
          category: "puja",
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploaded: new Date().toISOString().split("T")[0],
        }));

        setImages((prev) => [...newImages, ...prev]);
        setUploading(false);
        setUploadProgress(0);
        toast.success(`${files.length} image${files.length > 1 ? "s" : ""} uploaded successfully!`);

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }, 150);
  };

  const handleDelete = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    toast.success("Image deleted");
    if (preview?.id === id) setPreview(null);
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
            Gallery
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {images.length} image{images.length !== 1 ? "s" : ""} uploaded
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          sx={{
            bgcolor: "#f59e0b", color: "white", fontWeight: 700,
            "&:hover": { bgcolor: "#d97706" },
            borderRadius: 2, px: 3,
          }}
        >
          Upload Images
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileSelect}
        />
      </Box>

      {/* Upload Progress */}
      {uploading && (
        <Card sx={{ borderRadius: 3, mb: 2.5, border: "1px solid #f59e0b44" }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Uploading… {uploadProgress}%</Typography>
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 2, height: 6, bgcolor: "#f59e0b22", "& .MuiLinearProgress-bar": { bgcolor: "#f59e0b" } }} />
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat.charAt(0).toUpperCase() + cat.slice(1)}
            onClick={() => setCatFilter(cat)}
            sx={{
              textTransform: "capitalize", fontWeight: 600, cursor: "pointer",
              bgcolor: catFilter === cat ? "#f59e0b" : "transparent",
              color: catFilter === cat ? "white" : "text.secondary",
              border: catFilter === cat ? "none" : "1px solid",
              borderColor: "divider",
              "&:hover": { bgcolor: catFilter === cat ? "#d97706" : "action.hover" },
            }}
          />
        ))}
      </Box>

      {/* Upload Drop Zone (when empty) */}
      {filtered.length === 0 && (
        <Card
          sx={{ borderRadius: 3, border: "2px dashed #f59e0b44", cursor: "pointer", textAlign: "center" }}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent sx={{ py: 8 }}>
            <ImageIcon sx={{ fontSize: 56, color: "#f59e0b44", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontWeight={600}>
              No images yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Click to upload images or drag and drop
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Image Grid */}
      {filtered.length > 0 && (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" }, gap: 2 }}>
          <AnimatePresence>
            {filtered.map((img) => (
              <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.25 }}>
                <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", "&:hover .overlay": { opacity: 1 } }}>
                  <Box sx={{ position: "relative", aspectRatio: "1", overflow: "hidden", bgcolor: "grey.100" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/300x300/FEF3C7/D97706?text=${encodeURIComponent(img.name.charAt(0).toUpperCase())}`;
                      }}
                    />
                    {/* Overlay */}
                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute", inset: 0,
                        bgcolor: "rgba(0,0,0,0.5)",
                        opacity: 0, transition: "opacity 0.2s",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
                      }}
                    >
                      <Tooltip title="Preview">
                        <IconButton size="small" onClick={() => setPreview(img)} sx={{ bgcolor: "white", "&:hover": { bgcolor: "#f59e0b" } }}>
                          <ZoomIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(img.id)} sx={{ bgcolor: "white", "&:hover": { bgcolor: "#ef4444", color: "white" } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1.5 }}>
                    <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: "0.82rem" }}>{img.name}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">{img.size}</Typography>
                      <Chip label={img.category} size="small" sx={{ height: 16, fontSize: "0.65rem", textTransform: "capitalize", bgcolor: "#f59e0b1a", color: "#d97706" }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>{img.uploaded}</Typography>
                  </Box>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {preview && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" fontWeight={700}>{preview.name}</Typography>
              <IconButton onClick={() => setPreview(null)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt={preview.name}
                style={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/800x600/FEF3C7/D97706?text=${encodeURIComponent(preview.name)}`;
                }}
              />
              <Box sx={{ p: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Typography variant="caption" color="text.secondary"><strong>Size:</strong> {preview.size}</Typography>
                <Typography variant="caption" color="text.secondary"><strong>Category:</strong> {preview.category}</Typography>
                <Typography variant="caption" color="text.secondary"><strong>Uploaded:</strong> {preview.uploaded}</Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
