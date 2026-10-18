"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { fileToBase32, base32ToDataUrl } from "@/lib/base32";
import { uploadApi } from "@/lib/api";
import { FiEdit2, FiTrash2, FiPlus, FiCheck, FiFolderPlus, FiX, FiExternalLink } from "react-icons/fi";

const DEFAULT_SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const PRODUCT_TYPES = ["Top", "Shirt", "Dress", "Coord Set", "Kurta", "Bottom", "Accessory", "Saree", "Other"];
const PRODUCT_STATUSES = ["Active", "Draft", "Out of Stock"];
const GST_RATES = ["5", "12", "18"];
const FIT_OPTIONS = ["Relaxed", "Regular", "Slim", "Oversized", "Straight", "Tailored"];
const LENGTH_OPTIONS = ["Regular", "Hip Length", "Crop", "Midi", "Maxi / Full Length", "Mini"];
const SLEEVE_OPTIONS = ["Sleeveless", "Half Sleeve", "Full Sleeve", "3/4th Sleeve", "Cap Sleeve", "Bell Sleeve"];
const NECK_OPTIONS = ["Round Neck", "V-Neck", "Boat Neck", "Shirt Collar", "Mandarin Collar", "Square Neck"];

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, quickRestockProduct, categories = ["Tops", "Dresses", "Fabrics", "Accessories"], addCategory, toggleProductFeatured } = useStore();

  const [stockFilter, setStockFilter] = useState("ALL"); // ALL | LOW_STOCK | IN_STOCK

  // New Category Creation Inline State
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [isCreatingCategoryEdit, setIsCreatingCategoryEdit] = useState(false);
  const [newCategoryInputEdit, setNewCategoryInputEdit] = useState("");

  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    sku: "",
    hook: "",
    description: "",
    category: "Tops",
    productType: "Top",
    collection: "Khadi Essentials",
    status: "Active",
    price: "",
    salePrice: "",
    gstPercent: "5",
    stock: "25",
    lowStockThreshold: "5",
    colors: "Indigo Blue, Natural Beige",
    fabricComposition: "100% Handspun Khadi Cotton",
    fit: "Relaxed",
    length: "Regular",
    sleeveType: "Half Sleeve",
    neckType: "Round Neck",
    hasPockets: false,
    hasLining: false,
    fabricCare: "100% Handspun Khadi Cotton. Machine wash gentle in cold water.",
    modelMeasurements: "Model is 5'7\", wearing size M",
    weight: "200",
    returnEligible: true,
    videoUrl: "",
  });

  // Dynamic Size & Price Rows
  const [sizeVariants, setSizeVariants] = useState([
    { size: "XS", price: "1499" },
    { size: "S", price: "1499" },
    { size: "M", price: "1499" },
    { size: "L", price: "1599" },
    { size: "XL", price: "1699" },
  ]);

  // Per-Variant SKU & Stock Matrix
  const [variants, setVariants] = useState([]);
  const [editVariants, setEditVariants] = useState([]);

  // Image Upload State
  const [base32Image, setBase32Image] = useState("");
  const [imagePreview, setImagePreview] = useState("/assets/img/14.png");
  const [imageMime, setImageMime] = useState("image/png");
  const [imageFileName, setImageFileName] = useState("");
  const [isEncoding, setIsEncoding] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Product Edit State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSizeVariants, setEditSizeVariants] = useState([]);
  const [editBase32Image, setEditBase32Image] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editImageMime, setEditImageMime] = useState("image/png");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({ ...editForm, [name]: type === "checkbox" ? checked : value });
  };

  // ── Size Variants Handlers for New Product ──
  const handleSizeVariantChange = (index, field, val) => {
    setSizeVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleAddSizeVariant = () => {
    setSizeVariants((prev) => [
      ...prev,
      { size: "", price: form.salePrice || form.price || "" },
    ]);
  };

  const handleRemoveSizeVariant = (index) => {
    setSizeVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Size Variants Handlers for Edit Product ──
  const handleEditSizeVariantChange = (index, field, val) => {
    setEditSizeVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleAddEditSizeVariant = () => {
    setEditSizeVariants((prev) => [
      ...prev,
      { size: "", price: editForm.salePrice || editForm.price || "" },
    ]);
  };

  const handleRemoveEditSizeVariant = (index) => {
    setEditSizeVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Variant SKU & Stock Matrix Generator ──
  const handleGenerateVariants = (isEdit = false) => {
    const curForm = isEdit ? editForm : form;
    const curSizes = isEdit
      ? editSizeVariants.map((v) => v.size?.trim()).filter(Boolean)
      : sizeVariants.map((v) => v.size?.trim()).filter(Boolean);
    const curColors = (curForm.colors || "").split(",").map((c) => c.trim()).filter(Boolean);
    const baseSku = (curForm.sku || `SC-${(curForm.name || "PRD").slice(0, 3).toUpperCase()}`).trim();

    const sizesList = curSizes.length > 0 ? curSizes : ["S", "M", "L"];
    const colorsList = curColors.length > 0 ? curColors : ["Standard"];

    const totalStock = Number(curForm.stock) || 20;
    const perComboStock = Math.max(1, Math.floor(totalStock / (sizesList.length * colorsList.length)));

    const generated = [];
    sizesList.forEach((sz) => {
      colorsList.forEach((col) => {
        const colorCode = col.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "");
        const sku = `${baseSku}-${colorCode || "STD"}-${sz}`;
        generated.push({
          size: sz,
          color: col,
          sku,
          stock: perComboStock,
        });
      });
    });

    if (isEdit) {
      setEditVariants(generated);
    } else {
      setVariants(generated);
    }
  };

  const handleVariantChange = (index, field, val, isEdit = false) => {
    const setter = isEdit ? setEditVariants : setVariants;
    setter((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: field === "stock" ? Number(val) || 0 : val };
      return copy;
    });
  };

  const handleAddVariantRow = (isEdit = false) => {
    const setter = isEdit ? setEditVariants : setVariants;
    const curForm = isEdit ? editForm : form;
    const baseSku = (curForm.sku || "SC-PRD").trim();
    setter((prev) => [
      ...prev,
      { size: "M", color: "Standard", sku: `${baseSku}-VAR-${prev.length + 1}`, stock: 5 },
    ]);
  };

  const handleRemoveVariantRow = (index, isEdit = false) => {
    const setter = isEdit ? setEditVariants : setVariants;
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Handle New Category Creation ──
  const handleCreateNewCategory = (isEdit = false) => {
    const raw = isEdit ? newCategoryInputEdit : newCategoryInput;
    const clean = raw.trim();
    if (!clean) return;

    addCategory(clean);
    if (isEdit) {
      setEditForm((prev) => ({ ...prev, category: clean }));
      setNewCategoryInputEdit("");
      setIsCreatingCategoryEdit(false);
    } else {
      setForm((prev) => ({ ...prev, category: clean }));
      setNewCategoryInput("");
      setIsCreatingCategory(false);
    }
  };

  // Video upload state
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState("");

  // Handle video file upload to Cloudinary via backend
  const handleVideoFileUpload = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setVideoUploadError("Please select a video file");
      return;
    }
    const maxBytes = 200 * 1024 * 1024;
    if (file.size > maxBytes) {
      setVideoUploadError("Video exceeds 200MB limit");
      return;
    }
    try {
      setVideoUploadError("");
      setVideoUploading(true);
      const { video } = await uploadApi.uploadVideo(file);
      if (isEdit) {
        setEditForm((prev) => ({ ...prev, videoUrl: video.url }));
      } else {
        setForm((prev) => ({ ...prev, videoUrl: video.url }));
      }
    } catch (err) {
      console.error("Video upload failed:", err);
      setVideoUploadError(err.message || "Upload failed");
    } finally {
      setVideoUploading(false);
      e.target.value = "";
    }
  };

  // Handle local image file upload & convert
  const handleImageFileUpload = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsEncoding(true);
      const { base32Data, mimeType, name } = await fileToBase32(file);
      const dataUrl = base32ToDataUrl(base32Data, mimeType);

      if (isEdit) {
        setEditBase32Image(base32Data);
        setEditImageMime(mimeType);
        setEditImagePreview(dataUrl);
      } else {
        setBase32Image(base32Data);
        setImageMime(mimeType);
        setImageFileName(name);
        setImagePreview(dataUrl);
      }
      setIsEncoding(false);
    } catch (err) {
      console.error("Failed to process image:", err);
      setIsEncoding(false);
      alert("Error reading image file.");
    }
  };

  const handleSelectPreset = (url) => {
    setBase32Image("");
    setImagePreview(url);
    setImageFileName("");
  };

  const handleStartEdit = (p) => {
    setEditingProduct(p);

    // Reconstruct size variants
    const initialSizePrices = p.sizePrices || {};
    const parsedSizes = p.sizes && p.sizes.length > 0 ? p.sizes : ["XS", "S", "M", "L", "XL"];
    const reconstructed = parsedSizes.map((sz) => ({
      size: sz,
      price: initialSizePrices[sz] !== undefined ? String(initialSizePrices[sz]) : String(p.salePrice || p.price || ""),
    }));

    setEditSizeVariants(reconstructed);
    setEditVariants(p.variants && p.variants.length > 0 ? p.variants : []);
    setEditForm({
      name: p.name || "",
      subtitle: p.subtitle || "",
      sku: p.sku || `SC-${(p.category || "PRD").toUpperCase().slice(0, 3)}-00${p.id}`,
      hook: p.hook || "",
      category: p.category || "Tops",
      productType: p.productType || "Top",
      collection: p.collection || "",
      status: p.status || "Active",
      price: p.price || "",
      salePrice: p.salePrice || "",
      gstPercent: p.gstPercent !== undefined ? String(p.gstPercent) : "5",
      stock: p.stock !== undefined ? p.stock : 20,
      lowStockThreshold: p.lowStockThreshold !== undefined ? String(p.lowStockThreshold) : "5",
      colors: (p.colors || []).join(", "),
      description: p.description || "",
      fabricComposition: p.fabricComposition || "100% Handspun Khadi Cotton",
      fit: p.fit || "Relaxed",
      length: p.length || "Regular",
      sleeveType: p.sleeveType || "Half Sleeve",
      neckType: p.neckType || "Round Neck",
      hasPockets: Boolean(p.hasPockets),
      hasLining: Boolean(p.hasLining),
      fabricCare: p.fabricCare || "100% Handspun Khadi Cotton. Machine wash gentle in cold water.",
      modelMeasurements: p.modelMeasurements || "",
      weight: p.weight !== undefined ? String(p.weight) : "200",
      returnEligible: p.returnEligible !== false,
      videoUrl: p.videoUrl || "",
    });
    setEditImagePreview(p.images?.[0] || "/assets/img/14.png");
    setEditBase32Image(p.base32Data || "");
    setEditImageMime(p.mimeType || "image/png");
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct || !editForm.name) return;

    const finalImg = editBase32Image ? base32ToDataUrl(editBase32Image, editImageMime) : editImagePreview;

    // Compile dynamic sizes & size prices
    const validVariants = editSizeVariants.filter((v) => v.size && v.size.trim().length > 0);
    const compiledSizes = validVariants.map((v) => v.size.trim());
    const compiledSizePrices = {};
    validVariants.forEach((v) => {
      if (v.price && !isNaN(Number(v.price))) {
        compiledSizePrices[v.size.trim()] = Number(v.price);
      }
    });

    const fallbackPrice = validVariants[0]?.price ? Number(validVariants[0].price) : 1999;
    const effectivePrice = editForm.price ? Number(editForm.price) : fallbackPrice;

    updateProduct(editingProduct.id, {
      name: editForm.name,
      subtitle: editForm.subtitle,
      sku: editForm.sku,
      hook: editForm.hook,
      category: editForm.category,
      productType: editForm.productType,
      collection: editForm.collection,
      status: editForm.status,
      price: effectivePrice,
      salePrice: editForm.salePrice ? Number(editForm.salePrice) : null,
      sizePrices: Object.keys(compiledSizePrices).length > 0 ? compiledSizePrices : null,
      gstPercent: Number(editForm.gstPercent) || 5,
      stock: Number(editForm.stock),
      lowStockThreshold: Number(editForm.lowStockThreshold) || 5,
      sizes: compiledSizes.length > 0 ? compiledSizes : ["XS", "S", "M", "L", "XL"],
      colors: editForm.colors.split(",").map((c) => c.trim()).filter(Boolean),
      fabricComposition: editForm.fabricComposition,
      fit: editForm.fit,
      length: editForm.length,
      sleeveType: editForm.sleeveType,
      neckType: editForm.neckType,
      hasPockets: Boolean(editForm.hasPockets),
      hasLining: Boolean(editForm.hasLining),
      description: editForm.description,
      fabricCare: editForm.fabricCare,
      modelMeasurements: editForm.modelMeasurements,
      weight: Number(editForm.weight) || 200,
      returnEligible: Boolean(editForm.returnEligible),
      videoUrl: editForm.videoUrl || "",
      variants: editVariants,
      images: [finalImg, ...(editingProduct.images?.slice(1) || ["/assets/img/25.png"])],
      base32Data: editBase32Image || editingProduct.base32Data,
      isBase32: Boolean(editBase32Image || editingProduct.isBase32),
      mimeType: editImageMime,
    });

    setEditingProduct(null);
    setFeedback(`✓ Product "${editForm.name}" (SKU: ${editForm.sku}) updated successfully!`);
    setTimeout(() => setFeedback(""), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;

    // Use base32 image if uploaded, otherwise preset image preview
    const finalImageUrl = base32Image ? base32ToDataUrl(base32Image, imageMime) : imagePreview;
    const cleanSku = form.sku.trim() || `SC-${form.category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    // Compile dynamic sizes and size prices from builder
    const validVariants = sizeVariants.filter((v) => v.size && v.size.trim().length > 0);
    const compiledSizes = validVariants.map((v) => v.size.trim());
    const compiledSizePrices = {};
    validVariants.forEach((v) => {
      if (v.price && !isNaN(Number(v.price))) {
        compiledSizePrices[v.size.trim()] = Number(v.price);
      }
    });

    const fallbackPrice = validVariants[0]?.price ? Number(validVariants[0].price) : 1999;
    const effectivePrice = form.price ? Number(form.price) : fallbackPrice;

    const newProd = addProduct({
      name: form.name,
      subtitle: form.subtitle || "Handcrafted Textile",
      sku: cleanSku,
      hook: form.hook || form.name,
      description: form.description || "Crafted with 100% natural, hand-spun khadi cotton.",
      category: form.category,
      productType: form.productType || "Top",
      collection: form.collection || "",
      status: form.status || "Active",
      price: effectivePrice,
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      sizePrices: Object.keys(compiledSizePrices).length > 0 ? compiledSizePrices : null,
      gstPercent: Number(form.gstPercent) || 5,
      stock: Number(form.stock) || 20,
      lowStockThreshold: Number(form.lowStockThreshold) || 5,
      images: [finalImageUrl, "/assets/img/25.png", "/assets/img/20.png"],
      base32Data: base32Image || null,
      isBase32: Boolean(base32Image),
      mimeType: imageMime,
      sizes: compiledSizes.length > 0 ? compiledSizes : ["XS", "S", "M", "L", "XL"],
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      fabricComposition: form.fabricComposition || "100% Handspun Khadi Cotton",
      fit: form.fit || "Relaxed",
      length: form.length || "Regular",
      sleeveType: form.sleeveType || "Half Sleeve",
      neckType: form.neckType || "Round Neck",
      hasPockets: Boolean(form.hasPockets),
      hasLining: Boolean(form.hasLining),
      fabricCare: form.fabricCare || "100% Handspun Khadi Cotton. Machine wash gentle in cold water.",
      modelMeasurements: form.modelMeasurements || "",
      weight: Number(form.weight) || 200,
      returnEligible: form.returnEligible !== false,
      videoUrl: form.videoUrl || "",
      variants: variants.length > 0 ? variants : [],
      why: [
        "100% Handspun organic Khadi",
        "Breathable all-season comfort",
        "Artisanal low-impact dye process",
      ],
      when: "Everyday luxury and mindful living.",
      oneLine: "Lightweight, ethical, and built to last.",
    });

    setFeedback(`✓ Product "${newProd.name}" (SKU: ${cleanSku}) successfully published!`);
    setForm({
      name: "",
      subtitle: "",
      sku: "",
      hook: "",
      description: "",
      category: "Tops",
      productType: "Top",
      collection: "Khadi Essentials",
      status: "Active",
      price: "",
      salePrice: "",
      gstPercent: "5",
      stock: "25",
      lowStockThreshold: "5",
      colors: "Indigo Blue, Natural Beige",
      fabricComposition: "100% Handspun Khadi Cotton",
      fit: "Relaxed",
      length: "Regular",
      sleeveType: "Half Sleeve",
      neckType: "Round Neck",
      hasPockets: false,
      hasLining: false,
      fabricCare: "100% Handspun Khadi Cotton. Machine wash gentle in cold water.",
      modelMeasurements: "Model is 5'7\", wearing size M",
      weight: "200",
      returnEligible: true,
      videoUrl: "",
    });
    setVariants([]);
    setSizeVariants([
      { size: "XS", price: "1499" },
      { size: "S", price: "1499" },
      { size: "M", price: "1499" },
      { size: "L", price: "1599" },
      { size: "XL", price: "1699" },
    ]);
    setBase32Image("");
    setImagePreview("/assets/img/14.png");
    setImageFileName("");

    setTimeout(() => setFeedback(""), 5000);
  };

  return (
    <div>
      {/* Product Uploader Form */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-title">Upload New Product</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
              Add a new handcrafted piece to your online catalog with dynamic categories and size-by-size pricing.
            </div>
          </div>
        </div>

        {feedback && (
          <div style={{ background: "#065f46", color: "#6ee7b7", padding: "12px 18px", borderRadius: 8, marginBottom: 20, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <FiCheck size={16} />
            <span>{feedback}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <div style={{ background: "#1f242d", border: "1px dashed #374151", borderRadius: 10, padding: 20, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <strong style={{ fontSize: 14, color: "#fff" }}>Product Photography & Media</strong>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
                  Select a high-resolution garment photo (.png, .jpg, or .webp).
                </p>
              </div>
              {isEncoding && <span style={{ color: "#f35c27", fontSize: 12, fontWeight: 700 }}>Processing photo...</span>}
            </div>

            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: 110, height: 130, borderRadius: 8, overflow: "hidden", border: "2px solid #374151", background: "#111", flexShrink: 0 }}>
                <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>

              <div style={{ flex: 1, minWidth: 260 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileUpload(e, false)}
                  className="admin-form-input"
                  style={{ background: "#111", padding: "8px 12px", marginBottom: 10 }}
                />

                {base32Image && (
                  <div style={{ fontSize: 11, color: "#34d399", background: "rgba(52, 211, 153, 0.1)", padding: "6px 10px", borderRadius: 6, marginBottom: 10 }}>
                    ✓ Custom photo loaded: {imageFileName || "garment-photo.png"}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>Or choose sample photo:</span>
                  {["/assets/img/14.png", "/assets/img/15.png", "/assets/img/22.png", "/assets/img/26.png"].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      style={{
                        padding: "4px 10px",
                        fontSize: 11,
                        borderRadius: 4,
                        background: imagePreview === preset ? "#f35c27" : "#374151",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Sample {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-form-grid">
            {/* ── Section 1: Basic Product Information & Catalog ── */}
            <div className="admin-form-group full-width" style={{ borderBottom: "1px solid #2d3342", paddingBottom: 10, marginTop: 8 }}>
              <strong style={{ fontSize: 13, color: "#f35c27", textTransform: "uppercase", letterSpacing: 1 }}>
                1. Basic Product Information & Catalog
              </strong>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Product Name *</label>
              <input
                type="text"
                name="name"
                className="admin-form-input"
                placeholder="e.g. Meera's Handspun Dress"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Master SKU Code</label>
              <input
                type="text"
                name="sku"
                className="admin-form-input"
                placeholder="e.g. SC-DRS-004 (Auto-generated if empty)"
                value={form.sku}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Subtitle / Poetic Note</label>
              <input
                type="text"
                name="subtitle"
                className="admin-form-input"
                placeholder="e.g. The Everyday Ease Dress"
                value={form.subtitle}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Hook / Tagline</label>
              <input
                type="text"
                name="hook"
                className="admin-form-input"
                placeholder="e.g. Simple. Breathable. Built for real days."
                value={form.hook}
                onChange={handleChange}
              />
            </div>

            {/* Dynamic Category Selector with Inline Creation */}
            <div className="admin-form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label className="admin-form-label" style={{ margin: 0 }}>Category *</label>
                <button
                  type="button"
                  onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#38bdf8",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <FiFolderPlus size={13} />
                  <span>{isCreatingCategory ? "Select Existing" : "+ New Category"}</span>
                </button>
              </div>

              {isCreatingCategory ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <input
                    type="text"
                    placeholder="Enter new category (e.g. Kurtas, Co-ords)"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    className="admin-form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleCreateNewCategory(false)}
                    className="admin-btn admin-btn-primary"
                    style={{ padding: "0 14px", fontSize: 12 }}
                  >
                    Add
                  </button>
                </div>
              ) : (
                <select
                  name="category"
                  className="admin-form-select"
                  value={form.category}
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Product Type</label>
              <select
                name="productType"
                className="admin-form-select"
                value={form.productType}
                onChange={handleChange}
              >
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Collection</label>
              <input
                type="text"
                name="collection"
                className="admin-form-input"
                placeholder="e.g. Summer 2026, Khadi Essentials"
                value={form.collection}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Product Status</label>
              <select
                name="status"
                className="admin-form-select"
                value={form.status}
                onChange={handleChange}
              >
                {PRODUCT_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* ── Section 2: Pricing, Tax & Logistics ── */}
            <div className="admin-form-group full-width" style={{ borderBottom: "1px solid #2d3342", paddingBottom: 10, marginTop: 12 }}>
              <strong style={{ fontSize: 13, color: "#f35c27", textTransform: "uppercase", letterSpacing: 1 }}>
                2. Pricing, Tax & Logistics
              </strong>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">MRP / Regular Price (₹ INR) *</label>
              <input
                type="number"
                name="price"
                className="admin-form-input"
                placeholder="2499"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Selling / Sale Price (₹ INR, optional)</label>
              <input
                type="number"
                name="salePrice"
                className="admin-form-input"
                placeholder="1999"
                value={form.salePrice}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">GST Tax Slab (%)</label>
              <select
                name="gstPercent"
                className="admin-form-select"
                value={form.gstPercent}
                onChange={handleChange}
              >
                {GST_RATES.map((rate) => (
                  <option key={rate} value={rate}>{rate}% GST</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Package Weight (grams)</label>
              <input
                type="number"
                name="weight"
                className="admin-form-input"
                placeholder="200"
                value={form.weight}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group" style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 26 }}>
              <input
                type="checkbox"
                id="form-returnEligible"
                name="returnEligible"
                checked={form.returnEligible}
                onChange={handleChange}
                style={{ width: 18, height: 18, accentColor: "#f35c27", cursor: "pointer" }}
              />
              <label htmlFor="form-returnEligible" style={{ fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
                Eligible for 7-Day Easy Returns / Exchanges
              </label>
            </div>

            {/* ── Section 3: SKU, Inventory & Variants ── */}
            <div className="admin-form-group full-width" style={{ borderBottom: "1px solid #2d3342", paddingBottom: 10, marginTop: 12 }}>
              <strong style={{ fontSize: 13, color: "#f35c27", textTransform: "uppercase", letterSpacing: 1 }}>
                3. Inventory, Colors & Per-Variant SKU Matrix
              </strong>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Total Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                className="admin-form-input"
                value={form.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Low Stock Alert Threshold</label>
              <input
                type="number"
                name="lowStockThreshold"
                className="admin-form-input"
                placeholder="5"
                value={form.lowStockThreshold}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="admin-form-group full-width">
              <label className="admin-form-label">Available Colors (comma separated)</label>
              <input
                type="text"
                name="colors"
                className="admin-form-input"
                placeholder="e.g. Sunny Orange, Ivory Cream, Indigo Blue"
                value={form.colors}
                onChange={handleChange}
              />
            </div>

            {/* Size & Price Builder */}
            <div
              className="admin-form-group full-width"
              style={{
                background: "#1f242d",
                padding: "20px",
                borderRadius: 10,
                border: "1px solid #374151",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <strong style={{ fontSize: 14, color: "#f35c27" }}>Size & Price Variants ({sizeVariants.length})</strong>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
                    Configure specific sizes and customized prices.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddSizeVariant}
                  className="admin-btn admin-btn-secondary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "#34d399",
                    fontWeight: 700,
                    border: "1px solid rgba(52, 211, 153, 0.4)",
                  }}
                >
                  <FiPlus size={15} />
                  <span>+ Add Size & Price</span>
                </button>
              </div>

              {/* Rows List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sizeVariants.map((variant, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      background: "#14171d",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid #2d3342",
                    }}
                  >
                    <div style={{ width: 140 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", display: "block", marginBottom: 4 }}>
                        Size Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. XS, S, Free Size"
                        value={variant.size}
                        onChange={(e) => handleSizeVariantChange(idx, "size", e.target.value)}
                        style={{
                          width: "100%",
                          background: "#0d0f12",
                          border: "1px solid #374151",
                          color: "#fff",
                          padding: "8px 10px",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 700,
                          boxSizing: "border-box",
                        }}
                        required
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", display: "block", marginBottom: 4 }}>
                        Variant Price (₹ INR)
                      </label>
                      <input
                        type="number"
                        placeholder={form.salePrice || form.price || "Price"}
                        value={variant.price}
                        onChange={(e) => handleSizeVariantChange(idx, "price", e.target.value)}
                        style={{
                          width: "100%",
                          background: "#0d0f12",
                          border: "1px solid #374151",
                          color: "#fff",
                          padding: "8px 10px",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 700,
                          boxSizing: "border-box",
                        }}
                        required
                      />
                    </div>

                    {/* Quick Preset Buttons */}
                    <div style={{ display: "flex", gap: 4, alignItems: "flex-end", paddingTop: 18 }}>
                      {DEFAULT_SIZE_PRESETS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleSizeVariantChange(idx, "size", p)}
                          style={{
                            padding: "4px 8px",
                            fontSize: 11,
                            borderRadius: 4,
                            background: variant.size === p ? "#f35c27" : "#2d3342",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <div style={{ paddingTop: 18 }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveSizeVariant(idx)}
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          color: "#ef4444",
                          borderRadius: 6,
                          width: 34,
                          height: 34,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        title="Remove this size variant"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-Variant SKU & Stock Matrix */}
            <div
              className="admin-form-group full-width"
              style={{
                background: "#191d24",
                padding: "20px",
                borderRadius: 10,
                border: "1px solid #2d3342",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <strong style={{ fontSize: 14, color: "#38bdf8" }}>Per-Variant SKU & Stock Inventory ({variants.length})</strong>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
                    Track granular stock per Size + Colour combination (e.g. SC-SEJ-ORG-M: 7 units).
                  </p>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleGenerateVariants(false)}
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: 12, color: "#f35c27", fontWeight: 700, border: "1px solid rgba(243, 92, 39, 0.4)" }}
                  >
                    ⚡ Auto-Generate SKUs
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddVariantRow(false)}
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: 12, color: "#34d399", fontWeight: 700, border: "1px solid rgba(52, 211, 153, 0.4)" }}
                  >
                    + Add Row
                  </button>
                </div>
              </div>

              {variants.length === 0 ? (
                <div style={{ padding: "16px", textAlign: "center", background: "#11141a", borderRadius: 8, color: "#9ca3af", fontSize: 12 }}>
                  No per-variant SKUs configured yet. Click <strong>"⚡ Auto-Generate SKUs"</strong> to create rows from your chosen sizes and colors.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #2d3342", color: "#9ca3af", textAlign: "left" }}>
                        <th style={{ padding: "8px 10px" }}>Size</th>
                        <th style={{ padding: "8px 10px" }}>Colour</th>
                        <th style={{ padding: "8px 10px" }}>Variant SKU</th>
                        <th style={{ padding: "8px 10px" }}>Stock</th>
                        <th style={{ padding: "8px 10px", width: 40 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v, vIdx) => (
                        <tr key={vIdx} style={{ borderBottom: "1px solid #232732" }}>
                          <td style={{ padding: "6px 8px" }}>
                            <input
                              type="text"
                              value={v.size}
                              onChange={(e) => handleVariantChange(vIdx, "size", e.target.value, false)}
                              style={{ width: "100%", background: "#0d0f12", border: "1px solid #374151", color: "#fff", padding: "6px 8px", borderRadius: 4, fontWeight: 700 }}
                            />
                          </td>
                          <td style={{ padding: "6px 8px" }}>
                            <input
                              type="text"
                              value={v.color}
                              onChange={(e) => handleVariantChange(vIdx, "color", e.target.value, false)}
                              style={{ width: "100%", background: "#0d0f12", border: "1px solid #374151", color: "#fff", padding: "6px 8px", borderRadius: 4 }}
                            />
                          </td>
                          <td style={{ padding: "6px 8px" }}>
                            <input
                              type="text"
                              value={v.sku}
                              onChange={(e) => handleVariantChange(vIdx, "sku", e.target.value, false)}
                              style={{ width: "100%", background: "#0d0f12", border: "1px solid #374151", color: "#38bdf8", fontFamily: "monospace", padding: "6px 8px", borderRadius: 4, fontWeight: 600 }}
                            />
                          </td>
                          <td style={{ padding: "6px 8px", width: 90 }}>
                            <input
                              type="number"
                              value={v.stock}
                              onChange={(e) => handleVariantChange(vIdx, "stock", e.target.value, false)}
                              style={{ width: "100%", background: "#0d0f12", border: "1px solid #374151", color: "#10b981", padding: "6px 8px", borderRadius: 4, fontWeight: 700 }}
                            />
                          </td>
                          <td style={{ padding: "6px 8px", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariantRow(vIdx, false)}
                              style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 4 }}
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ── Section 4: Customer Details & Fabric Specifications ── */}
            <div className="admin-form-group full-width" style={{ borderBottom: "1px solid #2d3342", paddingBottom: 10, marginTop: 12 }}>
              <strong style={{ fontSize: 13, color: "#f35c27", textTransform: "uppercase", letterSpacing: 1 }}>
                4. Customer Garment Specifications & Details
              </strong>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Fabric Composition</label>
              <input
                type="text"
                name="fabricComposition"
                className="admin-form-input"
                placeholder="e.g. 100% Handspun Khadi Cotton"
                value={form.fabricComposition}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Garment Fit</label>
              <select
                name="fit"
                className="admin-form-select"
                value={form.fit}
                onChange={handleChange}
              >
                {FIT_OPTIONS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Length</label>
              <select
                name="length"
                className="admin-form-select"
                value={form.length}
                onChange={handleChange}
              >
                {LENGTH_OPTIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Sleeve Type</label>
              <select
                name="sleeveType"
                className="admin-form-select"
                value={form.sleeveType}
                onChange={handleChange}
              >
                {SLEEVE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Neckline Type</label>
              <select
                name="neckType"
                className="admin-form-select"
                value={form.neckType}
                onChange={handleChange}
              >
                {NECK_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Model Measurements</label>
              <input
                type="text"
                name="modelMeasurements"
                className="admin-form-input"
                placeholder="e.g. Model is 5'7&quot;, wearing size M"
                value={form.modelMeasurements}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group" style={{ display: "flex", alignItems: "center", gap: 20, paddingTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  id="form-hasPockets"
                  name="hasPockets"
                  checked={form.hasPockets}
                  onChange={handleChange}
                  style={{ width: 16, height: 16, accentColor: "#f35c27", cursor: "pointer" }}
                />
                <label htmlFor="form-hasPockets" style={{ fontSize: 13, color: "#fff", cursor: "pointer" }}>
                  Functional Pockets
                </label>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  id="form-hasLining"
                  name="hasLining"
                  checked={form.hasLining}
                  onChange={handleChange}
                  style={{ width: 16, height: 16, accentColor: "#f35c27", cursor: "pointer" }}
                />
                <label htmlFor="form-hasLining" style={{ fontSize: 13, color: "#fff", cursor: "pointer" }}>
                  Inner Lining
                </label>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Product Video (Cloudinary)</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleVideoFileUpload(e, false)}
                  disabled={videoUploading}
                  style={{ flex: 1 }}
                />
                {videoUploading && <span style={{ fontSize: 12, color: "#660608" }}>Uploading…</span>}
              </div>
              {videoUploadError && (
                <div style={{ color: "#b00020", fontSize: 12, marginBottom: 6 }}>{videoUploadError}</div>
              )}
              <input
                type="url"
                name="videoUrl"
                className="admin-form-input"
                placeholder="Or paste existing https://res.cloudinary.com/.../video.mp4"
                value={form.videoUrl}
                onChange={handleChange}
              />
              {form.videoUrl && (
                <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", maxHeight: 160, background: "#000" }}>
                  <video src={form.videoUrl} controls style={{ width: "100%", maxHeight: 160, objectFit: "contain" }} />
                </div>
              )}
            </div>

            <div className="admin-form-group full-width">
              <label className="admin-form-label">Fabric Care Instructions</label>
              <input
                type="text"
                name="fabricCare"
                className="admin-form-input"
                placeholder="e.g. Machine wash gentle in cold water with mild detergent. Line dry in shade."
                value={form.fabricCare}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group full-width">
              <label className="admin-form-label">Product Description</label>
              <textarea
                name="description"
                rows="3"
                className="admin-form-textarea"
                placeholder="Detailed craft notes, feel, texture, and story..."
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: 16 }}>
            + Publish Product
          </button>
        </form>
      </div>

      {/* Active Inventory Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-title">Active Product Catalog ({products.length})</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
              Direct live catalog management with SKU tracking, size pricing, and low-stock auto-alerts.
            </div>
          </div>

          {/* Stock Filter Dropdown */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select
              className="admin-form-select"
              style={{ width: "auto", padding: "8px 12px" }}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="ALL">All Inventory ({products.length})</option>
              <option value="LOW_STOCK">⚠️ Low Stock Alert (≤ 5 units)</option>
              <option value="IN_STOCK">In Stock (&gt; 5 units)</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product & Photo</th>
                <th>SKU Code</th>
                <th>Category & Type</th>
                <th>Status</th>
                <th>Homepage Showcase ({products.filter((p) => p.isFeatured).length}/6)</th>
                <th>Base Price & GST</th>
                <th>Stock Level</th>
                <th>Units Sold</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((p) => {
                  const threshold = p.lowStockThreshold || 5;
                  if (stockFilter === "LOW_STOCK") return (p.stock || 0) <= threshold;
                  if (stockFilter === "IN_STOCK") return (p.stock || 0) > threshold;
                  return true;
                })
                .map((p) => {
                  const threshold = p.lowStockThreshold || 5;
                  const isLowStock = (p.stock || 0) <= threshold;
                  const hasSizePrices = p.sizePrices && Object.keys(p.sizePrices).length > 0;
                  const statusColor =
                    p.status === "Draft"
                      ? "#f59e0b"
                      : p.status === "Out of Stock" || p.stock === 0
                      ? "#ef4444"
                      : "#10b981";
                  const statusBg =
                    p.status === "Draft"
                      ? "rgba(245, 158, 11, 0.15)"
                      : p.status === "Out of Stock" || p.stock === 0
                      ? "rgba(239, 68, 68, 0.15)"
                      : "rgba(16, 185, 129, 0.15)";

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img
                            src={p.images?.[0] || "/assets/img/14.png"}
                            alt={p.name}
                            style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover" }}
                          />
                          <div>
                            <strong style={{ color: "#fff" }}>{p.name}</strong>
                            <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.subtitle}</div>
                            {p.collection && (
                              <span style={{ fontSize: 10, color: "#f35c27", fontWeight: 700, textTransform: "uppercase" }}>
                                {p.collection}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: "#f35c27",
                            background: "rgba(243, 92, 39, 0.12)",
                            padding: "3px 8px",
                            borderRadius: 4,
                            fontSize: 11,
                            letterSpacing: "0.5px",
                          }}
                        >
                          {p.sku || `SC-${(p.category || "PRD").toUpperCase().slice(0, 3)}-00${p.id}`}
                        </span>
                        {p.variants?.length > 0 && (
                          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>
                            {p.variants.length} variant SKUs
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, width: "fit-content" }}>
                            {p.category}
                          </span>
                          {p.productType && (
                            <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>
                              {p.productType}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            background: statusBg,
                            color: statusColor,
                            padding: "3px 8px",
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 700,
                            display: "inline-block",
                          }}
                        >
                          {p.status || "Active"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            const res = toggleProductFeatured(p.id);
                            if (!res.success) {
                              alert(res.message);
                            } else {
                              setFeedback(res.message);
                              setTimeout(() => setFeedback(""), 4000);
                            }
                          }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 20,
                            border: p.isFeatured ? "1px solid #f59e0b" : "1px solid #374151",
                            background: p.isFeatured ? "rgba(245, 158, 11, 0.18)" : "#1f242d",
                            color: p.isFeatured ? "#fbbf24" : "#9ca3af",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            transition: "all 0.15s ease",
                          }}
                          title={p.isFeatured ? "Currently shown on Homepage (Click to toggle)" : "Click to feature on Homepage"}
                        >
                          <span>{p.isFeatured ? "★ Showcase Active" : "☆ Showcase Off"}</span>
                        </button>
                      </td>
                      <td>
                        <div>
                          <strong>₹{(p.salePrice || p.price).toLocaleString("en-IN")}</strong>
                          {p.salePrice && <span style={{ textDecoration: "line-through", color: "#6b7280", marginLeft: 6, fontSize: 12 }}>₹{p.price}</span>}
                        </div>
                        {hasSizePrices && (
                          <div style={{ fontSize: 11, color: "#38bdf8", marginTop: 2 }}>
                            {Object.entries(p.sizePrices).map(([sz, pr]) => `${sz}: ₹${pr}`).join(" | ")}
                          </div>
                        )}
                        <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>
                          GST: {p.gstPercent || 5}% incl.
                        </div>
                      </td>
                      <td>
                        {isLowStock ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span
                              style={{
                                background: "#fef2f2",
                                color: "#dc2626",
                                border: "1px solid #fecaca",
                                padding: "2px 8px",
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 800,
                                display: "inline-block",
                                width: "fit-content",
                              }}
                            >
                              ⚠️ LOW: {p.stock} left
                            </span>
                            <span style={{ fontSize: 10, color: "#9ca3af" }}>Threshold: {threshold}</span>
                          </div>
                        ) : (
                          <span style={{ color: "#10b981", fontWeight: 700 }}>
                            {p.stock} in stock
                          </span>
                        )}
                      </td>
                      <td>{p.salesCount || 0} sold</td>
                      <td>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: "4px 8px", fontSize: 11, color: "#38bdf8", display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}
                            title="View live product page in store"
                          >
                            <FiExternalLink size={12} />
                            <span>View</span>
                          </Link>
                          <button
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: "4px 8px", fontSize: 11, color: "#34d399", fontWeight: 700 }}
                            title="Quick restock 10 units"
                            onClick={() => quickRestockProduct(p.id, 10)}
                          >
                            +10
                          </button>
                          <button
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: "4px 8px", fontSize: 11, color: "#38bdf8", display: "flex", alignItems: "center", gap: 4 }}
                            onClick={() => handleStartEdit(p)}
                          >
                            <FiEdit2 size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: "4px 8px", fontSize: 11, color: "#ef4444" }}
                            onClick={() => {
                              if (confirm(`Delete product "${p.name}"?`)) deleteProduct(p.id);
                            }}
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="quickview-overlay">
          <div className="quickview-card" style={{ maxWidth: 720, gridTemplateColumns: "1fr", padding: 32, borderRadius: 16, maxHeight: "90vh", overflowY: "auto" }}>
            <button
              className="cart-close-btn"
              style={{ position: "absolute", top: 16, right: 16 }}
              onClick={() => setEditingProduct(null)}
            >
              ✕
            </button>

            <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>Edit Product: {editingProduct.name}</h2>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>
              Update pricing, size-specific price overrides, category, inventory levels, and imagery for this garment.
            </p>

            <form onSubmit={handleSaveEdit}>
              {/* Photo Preview & Upload */}
              <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 10, marginBottom: 18, border: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <img src={editImagePreview} alt="Preview" style={{ width: 60, height: 75, objectFit: "cover", borderRadius: 6 }} />
                  <div style={{ flex: 1 }}>
                    <label className="auth-label">Update Product Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, true)}
                      style={{ fontSize: 12 }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {/* ── Section 1: Basic Product Information & Catalog ── */}
                <div style={{ gridColumn: "1 / -1", borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginTop: 4 }}>
                  <strong style={{ fontSize: 13, color: "#f35c27", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    1. Basic Product Information & Catalog
                  </strong>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="auth-input"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Master SKU Code</label>
                  <input
                    type="text"
                    name="sku"
                    className="auth-input"
                    value={editForm.sku || ""}
                    onChange={handleEditChange}
                    placeholder="e.g. SC-TOP-001"
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    className="auth-input"
                    value={editForm.subtitle}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Hook / Tagline</label>
                  <input
                    type="text"
                    name="hook"
                    className="auth-input"
                    value={editForm.hook || ""}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Edit Category with + New Category */}
                <div className="auth-form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <label className="auth-label" style={{ margin: 0 }}>Category *</label>
                    <button
                      type="button"
                      onClick={() => setIsCreatingCategoryEdit(!isCreatingCategoryEdit)}
                      style={{ background: "none", border: "none", color: "#f35c27", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                    >
                      {isCreatingCategoryEdit ? "Select List" : "+ New Category"}
                    </button>
                  </div>

                  {isCreatingCategoryEdit ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      <input
                        type="text"
                        placeholder="New category name"
                        value={newCategoryInputEdit}
                        onChange={(e) => setNewCategoryInputEdit(e.target.value)}
                        className="auth-input"
                        style={{ flex: 1, padding: "8px" }}
                      />
                      <button
                        type="button"
                        onClick={() => handleCreateNewCategory(true)}
                        style={{ padding: "0 12px", background: "#111", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700 }}
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <select
                      name="category"
                      className="auth-input"
                      value={editForm.category}
                      onChange={handleEditChange}
                      style={{ background: "#fff" }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Product Type</label>
                  <select
                    name="productType"
                    className="auth-input"
                    value={editForm.productType || "Top"}
                    onChange={handleEditChange}
                    style={{ background: "#fff" }}
                  >
                    {PRODUCT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Collection</label>
                  <input
                    type="text"
                    name="collection"
                    className="auth-input"
                    placeholder="e.g. Summer 2026, Khadi Essentials"
                    value={editForm.collection || ""}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Product Status</label>
                  <select
                    name="status"
                    className="auth-input"
                    value={editForm.status || "Active"}
                    onChange={handleEditChange}
                    style={{ background: "#fff" }}
                  >
                    {PRODUCT_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* ── Section 2: Pricing, Tax & Logistics ── */}
                <div style={{ gridColumn: "1 / -1", borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginTop: 10 }}>
                  <strong style={{ fontSize: 13, color: "#f35c27", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    2. Pricing, Tax & Logistics
                  </strong>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">MRP / Regular Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    className="auth-input"
                    value={editForm.price}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Selling / Sale Price (₹, optional)</label>
                  <input
                    type="number"
                    name="salePrice"
                    className="auth-input"
                    value={editForm.salePrice}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">GST Tax Slab (%)</label>
                  <select
                    name="gstPercent"
                    className="auth-input"
                    value={editForm.gstPercent || "5"}
                    onChange={handleEditChange}
                    style={{ background: "#fff" }}
                  >
                    {GST_RATES.map((rate) => (
                      <option key={rate} value={rate}>{rate}% GST</option>
                    ))}
                  </select>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Package Weight (grams)</label>
                  <input
                    type="number"
                    name="weight"
                    className="auth-input"
                    placeholder="200"
                    value={editForm.weight || "200"}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="auth-form-group" style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                  <input
                    type="checkbox"
                    id="edit-returnEligible"
                    name="returnEligible"
                    checked={editForm.returnEligible}
                    onChange={handleEditChange}
                    style={{ width: 16, height: 16, accentColor: "#f35c27", cursor: "pointer" }}
                  />
                  <label htmlFor="edit-returnEligible" style={{ fontSize: 13, fontWeight: 700, color: "#111", cursor: "pointer" }}>
                    Eligible for 7-Day Easy Returns / Exchanges
                  </label>
                </div>

                {/* ── Section 3: SKU, Inventory & Variants ── */}
                <div style={{ gridColumn: "1 / -1", borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginTop: 10 }}>
                  <strong style={{ fontSize: 13, color: "#f35c27", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    3. Inventory & Per-Variant SKU Matrix
                  </strong>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Total Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    className="auth-input"
                    value={editForm.stock}
                    onChange={handleEditChange}
                    min="0"
                    required
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    className="auth-input"
                    placeholder="5"
                    value={editForm.lowStockThreshold || "5"}
                    onChange={handleEditChange}
                    min="1"
                  />
                </div>

                <div className="auth-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="auth-label">Available Colors (comma separated)</label>
                  <input
                    type="text"
                    name="colors"
                    className="auth-input"
                    value={editForm.colors}
                    onChange={handleEditChange}
                  />
                </div>

                {/* Dynamic Size & Price List in Edit Modal */}
                <div className="auth-form-group" style={{ gridColumn: "1 / -1", background: "#f8f9fa", padding: "16px 18px", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                        Size & Price Variants ({editSizeVariants.length})
                      </div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>
                        Set custom pricing for each size variant.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddEditSizeVariant}
                      style={{
                        padding: "6px 12px",
                        background: "#111111",
                        color: "#ffffff",
                        borderRadius: 6,
                        border: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <FiPlus size={13} />
                      <span>+ Add Size & Price</span>
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {editSizeVariants.map((v, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center", background: "#ffffff", padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db" }}>
                        <div style={{ width: 120 }}>
                          <input
                            type="text"
                            placeholder="Size (e.g. M)"
                            value={v.size}
                            onChange={(e) => handleEditSizeVariantChange(idx, "size", e.target.value)}
                            style={{ width: "100%", padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12, fontWeight: 700 }}
                            required
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <input
                            type="number"
                            placeholder="Price (₹)"
                            value={v.price}
                            onChange={(e) => handleEditSizeVariantChange(idx, "price", e.target.value)}
                            style={{ width: "100%", padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 4, fontSize: 12, fontWeight: 700 }}
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEditSizeVariant(idx)}
                          style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: 4 }}
                          title="Remove size"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Per-Variant SKU & Stock Matrix in Edit Modal */}
                <div
                  className="auth-form-group"
                  style={{
                    gridColumn: "1 / -1",
                    background: "#f8f9fa",
                    padding: "16px 18px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                        Per-Variant SKU & Stock Inventory ({editVariants.length})
                      </div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>
                        Track stock per Size + Colour combination.
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleGenerateVariants(true)}
                        style={{
                          padding: "6px 12px",
                          background: "#fff",
                          border: "1px solid #f35c27",
                          color: "#f35c27",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        ⚡ Auto-Generate SKUs
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddVariantRow(true)}
                        style={{
                          padding: "6px 12px",
                          background: "#111",
                          color: "#fff",
                          borderRadius: 6,
                          border: "none",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        + Add Row
                      </button>
                    </div>
                  </div>

                  {editVariants.length === 0 ? (
                    <div style={{ padding: "12px", textAlign: "center", background: "#fff", borderRadius: 6, border: "1px solid #e5e7eb", color: "#6b7280", fontSize: 12 }}>
                      No per-variant SKUs yet. Click "⚡ Auto-Generate SKUs" to create combinations.
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #e5e7eb", color: "#6b7280", textAlign: "left" }}>
                            <th style={{ padding: "6px 8px" }}>Size</th>
                            <th style={{ padding: "6px 8px" }}>Colour</th>
                            <th style={{ padding: "6px 8px" }}>Variant SKU</th>
                            <th style={{ padding: "6px 8px" }}>Stock</th>
                            <th style={{ padding: "6px 8px", width: 36 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editVariants.map((v, vIdx) => (
                            <tr key={vIdx} style={{ borderBottom: "1px solid #f0f0f0" }}>
                              <td style={{ padding: "4px 6px" }}>
                                <input
                                  type="text"
                                  value={v.size}
                                  onChange={(e) => handleVariantChange(vIdx, "size", e.target.value, true)}
                                  style={{ width: "100%", padding: "4px 6px", border: "1px solid #d1d5db", borderRadius: 4, fontWeight: 700 }}
                                />
                              </td>
                              <td style={{ padding: "4px 6px" }}>
                                <input
                                  type="text"
                                  value={v.color}
                                  onChange={(e) => handleVariantChange(vIdx, "color", e.target.value, true)}
                                  style={{ width: "100%", padding: "4px 6px", border: "1px solid #d1d5db", borderRadius: 4 }}
                                />
                              </td>
                              <td style={{ padding: "4px 6px" }}>
                                <input
                                  type="text"
                                  value={v.sku}
                                  onChange={(e) => handleVariantChange(vIdx, "sku", e.target.value, true)}
                                  style={{ width: "100%", padding: "4px 6px", border: "1px solid #d1d5db", borderRadius: 4, fontFamily: "monospace", color: "#0284c7", fontWeight: 600 }}
                                />
                              </td>
                              <td style={{ padding: "4px 6px", width: 80 }}>
                                <input
                                  type="number"
                                  value={v.stock}
                                  onChange={(e) => handleVariantChange(vIdx, "stock", e.target.value, true)}
                                  style={{ width: "100%", padding: "4px 6px", border: "1px solid #d1d5db", borderRadius: 4, fontWeight: 700, color: "#16a34a" }}
                                />
                              </td>
                              <td style={{ padding: "4px 6px", textAlign: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariantRow(vIdx, true)}
                                  style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: 2 }}
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* ── Section 4: Customer Details & Fabric Specifications ── */}
                <div style={{ gridColumn: "1 / -1", borderBottom: "1px solid #e5e7eb", paddingBottom: 6, marginTop: 10 }}>
                  <strong style={{ fontSize: 13, color: "#f35c27", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    4. Customer Garment Specifications & Details
                  </strong>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Fabric Composition</label>
                  <input
                    type="text"
                    name="fabricComposition"
                    className="auth-input"
                    value={editForm.fabricComposition || ""}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Garment Fit</label>
                  <select
                    name="fit"
                    className="auth-input"
                    value={editForm.fit || "Relaxed"}
                    onChange={handleEditChange}
                    style={{ background: "#fff" }}
                  >
                    {FIT_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Length</label>
                  <select
                    name="length"
                    className="auth-input"
                    value={editForm.length || "Regular"}
                    onChange={handleEditChange}
                    style={{ background: "#fff" }}
                  >
                    {LENGTH_OPTIONS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Sleeve Type</label>
                  <select
                    name="sleeveType"
                    className="auth-input"
                    value={editForm.sleeveType || "Half Sleeve"}
                    onChange={handleEditChange}
                    style={{ background: "#fff" }}
                  >
                    {SLEEVE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Neckline Type</label>
                  <select
                    name="neckType"
                    className="auth-input"
                    value={editForm.neckType || "Round Neck"}
                    onChange={handleEditChange}
                    style={{ background: "#fff" }}
                  >
                    {NECK_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Model Measurements</label>
                  <input
                    type="text"
                    name="modelMeasurements"
                    className="auth-input"
                    value={editForm.modelMeasurements || ""}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="auth-form-group" style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 20, padding: "4px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      id="edit-hasPockets"
                      name="hasPockets"
                      checked={Boolean(editForm.hasPockets)}
                      onChange={handleEditChange}
                      style={{ width: 16, height: 16, accentColor: "#f35c27", cursor: "pointer" }}
                    />
                    <label htmlFor="edit-hasPockets" style={{ fontSize: 13, color: "#111", cursor: "pointer" }}>
                      Functional Pockets
                    </label>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      id="edit-hasLining"
                      name="hasLining"
                      checked={Boolean(editForm.hasLining)}
                      onChange={handleEditChange}
                      style={{ width: 16, height: 16, accentColor: "#f35c27", cursor: "pointer" }}
                    />
                    <label htmlFor="edit-hasLining" style={{ fontSize: 13, color: "#111", cursor: "pointer" }}>
                      Inner Lining
                    </label>
                  </div>
                </div>

                <div className="auth-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="auth-label">Product Video (Cloudinary)</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleVideoFileUpload(e, true)}
                      disabled={videoUploading}
                      style={{ flex: 1 }}
                    />
                    {videoUploading && <span style={{ fontSize: 12, color: "#660608" }}>Uploading…</span>}
                  </div>
                  {videoUploadError && (
                    <div style={{ color: "#b00020", fontSize: 12, marginBottom: 6 }}>{videoUploadError}</div>
                  )}
                  <input
                    type="url"
                    name="videoUrl"
                    className="auth-input"
                    placeholder="Or paste existing https://res.cloudinary.com/.../video.mp4"
                    value={editForm.videoUrl || ""}
                    onChange={handleEditChange}
                  />
                  {editForm.videoUrl && (
                    <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", maxHeight: 180, background: "#000" }}>
                      <video src={editForm.videoUrl} controls style={{ width: "100%", maxHeight: 180, objectFit: "contain" }} />
                    </div>
                  )}
                </div>

                <div className="auth-form-group full-width" style={{ gridColumn: "1 / -1" }}>
                  <label className="auth-label">Fabric Care Instructions</label>
                  <input
                    type="text"
                    name="fabricCare"
                    className="auth-input"
                    value={editForm.fabricCare || ""}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="auth-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="auth-label">Product Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="auth-input"
                    value={editForm.description}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button type="submit" className="cart-checkout-btn" style={{ flex: 1, margin: 0, padding: "14px" }}>
                  Save Product Changes
                </button>
                <button
                  type="button"
                  className="quickview-size-pill"
                  style={{ padding: "14px 20px" }}
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
