# 💰 SpendWise (Student Edition)

![SpendWise Banner](https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2626&ixlib=rb-4.0.3)

SpendWise is a smart, mobile-first personal finance tracker specifically designed for students. It helps you track expenses across bank accounts and wallets, manage subscriptions, set budgets, and stay on top of your financial goals without the clutter.

## ✨ Features

-   **💸 Expense Tracking**: Log daily expenses quickly with categories and notes.
-   **🏦 Multi-Account Support**: Track balances for Banks, Cash, and Wallets separately.
-   **🔄 Subscription Manager**: Never miss a renewal with automated email reminders 3 days before due dates.
-   **📊 Reports & Analytics**: Visual breakdown of your spending habits with interactive charts.
-   **🎯 Budgeting**: Set monthly budgets and get visual alerts when you're nearing limits.
-   **🤝 Loans & Debts**: Keep track of money you owe or are owed by friends.
-   **🔔 Smart Notifications**: Email alerts for upcoming bills using a background scheduler.
-   **📱 Mobile-First Design**: A fast, responsive UI that feels like a native app.
-   **🔐 Secure Authentication**: OTP-based passwordless login for ease of use.

## 🛠️ Tech Stack

**Frontend**
-   React 18 + Vite
-   Tailwind CSS (Styling)
-   Redux Toolkit (State Management)
-   Recharts (Data Visualization)
-   Lucide React (Icons)
-   Framer Motion (Animations)

**Backend**
-   Node.js & Express
-   MongoDB & Mongoose
-   JWT (Authentication)
-   Nodemailer (Email Service)
-   Node-Cron (Scheduled Tasks)

## 🚀 Getting Started

### Prerequisites
-   Node.js (v16+)
-   MongoDB Instance (Local or Atlas)
-   Gmail Account (for Email Notifications)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/spendwise.git
    cd spendwise
    ```

2.  **Install Dependencies** (Root, Client, and Server)
    ```bash
    npm run install-all
    ```

3.  **Environment Setup**
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    EMAIL_USER=your_gmail_address
    EMAIL_PASS=your_gmail_app_password
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```
    This will start both the backend server and the frontend development server concurrently.

## 📦 Deployment (Render)

This project is configured for easy deployment on [Render](https://render.com).

1.  Connect your GitHub repository to Render.
2.  Create a new **Web Service**.
3.  Set the **Build Command** to: `npm run render-postbuild`
4.  Set the **Start Command** to: `npm start`
5.  Add your **Environment Variables** in the Render dashboard.

## 🛡️ License

This project is licensed under the MIT License - see the LICENSE file for details.

---
*Built with ❤️ for students who want to be smart with their money.*
