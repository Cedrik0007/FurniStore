const express = require("express");
const router = express.Router();
const { getExpenses, addExpense, deleteExpense } = require("../controllers/expenseController");
const { protect, ownerOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getExpenses);
router.post("/", protect, addExpense);
router.delete("/:id", protect, ownerOnly, deleteExpense);

module.exports = router;
