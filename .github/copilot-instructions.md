<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Village SACCO - Fintech App Development Instructions

## Project Overview
This is a comprehensive fintech SACCO application built with Next.js 15, TypeScript, TailwindCSS, PostgreSQL, and Prisma ORM. The app integrates with Bitnob sandbox APIs to provide:

- Virtual dollar card creation
- Bitcoin savings plans
- Money transfers (P2P and to Bitcoin addresses)
- Currency swap functionality

## Technology Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, TailwindCSS v4
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **API Integration**: Bitnob sandbox APIs with HMAC-SHA512 authentication
- **Styling**: Custom jade green theme (#00BB77)

## Key Components

### Bitnob API Integration (`src/lib/bitnob.ts`)
- Uses HMAC-SHA512 signing for authentication
- Implements all 4 main features: virtual cards, Bitcoin savings, transfers, currency swap
- Comprehensive error handling and logging
- Environment-based configuration

### Database Schema (`prisma/schema.prisma`)
- User model with authentication fields
- Transaction tracking
- Savings plans management
- Virtual cards management

### API Routes (`src/app/api/bitnob/`)
- `/api/bitnob/create-card` - Virtual card creation
- `/api/bitnob/savings-plan` - Bitcoin savings plan setup
- `/api/bitnob/send-money` - Money transfers
- `/api/bitnob/swap-currency` - Currency exchange

### Frontend Pages (`src/app/dashboard/`)
- Dashboard overview with quick stats
- Virtual cards management
- Bitcoin savings interface
- Transfer/send money functionality
- Currency swap with live rates

## Development Guidelines

### Styling
- Use the custom jade green theme (#00BB77) as primary color
- Leverage TailwindCSS v4 with inline theme configuration
- Follow the established design system with card components
- Ensure responsive design across all devices

### API Integration
- Always use try/catch blocks for Bitnob API calls
- Log all requests and responses for debugging
- Implement proper error handling and user feedback
- Validate all inputs before sending to APIs

### Security
- Never commit real API keys (use sandbox only)
- Validate all user inputs
- Use proper TypeScript types for all data
- Implement rate limiting where appropriate

### Code Quality
- Follow TypeScript best practices
- Use proper error boundaries
- Implement loading states for all async operations
- Write descriptive comments for complex logic

## Environment Variables Required
```
BITNOB_CLIENT_ID=sandbox_client_id
BITNOB_SECRET_KEY=sandbox_secret_key
BITNOB_BASE_URL=https://sandboxapi.bitnob.co/api/v1
DATABASE_URL=postgresql://...
JWT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

## Testing
- Test all Bitnob integrations in sandbox mode only
- Verify form validations work correctly
- Test responsive design on multiple screen sizes
- Ensure error states display properly

## Deployment Notes
- This app is designed for sandbox testing only
- Replace sandbox credentials with production ones when ready
- Ensure all environment variables are properly configured
- Use proper database migrations in production
