import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import ProductForm from "../components/ProductForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { Package, Trash2, Edit } from "lucide-react";
import "../styles/products.css";

const CATEGORIES = ["All", "Chair", "Bed", "Cupboard"];

const formatCurrency = (value) => {
  const num = parseFloat(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
};

const ProductsPage = () => {
  const { isOwner } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = filterCategory !== "All" ? { category: filterCategory } : {};
      const res = await api.get("/products", { params });
      setProducts(res.data.products || []);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to load products" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filterCategory]);

  const handleAddProduct = async (formData) => {
    setFormLoading(true);
    try {
      await api.post("/products", formData);
      setAlert({ type: "success", message: "Product added successfully!" });
      setIsFormOpen(false);
      fetchProducts();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to add product" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (formData) => {
    setFormLoading(true);
    try {
      await api.put(`/products/${editProduct._id}`, formData);
      setAlert({ type: "success", message: "Product updated successfully!" });
      setEditProduct(null);
      setIsFormOpen(false);
      fetchProducts();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to update product" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await api.delete(`/products/${deleteDialog.product._id}`);
      setAlert({ type: "success", message: "Product deleted successfully!" });
      setDeleteDialog({ open: false, product: null });
      fetchProducts();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete product" });
      setDeleteDialog({ open: false, product: null });
    }
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditProduct(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{products.length} items</p>
        </div>
        {isOwner() && (
          <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
            + Add Product
          </button>
        )}
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Category Filter */}
      <div className="filter-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-tab ${filterCategory === cat ? "filter-tab-active" : ""}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading products..." />
      ) : products.length === 0 ? (
        <div className="empty-state">
          <Package size={48} className="empty-icon" />
          <p>No products found</p>
          {isOwner() && (
            <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
              Add First Product
            </button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image-wrapper">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="product-image-placeholder"
                  style={{ display: product.image ? "none" : "flex" }}
                >
                  <Package size={48} />
                </div>
              </div>
              <div className="product-body">
                <div className="product-category-badge">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">{formatCurrency(product.price)}</div>
              </div>
              {isOwner() && (
                <div className="product-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => openEdit(product)}
                  >
                    <Edit size={16} className="inline" /> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setDeleteDialog({ open: true, product })}
                  >
                    <Trash2 size={16} className="inline" /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ProductForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}
        editProduct={editProduct}
        loading={formLoading}
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteDialog.product?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteDialog({ open: false, product: null })}
        confirmText="Delete"
        confirmClass="btn-danger"
      />
    </div>
  );
};

export default ProductsPage;
