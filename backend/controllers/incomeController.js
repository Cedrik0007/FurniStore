const Income = require("../models/Income");
const Product = require("../models/Product");

// @desc    Get all incomes
// @route   GET /api/income
// @access  Private
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find()
      .populate("product", "name price category")
      .populate("createdBy", "name")
      .sort({ date: -1 });

    // Calculate total safely
    const total = incomes.reduce((sum, income) => {
      const amount = parseFloat(income.amount) || 0;
      return sum + amount;
    }, 0);

    res.status(200).json({ incomes, total });
  } catch (error) {
    console.error("Get incomes error:", error);
    res.status(500).json({ message: "Server error fetching incomes" });
  }
};

// @desc    Add income
// @route   POST /api/income
// @access  Private
const addIncome = async (req, res) => {
  try {
    const { product, amount, date, note } = req.body;

    if (!product || !date) {
      return res.status(400).json({ message: "Product and date are required" });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Please provide a valid amount greater than 0" });
    }

    // Verify product exists
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: "Product not found" });
    }

    const income = await Income.create({
      product,
      productName: productDoc.name,
      amount: parsedAmount,
      date: new Date(date),
      note: note ? note.trim() : "",
      createdBy: req.user._id,
    });

    const populatedIncome = await Income.findById(income._id)
      .populate("product", "name price category")
      .populate("createdBy", "name");

    res.status(201).json({ message: "Income added successfully", income: populatedIncome });
  } catch (error) {
    console.error("Add income error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error adding income" });
  }
};

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private (Owner only)
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Income record not found" });
    }

    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting income" });
  }
};

module.exports = { getIncomes, addIncome, deleteIncome };
