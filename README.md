## 💳 Village SACCO – USDT Virtual Card & Global Transfer Platform

### Built for the Bitnob & Tether Hackathon 2025

> A full-stack USDT financial inclusion platform built for rural SACCOs (Savings & Credit Cooperative Organizations) to empower users with **virtual cards**, **Bitcoin savings**, and **cross-border transfers**, all powered by **Bitnob APIs**.

---

## Tech Stack

- **Next.js 15** (React 19) – Frontend & API Routes
- **TailwindCSS** – Styling
- **TypeScript** – Type Safety
- **Prisma + PostgreSQL** – Database ORM
- **Bitnob Sandbox API** – USDT Virtual Cards, Transfers, Bitcoin Savings
- **Vercel** – Deployment

---

##  Features

✅ User Registration + Login (with approval logic)  
✅ Create & Manage Virtual USDT Cards  
✅ Top-up Cards & View Transactions  
✅ Freeze/Unfreeze & Terminate Cards  
✅ Global USDT Transfers  
✅ View Card User & Card Details  
✅ Admin Approval Flow  
✅ Modular API Integration via Bitnob

---

## 🧪 Demo & Live URL

⚠️ Use the sandbox credentials below to test APIs.

---

## 🔐 Environment Setup

Create a `.env.local` file and configure:

env
DATABASE_URL=your_postgres_url
BITNOB_CLIENT_ID=your_bitnob_client_id
BITNOB_SECRET_KEY=your_bitnob_secret
BITNOB_BASE_URL=https://sandboxapi.bitnob.co
Installation & Development
bash
Copy
Edit
git clone https://github.com/your-username/village-sacco.git
cd village-sacco
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev

# User Workflow
### 1. Register as a new user
Fill in name, email, password

Admin must approve the user to access card/transfer features

### 2. Create Virtual Card
Registers a card user in Bitnob

Creates a virtual card with POST /api/v1/virtual-cards/create

### 3. Top-Up Card
Funds the card using POST /api/v1/virtual-cards/topup

### 4. View Card Transactions
Uses GET /api/v1/virtual-cards/cards/{cardId}/transactions

### 5. Transfer USDT Globally
Initiate with POST /api/v1/transfers

Confirm with POST /api/v1/transfers/finalize

# API Routes (App-Powered)
🔐 Auth
POST /api/auth/register → Create account

POST /api/auth/login → Authenticate

GET /api/auth/status → Session check

# 💳 Virtual Cards
POST /api/bitnob/register-card-user

POST /api/bitnob/create-card

POST /api/bitnob/topup-card

GET /api/bitnob/card-details

POST /api/bitnob/freeze-card

POST /api/bitnob/unfreeze-card

POST /api/bitnob/terminate-card

#  Transfers
POST /api/bitnob/initiate-transfer

POST /api/bitnob/finalize-transfer

# Judge Credentials (Testing)
You may use the following test sandbox users to simulate:

Email: judge@example.com

Password: SecurePass123

Admin approval is required, and can be done via direct DB or request to team.

# 🛠 Dev Notes
Code is modular with clear error handling (see pages/api/bitnob/*.ts)

Secure storage of secrets via .env.local

All Bitnob interactions are routed through a single helper class

Prisma schema can be found in /prisma/schema.prisma
