# Finpe — Scalable FinTech Wallet & Payment Application

Finpe is a full-stack digital wallet and payment application inspired by modern UPI apps like Google Pay and PhonePe. It enables users to securely manage a digital wallet, transfer money, pay bills, view transaction history, and receive AI-powered spending insights.

A key feature of the project is **idempotent payment processing**, ensuring that duplicate payment requests caused by retries or double-clicks are processed only once.

---

## Live Demo

- **Frontend:** https://finpee.netlify.app/
- **Backend API:** https://finpay-scalable-fintech-wallet-payment.onrender.com/
- **Swagger API Docs:** https://finpay-scalable-fintech-wallet-payment.onrender.com/api-docs

---

#  Features

- JWT Authentication
- Secure password hashing with BcryptJS
- User registration & login
- Four-digit MPIN setup and verification
- Demo wallet top-up
- Send money using:
  - Registered phone number
  - Finpe UPI ID (`username@finpe`)
- Optional payment description
- Complete transaction history
- AI-generated transaction insights using Google Gemini
- Idempotent payment processing
- Swagger API documentation
- Postman collection support

---

# Idempotency

Every money transfer and bill payment requires an **Idempotency-Key** request header.

The frontend automatically generates a unique key for every new payment request.

The backend stores:

- Authenticated user
- Idempotency key

Result:

```text
First request with a key        → Payment is processed
Same key + same payload         → Previous response returned
Same key + different payload    → 409 Conflict
```

This protects users from:

- Double-clicking the Pay button
- Network retries
- Browser resubmissions
- Mobile connection failures

---

#  Tech Stack

| Area | Technologies |
|------|--------------|
| Frontend | React, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, BcryptJS |
| AI | Google Gemini API |
| API Documentation | Swagger UI |
| API Testing | Postman |

---


#  Local Setup

## 1. Clone the repository

```bash
git clone https://github.com/shristi76/Finpe-FinTech-Wallet-Payment-Application.git

cd Finpe-FinTech-Wallet-Payment-Application
```

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create **backend/.env**

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/finpe

JWT_SECRET=replace_with_a_long_secret

GEMINI_API_KEY=your_gemini_api_key
```

(Optional)

Create **frontend/.env**

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 4. Run the application

Backend

```bash
npm run dev:backend
```

Frontend

```bash
npm run dev:frontend
```

Application URLs

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

## Seed Demo Users

```bash
npm --prefix backend run seed
```

Demo credentials

Password

```
password123
```

MPIN

```
1234
```

---

#  API Overview

All protected endpoints require

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | User profile |
| POST | `/api/auth/setup-mpin` | Set MPIN |
| POST | `/api/wallet/add-money` | Add demo money |
| POST | `/api/wallet/pay-bill` | Pay utility bill |
| POST | `/api/transactions/send` | Send money |
| GET | `/api/transactions/history` | Transaction history |
| GET | `/api/ai/summary` | AI financial insights |

---

#  Send Money Example

```http
POST /api/transactions/send

Authorization: Bearer YOUR_JWT_TOKEN
Idempotency-Key: 9d8f5b49-b082-4a76-a77e-demo-transfer
Content-Type: application/json
```

Request

```json
{
  "receiverIdentifier": "friend@finpe",
  "amount": 250,
  "mpin": "1234",
  "description": "Buying books"
}
```

The **description** field is optional.

A new **Idempotency-Key** must be generated for every new payment request.

---

#  Demo

### Home

<img width="1710" alt="Home" src="https://github.com/user-attachments/assets/4886cc47-9fb4-4ad9-b048-b9daf88bc33a" />

### Dashboard

<img width="1186" alt="Dashboard" src="https://github.com/user-attachments/assets/d19e9750-6f22-46cb-ab8e-8fa4f374ccf6" />

### Transactions

<img width="1186" alt="Transactions" src="https://github.com/user-attachments/assets/59026098-6334-4da5-ad53-a67d52769bc5" />

---

#  Sequence Diagram

<img width="5629" alt="Sequence Diagram" src="https://github.com/user-attachments/assets/32f9b15f-c81f-48d8-af3e-df0812e8ccb7" />

---

#  Security

- Passwords are securely hashed using **BcryptJS**.
- MPINs are stored as hashes and never in plain text.
- JWT authentication protects all sensitive endpoints.
- MPIN verification is required before money transfers and bill payments.
- Atomic wallet balance updates prevent race conditions and overspending.
- Idempotency records ensure duplicate payment requests are processed only once.

---



#  License

This project is licensed under the **MIT License**.

---
