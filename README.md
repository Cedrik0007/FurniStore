# 🛋️ FurniStore Manager — Furniture Store Micro SaaS

A complete production-ready web application for managing a small furniture store.
Built with React (Vite) + Node.js/Express + MongoDB.

---

## 📁 Folder Structure

```
furniture-store/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Seed predefined users
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── incomeController.js
│   │   ├── expenseController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect + ownerOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Income.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── dashboardRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Alert.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   ├── ProductForm.jsx
    │   │   ├── IncomeForm.jsx
    │   │   └── ExpenseForm.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── IncomePage.jsx
    │   │   └── ExpensePage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   ├── global.css
    │   │   ├── layout.css
    │   │   ├── components.css
    │   │   ├── login.css
    │   │   ├── dashboard.css
    │   │   ├── products.css
    │   │   └── transactions.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Prerequisites

- Node.js v18 or higher
- MongoDB (local or MongoDB Atlas)
- npm

---

## 🚀 Setup Steps

### Step 1 — Clone / extract the project

```bash
cd furniture-store
```

---

### Step 2 — Set up the Backend

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/furniture_store
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string.

---

### Step 3 — Seed the Database (Create Users)

```bash
npm run seed
```

This will create the 3 predefined users with hashed passwords.

**Output:**
```
✅ Created user: owner@furniture.com (owner)
✅ Created user: staff1@furniture.com (staff)
✅ Created user: staff2@furniture.com (staff)
```

---

### Step 4 — Start the Backend

```bash
npm run dev      # Development (with nodemon)
# or
npm start        # Production
```

Backend runs at: `http://localhost:5000`

---

### Step 5 — Set up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---


## 👥 Role Permissions

| Feature             | Owner | Staff |
|---------------------|-------|-------|
| View Dashboard      | ✅    | ✅    |
| View Products       | ✅    | ✅    |
| Add Product         | ✅    | ❌    |
| Edit Product        | ✅    | ❌    |
| Delete Product      | ✅    | ❌    |
| Add Income          | ✅    | ✅    |
| Delete Income       | ✅    | ❌    |
| Add Expense         | ✅    | ✅    |
| Delete Expense      | ✅    | ❌    |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint         | Access  | Description      |
|--------|-----------------|---------|------------------|
| POST   | /api/auth/login | Public  | Login user       |
| GET    | /api/auth/me    | Private | Get current user |

### Products
| Method | Endpoint             | Access       | Description      |
|--------|---------------------|--------------|------------------|
| GET    | /api/products        | Private      | Get all products |
| GET    | /api/products/:id    | Private      | Get one product  |
| POST   | /api/products        | Owner only   | Create product   |
| PUT    | /api/products/:id    | Owner only   | Update product   |
| DELETE | /api/products/:id    | Owner only   | Delete product   |

### Income
| Method | Endpoint          | Access     | Description    |
|--------|------------------|------------|----------------|
| GET    | /api/income       | Private    | Get all income |
| POST   | /api/income       | Private    | Add income     |
| DELETE | /api/income/:id   | Owner only | Delete income  |

### Expenses
| Method | Endpoint            | Access     | Description      |
|--------|---------------------|------------|------------------|
| GET    | /api/expenses        | Private    | Get all expenses |
| POST   | /api/expenses        | Private    | Add expense      |
| DELETE | /api/expenses/:id    | Owner only | Delete expense   |

### Dashboard
| Method | Endpoint        | Access  | Description         |
|--------|----------------|---------|---------------------|
| GET    | /api/dashboard  | Private | Get summary + stats |

---

## 💰 Accounting Logic

```
Total Income  = SUM of all income amounts
Total Expense = SUM of all expense amounts
Profit/Loss   = Total Income - Total Expense
```

- All amounts use `parseFloat()` with fallback to `0` for null/undefined safety.
- Totals are calculated server-side using `Array.reduce()`.
- Results are rounded to 2 decimal places using `.toFixed(2)`.

---

## 🛡️ Security Features

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT tokens with configurable expiry
- Protected routes via middleware
- Role-based access control (owner vs staff)
- Input validation on both frontend and backend
- Global 401 handler redirects to login

---

## 📱 UI Features

- **Mobile-first** responsive design
- **Bottom navigation** on mobile
- **Sidebar navigation** on tablet/desktop
- Touch-friendly large buttons (min 42px height)
- Slide-up modals on mobile, centered on desktop
- Loading states on all async operations
- Error messages for all failed operations
- Auto-dismiss success alerts (4 seconds)
- Confirm dialogs before delete operations
