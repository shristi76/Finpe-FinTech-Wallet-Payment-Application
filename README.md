# FinPay – Scalable FinTech Wallet & Payment Backend

A production-inspired **FinTech Wallet & Payment Backend** built with the MERN ecosystem. FinPay simulates core digital payment functionalities similar to modern wallet applications, including authentication, wallet management, peer-to-peer transfers, MPIN security, transaction history tracking, and bill payments.

Designed with scalability, clean architecture, and beginner-friendly code organization in mind.

---

##  Features

###  Authentication & Security

* JWT-based User Registration & Login
* Secure password hashing using Bcrypt
* Protected routes with middleware authentication
* User profile management
* 4-Digit MPIN setup and verification for sensitive transactions

###  User Management

* Register using Name, Email, Phone Number, and Password
* Unique user identification via Email or Phone Number
* Profile retrieval endpoint

###  Wallet System

* Digital wallet balance management
* Add money to wallet
* Real-time balance updates
* Transaction-safe wallet operations

###  Peer-to-Peer Transfers

* Send money using:

  * Email Address
  * Phone Number
* MPIN verification before processing transfers
* Balance validation checks
* Automatic transaction logging

###  Bill Payments

* Simulated utility bill payments
* MPIN-protected transactions
* Wallet deduction handling
* Transaction history generation

###  Transaction History

* Complete transfer records
* Bill payment records
* Wallet top-up records
* Timestamped transaction tracking

###  API Documentation

* Swagger UI integration
* Interactive API testing
* Request/Response schema visualization

###  Postman Collection

* Ready-to-use API collection
* JWT token automation support
* Easy endpoint testing workflow

---

##  Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Security

* JWT (JSON Web Tokens)
* BcryptJS

### Documentation & Testing

* Swagger UI
* Postman

---


## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/shristi76/Finpay-Scalable-FinTech-Wallet-Payment-Backend

cd Finpay-Scalable-FinTech-Wallet-Payment-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/finpay

JWT_SECRET=your_super_secret_key
```

For production deployments, replace the MongoDB URI with your MongoDB Atlas connection string.

---

##  Running the Project

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will start on:

```bash
http://localhost:5000
```

---

##  API Documentation

Swagger UI is available at:

```bash
http://localhost:5000/api-docs
```

Use Swagger to:

* Explore available endpoints
* Test APIs interactively
* View request/response schemas

---

##  Postman Documentation

Interactive Postman Documentation:

https://documenter.getpostman.com/view/46688304/2sBXwsMqXe

### Import Collection

1. Open Postman
2. Click **Import**
3. Import the provided collection
4. Register or Login
5. Copy JWT token (or use collection automation)
6. Test all protected endpoints

---

##  Authentication Flow

### Register User

```http
POST /api/auth/register
```

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "Password@123"
}
```

---

### Login User

```http
POST /api/auth/login
```

Request Body:

```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

Returns:

```json
{
  "token": "jwt_token"
}
```

---

### Setup MPIN

```http
POST /api/auth/setup-mpin
```

Request Body:

```json
{
  "mpin": "1234"
}
```

---

## 💸 Wallet APIs

### Add Money

```http
POST /api/wallet/add-money
```

Request:

```json
{
  "amount": 1000
}
```

---

### Pay Bill

```http
POST /api/wallet/pay-bill
```

Request:

```json
{
  "billerName": "Electricity Board",
  "amount": 500,
  "mpin": "1234"
}
```

---

##  Transaction APIs

### Send Money

```http
POST /api/transactions/send
```

Request:

```json
{
  "receiverIdentifier": "9876543210",
  "amount": 250,
  "mpin": "1234"
}
```

or

```json
{
  "receiverIdentifier": "user@example.com",
  "amount": 250,
  "mpin": "1234"
}
```

---

### Transaction History

```http
GET /api/transactions/history
```

Returns all wallet, transfer, and bill-payment transactions associated with the authenticated user.

---

##  Security Features

* JWT Authentication
* Password Hashing (Bcrypt)
* MPIN Verification Layer
* Protected Routes Middleware
* Transaction Validation
* Insufficient Balance Checks
* Secure User Lookup

---



##  License

This project is licensed under the MIT License 


