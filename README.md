# SplitQuick - Frontend

A modern expense-splitting app that makes it easy to share costs with friends and groups. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Group Management** - Create groups, add/remove members, assign admin roles
- **Expense Tracking** - Add expenses with flexible split options (equal, percentage, custom amounts)
- **Smart Settlements** - Simplified settlement suggestions to minimize transactions
- **Balance Overview** - Per-user breakdowns showing who owes whom
- **Insights** - Spending by category (pie chart) and expense timeline (area chart)
- **Multi-Currency** - Supports 20 currencies including USD, EUR, GBP, LKR, INR, AUD, JPY, and more
- **Admin Controls** - Only admins can delete groups (requires all balances settled first)

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible component library (Radix UI primitives)
- **React Router** - Client-side routing
- **TanStack React Query** - Server state management and caching
- **Recharts** - Data visualization (pie charts, area charts)
- **Framer Motion** - Animations and transitions
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Setup

```sh
# Install dependencies
npm install

# Create a .env file (optional - defaults to localhost:3000)
echo VITE_API_BASE_URL=http://localhost:3000 > .env

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
  contexts/       # Auth context provider
  components/ui/  # shadcn/ui components
  lib/            # API client, utilities
  pages/          # Route pages (Dashboard, GroupDetail, Login, Register)
  types/          # TypeScript type definitions
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000` | Backend API base URL |

## Backend

This frontend connects to the [SplitQuick Backend API](../expense-app-backend). Make sure the backend is running before starting the frontend.
