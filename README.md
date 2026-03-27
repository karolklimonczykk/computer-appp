![Frontend](https://img.shields.io/badge/frontend-React%2019%20%2B%20Next.js-black)
![Backend](https://img.shields.io/badge/backend-Node.js-green)
![Framework](https://img.shields.io/badge/framework-Next.js%2016-black)
![ORM](https://img.shields.io/badge/orm-Prisma-blue)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)
![Auth](https://img.shields.io/badge/auth-Auth.js%20(GitHub)-purple)

# 💻 Computer Shop

> Full-stack e-commerce application built with Next.js App Router, Prisma, PostgreSQL, and GitHub authentication.

computer-app is a full-stack web application focused on product browsing, cart management, and modern routing patterns in Next.js.
The project combines Server Components, Client Components, Prisma data layer, and Auth.js-based authentication.

In addition to standard shop features, the app demonstrates advanced routing techniques:
- dynamic routes,
- catch-all routes,
- parallel routes,
- intercepted modal routes.

## 🎬 Live Demo

- Vercel: https://computer-appp.vercel.app/

## ✨ Main Features

### Product catalog and filtering
- Product list loaded from JSON source (seed source)
- Sorting: alphabetical / newest
- Availability filter: in-stock only
- Category navigation with slug generation

### Product details and route variants
- Dynamic product page by ID
- Category listing by slug
- Catch-all route support for nested category/product paths
- Product image opened in modal via intercepted route

### Promotions and layout composition
- Dedicated product-list layout with promotions section
- Randomly selected discounted products (visual promo cards)

### Authentication and user context
- Login/logout with Auth.js
- OAuth provider: GitHub
- Session-based user context in server-rendered pages

### Cart and server actions
- User-specific cart preview
- Cart total calculation on the server
- Cart item listing with category context
- Cart transfer between users (server action)

### Database and persistence
- PostgreSQL with Prisma ORM
- Relational schema for users, carts, orders, products, categories
- Seed script for categories, products, cart data, and sample orders

## 🖥️ Tech Stack

### 🎨 Frontend
- React 19
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4

### 🔙 Backend / Full-stack layer
- Node.js runtime
- Next.js server rendering + server actions
- Auth.js (next-auth v5 beta)

### 🗄️ Database
- PostgreSQL
- Prisma ORM
- Prisma Adapter for `pg`

### ⚙️ DevOps / Tools / Environments used
- Docker + Docker Compose (PostgreSQL)
- Prisma Migrate + Prisma Seed
- Visual Studio Code

## 🏗️ Architecture Overview

The system follows a full-stack Next.js architecture:
- App Router handles UI, navigation, and route composition
- Server Components fetch and render data on the server
- Client Components handle interactive filtering and modal behavior
- Prisma handles data access and mapping to PostgreSQL
- Auth.js integrates GitHub OAuth and session handling

### Core domain entities
- `User`, `Account`, `Session`, `VerificationToken` (Auth.js)
- `Category`, `Product`
- `Cart`, `CartItem`
- `Order`, `OrderItem`

## 🚀 Getting Started (Step by Step)

### 1. Clone repository
```bash
git clone https://github.com/karolklimonczykk/computer-appp.git
cd computer-appp
```

### 2. Install dependencies
```bash
npm ci
```

### 3. Start PostgreSQL (Docker)
```bash
docker compose up -d
```

### 4. Configure environment variables
Create `.env` file in the project root:

```env
# Prisma / PostgreSQL
DATABASE_URL="postgresql://postgres:prisma@localhost:5432/postgres"
DATABASE_URL_UNPOOLED="postgresql://postgres:prisma@localhost:5432/postgres"

# Auth.js
AUTH_SECRET="your_strong_auth_secret"

# GitHub OAuth (recommended variable names)
AUTH_GITHUB_ID="your_github_oauth_client_id"
AUTH_GITHUB_SECRET="your_github_oauth_client_secret"

# Optional fallback names supported in code
CLIENT_ID="your_github_oauth_client_id"
CLIENT_SECRET="your_github_oauth_client_secret"
NEXTAUTH_SECRET="your_strong_auth_secret"
```

### 5. Run database migrations
```bash
npx prisma migrate dev
```

### 6. (Optional) Seed sample data
```bash
npx prisma db seed
```

### 7. Run development server
```bash
npm run dev
```

App default URL: `http://localhost:3000`

## 📁 Project Structure

```text
computer-appp/
├─ app/
│  ├─ api/
│  │  └─ auth/
│  │     └─ [...nextauth]/
│  ├─ basket/
│  ├─ order-history/
│  ├─ product-list/
│  │  ├─ [...slug]/
│  │  ├─ [product-id]/
│  │  │  ├─ @modal/(.)image/[image-id]/
│  │  │  └─ image/[image-id]/
│  │  ├─ @discounts/
│  │  └─ @products/
│  └─ about/
├─ components/
├─ data/
│  └─ products.json
├─ lib/
│  ├─ actions/
│  ├─ auth.ts
│  ├─ prisma.ts
│  └─ products.ts
├─ prisma/
│  ├─ data/
│  ├─ migrations/
│  ├─ schema.prisma
│  └─ seed.ts
└─ docker-compose.yml
```

## 🧭 Routes Overview

### Main pages
- `/` - homepage
- `/product-list` - product catalog
- `/product-list/[product-id]` - product details
- `/product-list/[...slug]` - catch-all product/category route
- `/basket` - authenticated cart view and transfer panel
- `/order-history` - order history section
- `/about` - about page

### API / authentication
- `/api/auth/*` - Auth.js endpoints

## 🔐 Security and Data Access

- Authentication handled through Auth.js with GitHub OAuth
- Session is resolved server-side for protected cart context
- Cart operations are tied to authenticated user IDs
- Prisma relations enforce structured ownership of cart/order records

## 🧪 Useful Commands

```bash
npm run dev          # start development server
npm run build        # production build
npm run start        # run production build
npm run lint         # run ESLint
npx prisma studio    # open Prisma Studio
```

## 🎯 What This Project Demonstrates

- Full-stack development with Next.js App Router
- Integration of PostgreSQL and Prisma in a modern React stack
- Auth.js OAuth flow in server-rendered application
- Advanced routing patterns in Next.js
- Server actions for transactional cart operations

## 👤 Author

**Karol Klimończyk**
- GitHub: https://github.com/karolklimonczykk
