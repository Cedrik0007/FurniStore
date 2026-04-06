const Expense = require("../models/Expense");

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ isDeleted: { $ne: true } })
      .populate("createdBy", "name")
      .sort({ date: -1 });

    // Calculate total safely
    const total = expenses.reduce((sum, expense) => {
      const amount = parseFloat(expense.amount) || 0;
      return sum + amount;
    }, 0);

    res.status(200).json({ expenses, total });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Server error fetching expenses" });
  }
};

// @desc    Add expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
  try {
    const { type, amount, date, note } = req.body;

    if (!type || !date) {
      return res.status(400).json({ message: "Type and date are required" });
    }

    const validTypes = ["rent", "salary", "transport", "others"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid expense type" });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Please provide a valid amount greater than 0" });
    }

    const expense = await Expense.create({
      type,
      amount: parsedAmount,
      date: new Date(date),
      note: note ? note.trim() : "",
      createdBy: req.user._id,
    });

    const populatedExpense = await Expense.findById(expense._id).populate("createdBy", "name");

    res.status(201).json({ message: "Expense added successfully", expense: populatedExpense });
  } catch (error) {
    console.error("Add expense error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error adding expense" });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private (Owner only)
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense record not found" });
    }

    const { deleteReason } = req.body;

    expense.isDeleted = true;
    expense.deletedAt = new Date();
    expense.deleteReason = deleteReason || null;

    const updatedExpense = await expense.save();
    res.status(200).json({ message: "Expense deleted successfully", expense: updatedExpense });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting expense" });
  }
};

module.exports = { getExpenses, addExpense, deleteExpense };
