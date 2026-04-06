import React, { useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";
import "../styles/components.css";

const CATEGORIES = ["Chair", "Bed", "Cupboard"];

const ProductForm = ({ isOpen, onClose, onSubmit, editProduct, loading }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    category: "Chair",
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || "",
        price: editProduct.price !== undefined ? String(editProduct.price) : "",
        description: editProduct.description || "",
        image: null,
        category: editProduct.category || "Chair",
      });
      // Show existing image preview if available
      setImagePreview(editProduct.image || "");
    } else {
      setForm({ name: "", price: "", description: "", image: null, category: "Chair" });
      setImagePreview("");
    }
    setErrors({});
  }, [editProduct, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.price) {
      newErrors.price = "Price is required";
    } else {
      const parsed = parseFloat(form.price);
      if (isNaN(parsed) || parsed < 0) newErrors.price = "Enter a valid price (0 or more)";
    }
    if (!form.category) newErrors.category = "Category is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "File size must be less than 5MB" }));
        return;
      }
      setForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result || "");
      };
      reader.readAsDataURL(file);
      if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("price", parseFloat(form.price));
    formData.append("description", form.description.trim());
    formData.append("category", form.category);
    
    // Only append image if a new file is selected
    if (form.image) {
      formData.append("image", form.image);
    }

    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">{editProduct ? "Edit Product" : "Add New Product"}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "input-error" : ""}`}
              placeholder="e.g. Wooden Chair"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className={`form-input ${errors.price ? "input-error" : ""}`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`form-input form-select ${errors.category ? "input-error" : ""}`}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`form-input form-textarea ${errors.description ? "input-error" : ""}`}
              placeholder="Describe the product..."
              rows={3}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          {/* Image Upload Section */}
          <div className="form-group">
            <label className="form-label">Product Image (optional)</label>
            <div className={`image-upload-container ${errors.image ? "input-error" : ""}`}>
              {imagePreview ? (
                <div className="image-preview-wrapper">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    className="image-clear-btn"
                    onClick={handleRemoveImage}
                    aria-label="Remove image"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="image-upload-label">
                  <div className="image-upload-content">
                    <Upload size={32} className="upload-icon" />
                    <p className="upload-text">Click to upload or drag and drop</p>
                    <p className="upload-subtext">PNG, JPG, GIF, WebP (max 5MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input-hidden"
                  />
                </label>
              )}
            </div>
            {errors.image && <span className="error-text">{errors.image}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : editProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
