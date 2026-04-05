const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, ownerOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getProducts);
router.get("/:id", protect, getProduct);
router.post("/", protect, ownerOnly, createProduct);
router.put("/:id", protect, ownerOnly, updateProduct);
router.delete("/:id", protect, ownerOnly, deleteProduct);

module.exports = router;
