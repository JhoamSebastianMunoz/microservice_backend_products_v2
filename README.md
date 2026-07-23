# Microservice Backend Products

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/JhoamSebastianMunoz/microservice_backend_products_v2.git)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)

A robust, scalable RESTful API microservice for product management in e-commerce platforms. Built with **Express**, **TypeScript**, and **Supabase (PostgreSQL)**, featuring JWT authentication, role-based authorization, Supabase Storage for images, and interactive API documentation with Scalar.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [API Endpoints (v2)](#api-endpoints-v2)
- [Authentication & Authorization](#authentication--authorization)
- [Database & Storage](#database--storage)
- [Caching & Rate Limiting](#caching--rate-limiting)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

**Microservice Backend Products v2** is a production-ready API for managing products, categories, images, stock inventory, and reports. It follows **SOLID principles** with a clean **Repository-Service-Controller** architecture, uses **Supabase** as the backend platform (PostgreSQL database + Storage + Auth), and is deployed on **Vercel Serverless Functions**.

### Key Features

- ✅ **RESTful API v2** with proper HTTP methods and resource-based URLs
- ✅ **JWT Authentication** with Bearer tokens
- ✅ **Role-Based Access Control** (ADMINISTRADOR role for write operations)
- ✅ **Supabase Storage** for product image uploads
- ✅ **Interactive API Documentation** with Scalar at `/api-docs`
- ✅ **Smart Caching** (5-min TTL) with automatic invalidation on writes
- ✅ **Rate Limiting** (100 requests/minute per user)
- ✅ **Comprehensive Validation** with express-validator
- ✅ **Standardized Error Responses** with Supabase error code mapping
- ✅ **Vercel Serverless** deployment ready
- ✅ **Full Test Coverage** with Jest + Supertest

---

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Runtime** | Node.js 20+, TypeScript 5.2 |
| **Framework** | Express.js 4.18 |
| **Database** | Supabase (PostgreSQL) via `pg` and `@supabase/supabase-js` |
| **Storage** | Supabase Storage |
| **Authentication** | JWT (`jsonwebtoken`), bcryptjs |
| **Validation** | express-validator 7.0 |
| **API Docs** | Scalar (`@scalar/express-api-reference`), OpenAPI 3.0 (YAML) |
| **Security** | Helmet, CORS, Morgan (logging) |
| **File Upload** | Multer |
| **Testing** | Jest 29, Supertest, ts-jest |
| **Code Quality** | ESLint, TypeScript ESLint |
| **Deployment** | Vercel Serverless Functions |
| **Utilities** | UUID, dotenv, yamljs, axios |

---

## Architecture

The project follows **Clean Architecture** with **SOLID principles**:

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│  Routes → Controllers → Middleware (Auth/Validation)        │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                           │
│  ProductService → ProductImageService → CategoriaService     │
│  StockService → ReportService → ImageService                │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                   Repository Layer                           │
│  ProductRepository → CategoriaRepository → StockRepository  │
│  ProductImageRepository → ReportsRepository                 │
│                    (Supabase Client)                        │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Platform                          │
│  PostgreSQL Database + Storage + Auth                        │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns

- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation
- **DTOs (Data Transfer Objects)**: Type-safe request/response contracts
- **Middleware Pipeline**: Authentication, validation, error handling
- **Dependency Inversion**: Services depend on repository interfaces

---

## Project Structure

```
microservice_backend_products/
├── api/
│   └── index.ts                 # Vercel serverless entry point
├── config/
│   └── config-supabaseStorage.ts # Supabase client configuration
├── controllers/
│   ├── productController/       # Product CRUD controllers
│   ├── categoryController/      # Category CRUD controllers
│   ├── imageController/         # Image upload/delete controllers
│   ├── InventoryController/     # Stock management controllers
│   └── microservicePresaleController/
├── Dto/
│   ├── productDto/              # Product DTOs (Create, Update, Get, Delete)
│   └── imageDto/                # Image DTOs
├── Helpers/
│   ├── generateToken.ts         # JWT token generation
│   ├── generateHash.ts          # Password hashing
│   └── ImageUploadHelper.ts     # Image upload utilities
├── middleware/
│   ├── verifyToken.ts           # JWT verification
│   ├── checkRoleAndPermission.ts # Role-based authorization
│   ├── validationMiddleware.ts  # Validation error handling
│   ├── productValidators.ts     # Product validation rules
│   ├── productMiddleware/       # Product-specific validators
│   ├── imageMiddleware/         # Image-specific validators
│   ├── categoryMiddleware/      # Category validators
│   ├── cacheMiddleware.ts       # Response caching
│   └── errorHandler.ts          # Global error handling
├── repositories/
│   ├── ProductRepository.ts     # Product data access
│   ├── CategoriaRepository.ts   # Category data access
│   ├── ProductImageRepository.ts # Product image data access
│   ├── StockRepository.ts       # Stock data access
│   ├── ReportsRepository.ts     # Reports data access
│   ├── MicroservicePresaleRepository.ts
│   └── SupabaseImageRepository.ts # Supabase Storage operations
├── routes/
│   └── v2/                      # API v2 routes
│       ├── products.ts
│       ├── categories.ts
│       ├── images.ts
│       ├── stock.ts
│       └── reports.ts
├── services/
│   ├── ProductService.ts        # Product business logic
│   ├── ProductImageService.ts   # Product image business logic
│   ├── CategoriaService.ts      # Category business logic
│   ├── StockService.ts          # Stock business logic
│   ├── ReportsService.ts        # Reports business logic
│   ├── ImageService.ts          # Image business logic
│   ├── optimizedProductService.ts
│   ├── productStrategies.ts
│   └── MicroservicePresaleService.ts
├── dist/                        # Compiled JavaScript output
├── docs/
│   └── API_DOCUMENTATION.md     # Detailed API documentation
├── app.ts                       # Express app configuration
├── swagger.yaml                 # OpenAPI 3.0 specification
├── swagger-v2.yaml              # Alternative OpenAPI spec
├── vercel.json                  # Vercel deployment config
├── tsconfig.json                # TypeScript configuration
├── package.json
├── .env.example                 # Environment variables template
└── README.md
```

---

## Prerequisites

- **Node.js** 20 or higher
- **npm** or **yarn**
- **Supabase Account** (for PostgreSQL database and Storage)
- **Git**
- **Vercel CLI** (optional, for deployment)

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Server Configuration
PORT=10102
NODE_ENV=development

# Supabase Configuration (Required)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_STORAGE_BUCKET=your_storage_bucket_name

# Supabase PostgreSQL Connection (Alternative to individual params)
DATABASE_URL=postgresql://user:password@host:port/database

# Or individual PostgreSQL parameters:
DB_HOST=your_db_host
DB_PORT=5432
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_SSL=true

# JWT Configuration (Optional - currently using Supabase Auth)
# JWT_SECRET=your_jwt_secret
# JWT_EXPIRES_IN=7d
```

### Required Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations | ✅ Yes |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name for images | ✅ Yes |
| `PORT` | Server port (default: 10102) | ❌ No |
| `NODE_ENV` | Environment (development/production) | ❌ No |

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/JhoamSebastianMunoz/microservice_backend_products_v2.git
cd microservice_backend_products
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 4. Set Up Supabase Database

Run the SQL schema in your Supabase SQL Editor:

```bash
# The schema is in microservice_product.sql
# Execute it in Supabase Dashboard → SQL Editor
```

### 5. Compile TypeScript

```bash
npm run build
```

### 6. Start Development Server

```bash
npm run dev
```

Server will be available at: `http://localhost:10102`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload (ts-node-dev) |
| `npm run build` | Compile TypeScript to JavaScript (`dist/`) |
| `npm start` | Run production server from compiled `dist/` |
| `npm test` | Run all tests with Jest |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint on source files |
| `npm run lint:fix` | Run ESLint with auto-fix |

---

## API Documentation

### Interactive Documentation (Scalar)

Access the beautiful, interactive API documentation at:

- **Local**: `http://localhost:10102/api-docs`
- **Production**: `https://microservice-backend-products-v2.vercel.app/api-docs`

### OpenAPI Specification

- **YAML**: `GET /swagger.yaml`
- **JSON**: `GET /api-docs-json`

---

## API Endpoints (v2)

All endpoints are prefixed with `/api/v2`.

### Public Endpoints (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | List products with pagination, filters, sorting |
| `GET` | `/products/:id` | Get single product with images |
| `GET` | `/categories` | List all categories |
| `GET` | `/categories/:id` | Get single category |
| `GET` | `/images/:id` | Get image information |
| `GET` | `/stock/:productId` | Get stock for a product |
| `GET` | `/stock/history` | Get stock movement history |

### Protected Endpoints (Require ADMINISTRADOR Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/products` | Create product (multipart/form-data with images) |
| `PUT` | `/products/:id` | Update product (multipart/form-data) |
| `DELETE` | `/products/:id` | Delete product |
| `POST` | `/categories` | Create category |
| `PUT` | `/categories/:id` | Update category |
| `DELETE` | `/categories/:id` | Delete category |
| `POST` | `/images/upload` | Upload image to Supabase Storage |
| `DELETE` | `/images/:id` | Delete image |
| `POST` | `/stock/:productId` | Register stock entry (auto-calculates price) |
| `GET` | `/reports/low-stock` | Get low stock report (threshold query param) |

### Query Parameters (Products)

```
GET /api/v2/products?page=1&limit=20&id_categoria=1&precio_min=10&precio_max=100&nombre=laptop&sort=precio&order=DESC
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 (max 100) | Results per page |
| `id_categoria` | number | - | Filter by category ID |
| `precio_min` | number | - | Minimum price |
| `precio_max` | number | - | Maximum price |
| `nombre` | string | - | Partial name search |
| `sort` | string | nombre_producto | Sort field |
| `order` | string | ASC | ASC or DESC |

---

## Authentication & Authorization

### JWT Bearer Token

Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access

- **Public**: All `GET` endpoints (read-only)
- **ADMINISTRADOR**: Required for all `POST`, `PUT`, `DELETE` operations

The middleware chain:
1. `verifyToken` - Validates JWT signature and expiration
2. `checkRoleAndPermission(["ADMINISTRADOR"])` - Verifies admin role

---

## Database & Storage

### Supabase PostgreSQL

- **Tables**: `productos`, `categorias`, `producto_imagenes`, `stock`, `ingresos_stock`
- **Relationships**: Foreign keys with cascade deletes
- **Client**: Official `@supabase/supabase-js` v2

### Supabase Storage

- **Bucket**: Configured via `SUPABASE_STORAGE_BUCKET`
- **Structure**: `productos/{product_id}/{filename}`
- **Features**: Public URLs, automatic cleanup on product/image deletion

### Key Repositories

- `ProductRepository` - Product CRUD with category joins
- `CategoriaRepository` - Category management
- `ProductImageRepository` - Image metadata management
- `StockRepository` - Stock entries and history
- `ReportsRepository` - Low stock reports
- `SupabaseImageRepository` - Direct Storage operations

---

## Caching & Rate Limiting

### Response Caching

- **TTL**: 5 minutes (configurable)
- **Scope**: All `GET` endpoints
- **Headers**: `X-Cache: HIT|MISS` indicates cache status
- **Invalidation**: Automatic on write operations (POST, PUT, DELETE)

### Rate Limiting

- **Limit**: 100 requests per minute per user
- **Headers**: 
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## Error Handling

### Standardized Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "details": "Additional context (development only)"
}
```

### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "nombre_producto",
      "message": "Product name must be 2-120 characters",
      "value": "A"
    }
  ]
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate/constraint violation) |
| 422 | Unprocessable Entity (validation failed) |
| 500 | Internal Server Error |

### Supabase Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `PGRST116` | Resource not found | 404 |
| `23505` | Unique constraint violation | 409 |
| `23503` | Foreign key violation | 400 |
| `22P02` | Invalid data type | 400 |

---

## Deployment

### Vercel Serverless (Recommended)

The project is configured for zero-config deployment on Vercel.

#### Prerequisites

- Vercel account
- Vercel CLI installed (`npm i -g vercel`)

#### Deploy Steps

```bash
# 1. Login to Vercel
vercel login

# 2. Deploy (preview)
vercel

# 3. Configure Environment Variables in Vercel Dashboard
# Settings → Environment Variables → Add all from .env

# 4. Deploy to Production
vercel --prod
```

#### Required Vercel Environment Variables

| Variable | Environment |
|----------|-------------|
| `SUPABASE_URL` | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Production |
| `SUPABASE_STORAGE_BUCKET` | Production |
| `NODE_ENV` | Production (value: `production`) |
| `DATABASE_URL` | Production (optional, alternative to individual params) |

#### Post-Deploy: Update CORS

After first deploy, add your Vercel URL to `allowedOrigins` in `app.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:10102',
  'http://localhost:5173',
  'https://your-project.vercel.app'  // Add this
];
```

Then redeploy: `vercel --prod`

### Traditional Server

```bash
npm run build
npm start
```

---

## Testing

### Test Structure

```
tests/
├── unit/           # Unit tests (services, repositories)
├── integration/    # Integration tests (API endpoints)
└── setup.ts        # Test configuration
```

### Run Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Test Configuration

- **Framework**: Jest 29 with `ts-jest` preset
- **Environment**: Node.js
- **Coverage**: Text, LCOV, HTML reports
- **Test Match**: `**/*.test.ts` in `tests/` directory

---

## Code Quality

### Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### TypeScript

- **Target**: ES6
- **Module**: CommonJS
- **Strict Mode**: Enabled
- **Config**: `tsconfig.json` at root

### Pre-commit (Optional)

Consider adding Husky for pre-commit hooks:

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'Add: your feature description'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

### Guidelines

- Follow existing code style (ESLint + Prettier)
- Write tests for new features
- Update documentation for API changes
- Keep commits atomic and descriptive
- Ensure all tests pass before submitting PR

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Contact

- **Author**: Development Team
- **GitHub**: [https://github.com/JhoamSebastianMunoz/microservice_backend_products_v2.git](https://github.com/JhoamSebastianMunoz/microservice_backend_products_v2.git)
- **Email**: jhoamsebastian68@gmail.com
- **API Docs**: [Production Scalar Docs](https://microservice-backend-products-v2.vercel.app/api-docs)

---

**Built with ❤️ using Express, TypeScript, Supabase, and Vercel**