![Node.js](https://img.shields.io/badge/node-%3E%3D16-green)
![NestJS](https://img.shields.io/badge/nestjs-%3E%3D9-red)
![Docker](https://img.shields.io/badge/docker-%3E%3D20-blue)

# Payment Backend

Payment backend service built with **NestJS**, **TypeORM**, **PostgreSQL**, and **Docker**.

This project provides a clean and secure **payment record management API** with JWT authentication, ownership-based access control, pagination, filtering, and Swagger documentation.

---

## 🚀 Features

- NestJS REST API
- JWT authentication
- Ownership-based authorization + admin bypass
- Payment CRUD operations
- Pagination & filtering (status, method, date)
- Clean Response DTOs (no entity leaks)
- Swagger (OpenAPI) documentation

---

## 🧱 Tech Stack

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Docker
- Swagger (OpenAPI)

---

Swagger UI:
http://localhost:3000/docs

## ▶️ Run Locally

### Using Docker (recommended)

```bash
git clone https://github.com/melihdemir0/payment-backend.git
cd payment-backend
docker compose up --build
Without Docker
npm install
npm run start:dev
sadece şu kısmı tek te at
