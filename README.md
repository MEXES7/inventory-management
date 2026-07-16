# Inventory Management System

A full-stack Inventory Management System built with **NestJS**, **React**, **PostgreSQL**, and **Prisma**. The application enables businesses to manage products, synchronize inventory levels, monitor stock movements, and view inventory statistics through a responsive dashboard.

---

## Features

### Dashboard

- View inventory statistics
- Total number of products
- Total inventory units
- Low stock products
- Out of stock products
- Total inventory value
- Inventory status chart
- Recent stock activity

### Product Management

- Create products
- Update products
- Delete products
- Search by product name or SKU
- Filter by stock status
- Pagination
- Form validation

### Inventory Synchronization

- Bulk inventory updates
- Automatic stock status calculation
- Stock movement logging
- Quantity difference preview before synchronization

### Stock Logs

- View inventory history
- Restock and sale tracking
- Pagination
- Chronological ordering

### User Experience

- Responsive layout
- Mobile sidebar
- Loading skeletons
- Toast notifications
- Error handling
- Empty states

### Backend

- REST API
- Prisma ORM
- PostgreSQL
- Validation using class-validator
- Global exception handling
- Unit tests with Jest

---

# Tech Stack

## Frontend

- React
- TypeScript
- React Router
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- Recharts
- React Hot Toast
- Lucide Icons

## Backend

- NestJS
- Prisma ORM
- PostgreSQL
- WebSockets (Socket.IO)
- Jest

---

# Project Structure

```
inventory-management/
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── test/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
│
└── README.md
```

---

# Installation

## 1. Clone the repository

```bash
git clone https://github.com/MEXES7/inventory-management.git

cd inventory-management
```

---

# Database Setup

## Option 1 (Recommended): Docker

Start the PostgreSQL database using Docker Compose.

```bash
docker compose up -d
```

Verify the container is running.

```bash
docker ps
```

This creates a PostgreSQL database with the following configuration:

| Property | Value     |
| -------- | --------- |
| Host     | localhost |
| Port     | 5432      |
| Database | inventory |
| Username | postgres  |
| Password | postgres  |

---

## Option 2: Local PostgreSQL

If you already have PostgreSQL installed locally, create a database named:

```text
inventory
```

and update the `DATABASE_URL` in your `.env` file accordingly.

---

# Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory"
PORT=3000
```

Run the database migrations.

```bash
npx prisma migrate dev
```

Start the backend.

```bash
npm run start:dev
```

The backend will be available at:

```
http://localhost:3000
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:3000
```

Start development server.

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# Running with Docker

Start PostgreSQL.

```bash
docker compose up -d
```

Stop PostgreSQL.

```bash
docker compose down
```

---

# Running Tests

Backend

```bash
npm test
```

Run with coverage

```bash
npm run test:cov
```

---

# API Endpoints

## Dashboard

| Method | Endpoint     |
| ------ | ------------ |
| GET    | `/dashboard` |

---

## Products

| Method | Endpoint        |
| ------ | --------------- |
| GET    | `/products`     |
| POST   | `/products`     |
| PATCH  | `/products/:id` |
| DELETE | `/products/:id` |

Supports

- pagination
- search
- status filter

Example

```
GET /products?page=1&limit=10&search=laptop&status=IN_STOCK
```

---

## Inventory Synchronization

| Method | Endpoint         |
| ------ | ---------------- |
| PATCH  | `/products/sync` |

Example payload

```json
{
  "products": [
    {
      "sku": "SKU-001",
      "quantity": 25
    },
    {
      "sku": "SKU-002",
      "quantity": 4
    }
  ]
}
```

---

## Stock Logs

| Method | Endpoint      |
| ------ | ------------- |
| GET    | `/stock-logs` |

Supports pagination.

```
GET /stock-logs?page=1&limit=10
```

---

# Inventory Status

The application automatically calculates product status.

| Quantity | Status       |
| -------- | ------------ |
| 0        | OUT_OF_STOCK |
| 1 - 10   | LOW_STOCK    |
| > 10     | IN_STOCK     |

---

# Testing

The backend includes unit tests covering

- Product service
- Dashboard service
- Prisma service
- Inventory gateway
- Exception filters

---

# Future Improvements

- Authentication & Authorization
- User roles
- Export inventory to CSV
- Barcode scanning
- Email notifications
- Dark mode
- Product image uploads
- Advanced analytics
- Multi-warehouse inventory

---

## Screenshots

### Dashboard

![Dashboard](./screenshots/dashboard.png)

### Products

![Products](./screenshots/products.png)

### Inventory Synchronization

![Sync Products](./screenshots/sync.png)

### Stock Logs

![Stock Logs](./screenshots/stock.png)

---

# Author

**Abdulmalik Olaoye**

GitHub

https://github.com/MEXES7
LinkedIn

https://www.linkedin.com/in/abdulmalik-olaoye-7348a925a/
