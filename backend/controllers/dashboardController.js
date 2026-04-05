const Income = require("../models/Income");
const Expense = require("../models/Expense");
const Product = require("../models/Product");

// @desc    Get dashboard summary
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    // Fetch all income and expenses in parallel
    const [incomes, expenses, products] = await Promise.all([
      Income.find().populate("product", "name category").sort({ date: -1 }),
      Expense.find().sort({ date: -1 }),
      Product.find(),
    ]);

    // Calculate totals safely using reduce + parseFloat
    const totalIncome = incomes.reduce((sum, income) => {
      return sum + (parseFloat(income.amount) || 0);
    }, 0);

    const totalExpense = expenses.reduce((sum, expense) => {
      return sum + (parseFloat(expense.amount) || 0);
    }, 0);

    // Profit = Income - Expense
    const profit = totalIncome - totalExpense;

    // Recent transactions (last 10, combined and sorted by date)
    const recentIncomes = incomes.slice(0, 5).map((income) => ({
      _id: income._id,
      type: "income",
      description: income.productName || (income.product ? income.product.name : "Unknown"),
      amount: parseFloat(income.amount) || 0,
      date: income.date,
      createdAt: income.createdAt,
    }));

    const recentExpenses = expenses.slice(0, 5).map((expense) => ({
      _id: expense._id,
      type: "expense",
      description: expense.type.charAt(0).toUpperCase() + expense.type.slice(1),
      amount: parseFloat(expense.amount) || 0,
      date: expense.date,
      createdAt: expense.createdAt,
    }));

    // Combine and sort by date (newest first), take top 10
    const recentTransactions = [...recentIncomes, ...recentExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.status(200).json({
      summary: {
        totalIncome: parseFloat(totalIncome.toFixed(2)),
        totalExpense: parseFloat(totalExpense.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
        totalProducts: products.length,
        totalTransactions: incomes.length + expenses.length,
      },
      recentTransactions,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error loading dashboard" });
  }
};

module.exports = { getDashboard };
