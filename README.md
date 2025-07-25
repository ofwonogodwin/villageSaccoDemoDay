# Village SACCO - Fintech App

A comprehensive fintech SACCO application built with Next.js 15, TypeScript, and Bitnob API integration. This app provides virtual card creation, Bitcoin savings, money transfers, and currency swap functionality.

## 🚀 Features

- **Virtual Dollar Cards**: Create virtual cards instantly for secure online transactions
- **Bitcoin Savings**: Automated recurring Bitcoin purchases with dollar-cost averaging
- **Instant Transfers**: Send money to email addresses or Bitcoin wallets
- **Currency Swap**: Exchange between USD, BTC, EUR, GBP, and NGN
- **Modern UI**: Beautiful jade green theme with responsive design
- **Secure API**: HMAC-SHA512 signed requests to Bitnob sandbox APIs

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS v4
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **API Integration**: Bitnob sandbox APIs
- **Authentication**: JWT-based (NextAuth.js ready)
- **Styling**: Custom jade green theme (#00BB77)

## 📦 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Bitnob sandbox credentials:
```env
BITNOB_CLIENT_ID=your_sandbox_client_id
BITNOB_SECRET_KEY=your_sandbox_secret_key
BITNOB_BASE_URL=https://sandboxapi.bitnob.co/api/v1
DATABASE_URL=postgresql://user:password@localhost:5432/villagesacco
JWT_SECRET=your_super_secret_jwt
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/bitnob/          # API routes for Bitnob integration
│   ├── dashboard/           # Dashboard pages
│   ├── globals.css          # Global styles with jade theme
│   └── page.tsx            # Landing page
├── lib/
│   ├── bitnob.ts           # Bitnob API client
│   └── prisma.ts           # Prisma client configuration
└── generated/
    └── prisma/             # Generated Prisma client
```

## 🔑 API Routes

- `POST /api/bitnob/create-card` - Create virtual cards
- `POST /api/bitnob/savings-plan` - Create Bitcoin savings plans
- `POST /api/bitnob/send-money` - Send money transfers
- `POST /api/bitnob/swap-currency` - Currency exchange

## 🎨 Styling

The app uses a custom jade green theme (#00BB77) with TailwindCSS v4. Custom utility classes include:
- `.btn-primary` - Primary button styling
- `.card` - Card component styling
- `.form-input` - Form input styling

## 🔐 Security

- All API requests are signed with HMAC-SHA512
- Input validation on both client and server
- Sandbox-only environment for safe testing
- No sensitive data in client-side code

## 🧪 Testing

This app is configured for Bitnob sandbox testing only. All API calls are made to the sandbox environment for safe development and testing.

## 🚀 Deployment

Ready for deployment to Vercel, Netlify, or any Node.js hosting platform. Remember to:
- Set production environment variables
- Update API endpoints for production use
- Configure production database

## 📝 License

This project is for educational purposes as part of the Bitnob bootcamp.

## 🤝 Contributing

Feel free to submit issues and pull requests to improve the application.
