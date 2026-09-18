"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { fileToBase32, base32ToDataUrl } from "@/lib/base32";

export default function AdminProductsPage() {
  const { products, addProduct, deleteProduct } = useStore();

  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    hook: "",
    description: "",
    category: "Tops",
    price: "",
    salePrice: "",
    stock: "25",
    sizes: "XS, S, M, L, XL",
    colors: "Indigo Blue, Natural Beige",
  });

  // Base32 Image Upload State
  const [base32Image, setBase32Image] = useState("");
  const [imagePreview, setImagePreview] = useState("/assets/img/14.png");
  const [imageMime, setImageMime] = useState("image/png");
  const [imageFileName, setImageFileName] = useState("");
  const [isEncoding, setIsEncoding] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle local image file upload & convert to Base32
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsEncoding(true);
      const { base32Data, mimeType, name } = await fileToBase32(file);
      setBase32Image(base32Data);
      setImageMime(mimeType);
      setImageFileName(name);

      // Create preview Data URL
      const dataUrl = base32ToDataUrl(base32Data, mimeType);
      setImagePreview(dataUrl);
      setIsEncoding(false);
    } catch (err) {
      console.error("Failed to encode image to Base32:", err);
      setIsEncoding(false);
      alert("Error reading and encoding image file to Base32.");
    }
  };

  const handleSelectPreset = (url) => {
    setBase32Image("");
    setImagePreview(url);
    setImageFileName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    // Use base32 image if uploaded, otherwise preset image preview
    const finalImageUrl = base32Image ? base32ToDataUrl(base32Image, imageMime) : imagePreview;

    const newProd = addProduct({
      name: form.name,
      subtitle: form.subtitle || "Handcrafted Textile",
      hook: form.hook || form.name,
      description: form.description || "Crafted with 100% natural, hand-spun khadi cotton.",
      category: form.category,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      stock: Number(form.stock) || 20,
      images: [finalImageUrl, "/assets/img/25.png", "/assets/img/20.png"],
      base32Data: base32Image || null, // Stored directly in DB as Base32
      isBase32: Boolean(base32Image),
      mimeType: imageMime,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      why: [
        "100% Handspun organic Khadi",
        "Breathable all-season comfort",
        "Artisanal low-impact dye process",
      ],
      when: "Everyday luxury and mindful living.",
      oneLine: "Lightweight, ethical, and built to last.",
    });

    setFeedback(`✓ Product "${newProd.name}" (with Base32 Image) successfully published to database & storefront!`);
    setForm({
      name: "",
      subtitle: "",
      hook: "",
      description: "",
      category: "Tops",
      price: "",
      salePrice: "",
      stock: "25",
      sizes: "XS, S, M, L, XL",
      colors: "Indigo Blue, Natural Beige",
    });
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
            <div className="admin-card-title">Upload New Product & Base32 Image to Database</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
              Images are automatically encoded into <strong>RFC 4648 Base32</strong> and persisted in the database.
            </div>
          </div>
        </div>

        {feedback && (
          <div style={{ background: "#064e3b", border: "1px solid #10b981", color: "#a7f3d0", padding: "12px 18px", borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
            {feedback}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">Product Name</label>
              <input
                type="text"
                name="name"
                className="admin-form-input"
                placeholder="e.g. Maya's Khadi Kurti"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Subtitle / Collection Line</label>
              <input
                type="text"
                name="subtitle"
                className="admin-form-input"
                placeholder="e.g. The Everyday Glow"
                value={form.subtitle}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Category</label>
              <select
                name="category"
                className="admin-form-select"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Tops">Tops & Shirts</option>
                <option value="Dresses">Dresses & Kurtis</option>
                <option value="Fabrics">Pure Fabrics</option>
                <option value="Bottoms">Trousers & Skirts</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Regular Price (INR ₹)</label>
              <input
                type="number"
                name="price"
                className="admin-form-input"
                placeholder="e.g. 2499"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Base32 Image File Upload Zone */}
            <div className="admin-form-group full-width" style={{ background: "#0d0f12", border: "1px dashed #374151", padding: 20, borderRadius: 8 }}>
              <label className="admin-form-label" style={{ color: "#f35c27" }}>
                Upload Product Image (Direct Base32 DB Storage)
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20, alignItems: "center" }}>
                {/* Live Preview */}
                <div style={{ width: 130, height: 150, background: "#1f242d", borderRadius: 8, overflow: "hidden", border: "1px solid #374151", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="admin-form-input"
                    style={{ padding: "8px", marginBottom: 10 }}
                  />

                  {isEncoding && <div style={{ color: "#fbbf24", fontSize: 12 }}>Encoding image binary to RFC 4648 Base32...</div>}

                  {base32Image && (
                    <div style={{ fontSize: 12, color: "#34d399", background: "#064e3b", padding: "6px 10px", borderRadius: 4, marginTop: 6 }}>
                      Base32 Encoded ({Math.round(base32Image.length / 1024)} KB). Preview snippet: <code>{base32Image.slice(0, 32)}...</code>
                    </div>
                  )}

                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
                    Or pick a preset asset:{" "}
                    <button type="button" onClick={() => handleSelectPreset("/assets/img/14.png")} style={{ background: "none", border: "none", color: "#f35c27", textDecoration: "underline", cursor: "pointer" }}>Top 14</button> |{" "}
                    <button type="button" onClick={() => handleSelectPreset("/assets/img/22.png")} style={{ background: "none", border: "none", color: "#f35c27", textDecoration: "underline", cursor: "pointer" }}>Top 22</button> |{" "}
                    <button type="button" onClick={() => handleSelectPreset("/assets/img/15.png")} style={{ background: "none", border: "none", color: "#f35c27", textDecoration: "underline", cursor: "pointer" }}>Dress 15</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Sale / Offer Price (Optional)</label>
              <input
                type="number"
                name="salePrice"
                className="admin-form-input"
                placeholder="e.g. 1999"
                value={form.salePrice}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Initial Inventory Stock</label>
              <input
                type="number"
                name="stock"
                className="admin-form-input"
                value={form.stock}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group full-width">
              <label className="admin-form-label">Available Sizes (Comma separated)</label>
              <input
                type="text"
                name="sizes"
                className="admin-form-input"
                value={form.sizes}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group full-width">
              <label className="admin-form-label">Product Description</label>
              <textarea
                name="description"
                rows="3"
                className="admin-form-textarea"
                placeholder="Detailed craft notes, feel, texture, and care instructions..."
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: 12 }}>
            + Publish Product (Base32 in DB)
          </button>
        </form>
      </div>

      {/* Active Inventory Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Active Product Catalog ({products.length})</div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product & Image</th>
                <th>Storage Format</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sales</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
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
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-status-badge status-delivered">
                      {p.isBase32 ? "BASE32 IN DB" : "STATIC ASSET"}
                    </span>
                  </td>
                  <td>{p.category}</td>
                  <td>
                    <strong>₹{(p.salePrice || p.price).toLocaleString("en-IN")}</strong>
                    {p.salePrice && <span style={{ textDecoration: "line-through", color: "#6b7280", marginLeft: 6, fontSize: 12 }}>₹{p.price}</span>}
                  </td>
                  <td>
                    <span style={{ color: p.stock < 10 ? "#ef4444" : "#10b981", fontWeight: 700 }}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td>{p.salesCount || 0} sold</td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: "4px 10px", fontSize: 12, color: "#ef4444" }}
                      onClick={() => {
                        if (confirm(`Delete product "${p.name}"?`)) deleteProduct(p.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
