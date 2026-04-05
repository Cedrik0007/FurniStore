const express = require("express");
const router = express.Router();
const { getIncomes, addIncome, deleteIncome } = require("../controllers/incomeController");
const { protect, ownerOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getIncomes);
router.post("/", protect, addIncome);
router.delete("/:id", protect, ownerOnly, deleteIncome);

module.exports = router;
