const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category, isDeleted: { $ne: true } } : { isDeleted: { $ne: true } };
    const products = await Product.find(filter)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .where("isDeleted")
      .ne(true)
      .populate("createdBy", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching product" });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Owner only)
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    // Validation
    if (!name || !description || !category) {
      return res.status(400).json({ message: "Name, description, and category are required" });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: "Please provide a valid price" });
    }

    // Handle image upload
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      name: name.trim(),
      price: parsedPrice,
      description: description.trim(),
      image: imagePath,
      category,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Create product error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error creating product" });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Owner only)
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validation
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: "Please provide a valid price" });
    }

    product.name = name ? name.trim() : product.name;
    product.price = parsedPrice;
    product.description = description ? description.trim() : product.description;
    product.category = category || product.category;

    // Handle image upload
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error updating product" });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { deleteReason } = req.body;

    product.isDeleted = true;
    product.deletedAt = new Date();
    product.deleteReason = deleteReason || null;

    const updatedProduct = await product.save();
    res.status(200).json({ message: "Product deleted successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting product" });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
