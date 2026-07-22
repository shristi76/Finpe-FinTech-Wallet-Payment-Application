Finpe — Scalable FinTech Wallet & Payment Application

Finpe is a full-stack digital wallet application inspired by modern UPI payment apps. Users can register, set a secure MPIN, add demo money, transfer money using a phone number or Finpe UPI ID, track payments, and generate AI-powered transaction insights.

The project also implements **idempotency keys** so a repeated payment request is processed only once, preventing accidental duplicate wallet deductions.

## Live demo

- Frontend: [https://finpee.netlify.app/](https://finpee.netlify.app/)
- Backend API: [finpay-scalable-fintech-wallet-payment.onrender.com](https://finpay-scalable-fintech-wallet-payment.onrender.com/)
- Swagger API docs: [API documentation](https://finpay-scalable-fintech-wallet-payment.onrender.com/api-docs)

## Features

- JWT-based registration and login
- Secure password hashing with Bcrypt
- Protected API routes
- Four-digit MPIN setup and payment verification
- Demo wallet top-ups
- Money transfers using a phone number or `@finpe` UPI ID
- Optional transfer descriptions, such as “Buying books”
- Clear transaction history for wallet top-ups, sent, received, and bill payments
- AI transaction insights based on payment activity and descriptions
- Idempotent transfer and bill-payment requests to prevent duplicate payments
- Swagger documentation and Postman collection

## Idempotency

Each transfer and bill payment requires an `Idempotency-Key` request header. The frontend generates this key automatically for a new payment.

The backend stores a payment request using the authenticated user and key, along with a fingerprint of the payment details.

```text
First request with a key        → Payment is processed once
Same key + same payment details → Previous successful response is returned
Same key + changed details      → 409 Conflict
```

This protects users from double-clicks, automatic retries, and unreliable network connections.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, BcryptJS |
| AI insights | Google Gemini API |
| API testing | Swagger UI, Postman |

## Project structure

```text
finpe/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection
│   │   ├── controllers/     # Request handling
│   │   ├── middleware/      # JWT authentication
│   │   ├── models/          # User, transaction, and payment request schemas
│   │   ├── routes/          # API routes
│   │   └── services/        # AI and idempotency services
│   ├── server.js
│   ├── seed.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
└── package.json
```

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/shristi76/Finpay-Scalable-FinTech-Wallet-Payment-Backend.git
cd Finpay-Scalable-FinTech-Wallet-Payment-Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finpe
JWT_SECRET=replace_with_a_long_secret
GEMINI_API_KEY=your_gemini_api_key
```

Optionally, create `frontend/.env` for a custom API address:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the app

Open two terminals from the project root:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

The frontend runs at `http://localhost:5173` and the backend runs at `http://localhost:5000`.

### Optional: seed demo users

```bash
npm --prefix backend run seed
```

Seeded users use password `password123` and MPIN `1234`.

## API overview

All protected routes require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account and Finpe UPI ID |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/profile` | Get the authenticated user profile |
| POST | `/api/auth/setup-mpin` | Set a four-digit MPIN |
| POST | `/api/wallet/add-money` | Add demo funds to the wallet |
| POST | `/api/wallet/pay-bill` | Pay a simulated utility bill |
| POST | `/api/transactions/send` | Send money securely |
| GET | `/api/transactions/history` | Get transaction history |
| GET | `/api/ai/summary` | Generate financial insights |

### Send money

```http
POST /api/transactions/send
Authorization: Bearer YOUR_JWT_TOKEN
Idempotency-Key: 9d8f5b49-b082-4a76-a77e-demo-transfer
Content-Type: application/json
```

```json
{
  "receiverIdentifier": "friend@finpe",
  "amount": 250,
  "mpin": "1234",
  "description": "Buying books"
}
```

The `description` is optional. The `Idempotency-Key` must be unique for every new payment.

## Deployment

The frontend is deployed on Netlify and the backend is deployed on Render.

For a production frontend build, configure this Netlify environment variable:

```env
VITE_API_URL=https://finpay-scalable-fintech-wallet-payment.onrender.com/api
```

The `/api` suffix is required because all Express routes are mounted under `/api`.


---


## Demo

<img width="1710" height="790" alt="Screenshot 2026-07-17 223225" src="https://github.com/user-attachments/assets/4886cc47-9fb4-4ad9-b048-b9daf88bc33a" />


<img width="1186" height="906" alt="Screenshot 2026-07-17 223832" src="https://github.com/user-attachments/assets/d19e9750-6f22-46cb-ab8e-8fa4f374ccf6" />


<img width="1186" height="906" alt="Screenshot 2026-07-17 223832" src="https://github.com/user-attachments/assets/59026098-6334-4da5-ad53-a67d52769bc5" />

---

## Sequence Diagram

<img width="5629" height="6808" alt="deepseek_mermaid_20260613_a06f77" src="https://github.com/user-attachments/assets/32f9b15f-c81f-48d8-af3e-df0812e8ccb7" />

## Security notes

- Passwords and MPINs are stored as hashes, never plain text.
- JWT middleware protects wallet, payment, history, and insight endpoints.
- MPIN is required before making a transfer or bill payment.
- Atomic balance updates protect against spending beyond the available wallet balance.
- Idempotency records prevent the same logical payment from being processed twice.

## License

This project is licensed under the MIT License.
