const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
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
router.post("/", protect, ownerOnly, upload.single("image"), createProduct);
router.put("/:id", protect, ownerOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, ownerOnly, deleteProduct);

module.exports = router;
