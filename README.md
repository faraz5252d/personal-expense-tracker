# Personal Expense Management System 💰📊

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React%2019-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%206-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styles-Tailwind%20v4-38bdf8.svg)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.3-6db33f.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-4479a1.svg)](https://www.mysql.com/)
[![Vercel](https://img.shields.io/badge/Frontend%20Deploy-Vercel-black.svg)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend%20Deploy-Render-46e3b7.svg)](https://render.com)

A full-stack, responsive Personal Expense Management System powered by Spring Boot, MySQL, and React to help users track cash flows, set monthly budgets, categorize transactions, and make smarter financial decisions.

---

## 📖 Abstract

The **Personal Expense Management System** is a full-stack web application designed to help users manage their income and expenses efficiently. Users can add, edit, and delete transactions, categorize expenses, set budgets, and view their spending history. The system uses a frontend for user interaction, a backend to process data and business logic, and a database to securely store financial records. It helps users track their spending, control budgets, and make better financial decisions.

---

## 🌟 Key Features

### 1. 💼 Dashboard & KPIs
- **Real-Time Financial Metrics**: View Net Balance, Total Income, Total Expenses, Savings Rate %, and Financial Health Score (0–100).
- **Interactive Visualizations**:
  - Monthly cashflow trend comparison (Income vs Expense over 6 months).
  - Expense allocation donut chart with percentage breakdown.
- **Recent Transactions Feed**: Quick table of latest entries with instant edit and delete actions.

### 2. 💳 Transaction Management
- **Full CRUD Support**: Add, edit, and remove income and expense entries with live validation.
- **Multi-Filter & Search**: Search by keywords/notes, filter by Category, Type (Income/Expense), and Payment Method (Credit Card, Debit Card, UPI, Bank Transfer, Cash).
- **Sorting**: Order by newest, oldest, highest amount, or lowest amount.
- **Export Data**: Instant 1-click CSV file export of all transaction records.

### 3. 🎯 Budgets & Threshold Alerts
- **Monthly Category Budgets**: Set spending limits per expense category for any target month.
- **Visual Progress Gauges**: Real-time progress bars color-coded by risk level:
  - 🟢 **Safe**: < 75% utilized
  - 🟡 **Warning**: 75% - 99% utilized
  - 🔴 **Exceeded**: ≥ 100% utilized
- **Automated Alerts**: Highlight categories approaching or surpassing threshold caps.

### 4. 🏷️ Category Management
- **Pre-loaded Smart Categories**: Housing, Groceries, Dining, Transport, Utilities, Entertainment, Health, Shopping, Education, Salary, Freelance, Investments.
- **Custom Categories**: Create custom categories with custom icons and color palettes.

### 5. 📈 Analytics & Financial Insights
- **Trajectory Charts**: Net cash flow trends across months.
- **Payment Method Distribution**: Analyze spending habits across payment channels.
- **Actionable Financial Recommendations**: Dynamic advice tailored to your savings rate.

### 6. 🌐 Settings & Customization
- **Currency Switcher**: Instant switching between `$ (USD)`, `€ (EUR)`, `£ (GBP)`, and `₹ (INR)`.
- **Demo Data Reset**: 1-click button to re-seed realistic sample transactions.
- **Backend Health Monitor**: Live connection status badge in header.

---

## 🏗️ Architecture & Tech Stack

```text
personal-expense-tracker/
├── backend/
│   ├── controllers/         # Business logic (transactions, categories, budgets, analytics)
│   ├── routes/              # Express API endpoint definitions
│   ├── data/                # Resilient JSON persistent database store with auto-seeding
│   ├── server.js            # Express server entry point & CORS configuration
│   ├── render.yaml          # Render web service deployment blueprint
│   ├── Dockerfile           # Production container definition
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Navbar, Sidebar, Charts, Modals, Lists)
│   │   ├── context/         # React Context for currency, state, and notifications
│   │   ├── services/        # Centralized Fetch API client with health checks
│   │   ├── utils/           # Formatters, SVG category icons
│   │   ├── App.jsx          # Master dashboard layout & tab routing
│   │   ├── main.jsx         # React application bootstrap
│   │   └── index.css        # Tailwind CSS styles and glassmorphism utilities
│   ├── public/              # Static assets
│   ├── vercel.json          # Vercel SPA routing rewrite config
│   ├── vite.config.js       # Vite configuration
│   └── package.json
├── render.yaml              # Root Blueprint for Render deployment
├── README.md                # Project documentation
└── package.json
```

---

## 🚀 Running Locally

### Prerequisites
- Java 21 or higher
- Maven 3.8+ (or use the included `./mvnw`)
- MySQL 8.0 running locally
- Node.js (v18 or higher) & npm

### 1. Clone the Repository
```bash
git clone https://github.com/faraz5252d/personal-expense-tracker.git
cd personal-expense-tracker
```

### 2. Start Backend Server (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
*Backend runs on: `http://localhost:5000`*
*(Legacy Node.js backend is archived under `backend-node/`)*

### 3. Start Frontend App (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/transactions` | List all transactions (supports `?search`, `?type`, `?categoryId`, `?paymentMethod`) |
| `POST` | `/api/transactions` | Create a new transaction |
| `PUT` | `/api/transactions/:id` | Update an existing transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |
| `GET` | `/api/categories` | List all categories with transaction stats |
| `POST` | `/api/categories` | Create a custom category |
| `DELETE` | `/api/categories/:id` | Delete a custom category |
| `GET` | `/api/budgets?month=YYYY-MM` | Get monthly budget limits & utilization |
| `POST` | `/api/budgets` | Set or update a category budget |
| `DELETE` | `/api/budgets/:id` | Remove a budget |
| `GET` | `/api/analytics/overview` | KPI summary, savings rate, health score |
| `GET` | `/api/analytics/monthly-trend` | 6-month cashflow history |
| `GET` | `/api/analytics/category-breakdown` | Category spending shares |
| `GET` | `/api/analytics/payment-methods` | Payment channel distribution |
| `GET` | `/api/analytics/export-csv` | Download transactions as CSV |
| `POST` | `/api/reset` | Reset database to initial seed dataset |

---

## 🌐 Automatic Deployment Guide

### Deploying the Backend on Render (Free)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + > Web Service**.
2. Connect your GitHub repository `faraz5252d/personal-expense-tracker`.
3. Configure the settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Click **Create Web Service**.
5. Once deployed, copy your Render service URL (e.g., `https://personal-expense-backend.onrender.com`).

---

### Deploying the Frontend on Vercel (Free)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
2. Select your repository `faraz5252d/personal-expense-tracker`.
3. In **Project Settings**:
   - **Root Directory**: Click edit and select `frontend`.
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://your-backend-service.onrender.com/api`
5. Click **Deploy**. Vercel will automatically build and publish your frontend with live continuous deployment!

---

## 👤 Author
- GitHub: [@faraz5252d](https://github.com/faraz5252d)
- Project: **Personal Expense Management System**
