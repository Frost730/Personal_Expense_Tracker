# Personal Expense Tracker

A modern, production-quality, 100% frontend-only personal finance dashboard built with **React**, **Vite**, **Tailwind CSS**, and **Recharts**.

Persists all user data strictly inside the browser using `localStorage`. No accounts, no servers, no third-party APIs, and zero data leaves the client machine.

---

## 🚀 Features

- **📊 Comprehensive Dashboard**
  - Live Net Balance, Total Income, Total Expenses, and Monthly Spending.
  - Net Savings amount & Savings Rate calculation (with safe zero-division handling).
  - Monthly spending timeline (smooth interactive Area Chart).
  - 6-Month Income vs. Expense comparative bar chart.
  - Expense-by-category breakdown donut chart with colored legend.
  - Quick category budget progress indicators with health status.
  - Recent transactions list with type indicators and category badges.
  - Month & Year selector with quick "Today" reset.

- **💳 Complete Transaction Management**
  - Add, edit, and delete transactions.
  - Tracks ID, Type (Income/Expense), Amount, Category, Description, Date, Payment Method (Cash, Credit Card, Debit Card, UPI / Bank Transfer, Other), and Notes.
  - Live search across descriptions, categories, and notes.
  - Multi-filtering by Type, Category, Payment Method, Date Range, and Min/Max Amount.
  - Dual sorting (Date & Amount, ascending / descending).
  - Responsive table on desktop and touch-friendly cards on mobile.
  - Configurable pagination (10, 25, 50 rows per page).

- **🎯 Monthly Budgets & Visual Thresholds**
  - Set monthly spending targets for individual expense categories.
  - Real-time progress bars with three dynamic health levels:
    - 🟢 **Normal**: < 80% used
    - 🟡 **Near Limit**: 80% – 100% used
    - 🔴 **Over Budget**: > 100% used
  - Overall monthly budget utilization vs total spending.

- **📈 Advanced Financial Analytics**
  - Monthly cashflow analysis (Income, Expenses, Net Savings) over 6 or 12 months.
  - Average Daily Spending and Average Monthly Spending KPIs.
  - Highest spending categories leaderboard ranked by expenditure and percentage.
  - All-time aggregate spending distribution pie chart.

- **📱 Progressive Web App (PWA) & Offline Capabilities**
  - **100% Offline Functional**: Background Service Worker precaches all HTML, scripts, stylesheets, and chart libraries.
  - **Installable**: 1-click install button in Sidebar and Settings to install as a native desktop or mobile home screen app.
  - **GitHub Pages Ready**: Fully relative scope (`scope: './'`) and relative manifest URLs so the PWA installs seamlessly from repository subpaths.
  - **High-Res App Icons**: Multi-size icons (192x192, 512x512, maskable, apple-touch-icon, and SVG).

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Build Tool**: [Vite 8](https://vite.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: `HashRouter` from [React Router v7](https://reactrouter.com/) (guarantees zero 404 errors on GitHub Pages)
- **State & Storage**: Custom `FinanceContext` + resilient `storageService` abstraction

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 18+ installed

### 1. Installation
```bash
npm install
```

### 2. Development Server
Start the hot-reloading development server:
```bash
npm run dev
```
Open your browser at the local URL displayed (e.g. `http://localhost:5173`).

### 3. Production Build
Compile TypeScript and bundle optimized static assets:
```bash
npm run build
```
Assets are emitted into the `dist/` directory with relative paths (`./assets/...`).

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🌐 GitHub Pages Deployment Guide

This repository is pre-configured specifically for **GitHub Pages**:
- `base: './'` in `vite.config.ts` ensures all asset paths resolve properly regardless of whether your repository is deployed to a custom domain or a repository subpath (e.g. `https://<username>.github.io/<repo-name>/`).
- `HashRouter` is used so that direct page refreshes or bookmarks never encounter 404 Not Found errors on static hosts.

### Method 1: Automatic Deployment with GitHub Actions (Recommended)

1. Push this project to your GitHub repository.
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Create a file at `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build static site
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. Push the commit. GitHub Actions will build and deploy the application automatically.

### Method 2: Manual Deployment via `gh-pages` Branch

1. Install the `gh-pages` package:
   ```bash
   npm install -D gh-pages
   ```
2. Add deploy scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run:
   ```bash
   npm run deploy
   ```
4. On GitHub, go to **Settings** > **Pages** and select the `gh-pages` branch.

---

## 🔒 Data Safety & Privacy

- **100% Client-Side**: All data is stored in the browser's `localStorage` API under the following structured keys:
  - `expenseTracker_transactions`
  - `expenseTracker_budgets`
  - `expenseTracker_categories`
  - `expenseTracker_settings`
- **Zero Telemetry**: No third-party analytics, tracking pixels, or remote database connections are included.
- **Export & Import**: You can download full JSON backups at any time from the Settings page.

---

## 📄 License

MIT License. Free for personal and commercial use.
