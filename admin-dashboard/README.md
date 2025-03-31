# E-commerce Admin Dashboard

A modern admin dashboard for managing an e-commerce platform. Built with Next.js, Ant Design, MongoDB and Prisma.

## Features

- User management
- Product management
- Sales statistics
- Settings management
- Authentication with NextAuth

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- MongoDB database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Rename `.env` file and update with your MongoDB connection string
   - Update NextAuth secret

```bash
DATABASE_URL="mongodb+srv://your-mongodb-connection-string"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
admin-dashboard/
├── app/                   # Next.js app directory
│   ├── auth/              # Authentication routes
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── dashboard/         # Dashboard routes
│   │   ├── users/         # User management
│   │   ├── products/      # Product management
│   │   └── settings/      # Settings page
│   ├── api/               # API routes
├── lib/                   # Utility functions and shared code
├── prisma/                # Prisma ORM configuration
├── public/                # Static assets
```

## Technologies

- Next.js - React framework
- Ant Design - UI components library
- Prisma - ORM for database operations
- MongoDB - Database
- NextAuth - Authentication framework
- Lucide React - Icons library
