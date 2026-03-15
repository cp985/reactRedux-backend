# ⚔️ React TanStack Shop — Backend API

REST API backend for The Golden Pixel Inn e-commerce app. Built with Express, MongoDB and JWT authentication, deployed on Render.

🔗 **Frontend Repo:** [react-tanstack-shop](https://github.com/cp985/react-tanstack-shop)

---

## 🖼️ Tech Stack

| Technology | Role |
|---|---|
| Node.js + Express | HTTP server & routing |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication & token management |
| bcrypt | Password hashing |
| Render | Cloud deployment |

---

## ✨ Features

### 🔐 Auth
- Register and login with email + password
- Passwords hashed with bcrypt
- JWT token issued on login, verified via middleware on protected routes
- Token expiry enforced — frontend auto-logouts on expiry

### 👤 Users
- Get user profile
- Update profile (name, surname, email, password, address, phone)

### 🛍️ Products
- Get all products
- Filter by category, rarity, type, class, price
- Individual product detail

### 📦 Orders
- Create order with shipping address, products list, payment method and paid status
- Get order history for authenticated user

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/cp985/react-tanstack-shop-backend.git
cd react-tanstack-shop-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your values

# Start dev server
npm run dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Server port (default 3000) |

---

## 📡 API Endpoints

### Auth
```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login, returns JWT token
```

### Users (protected)
```
GET    /api/users/profile     Get authenticated user profile
PUT    /api/users/profile     Update authenticated user profile
```

### Products
```
GET    /api/products          Get all products
GET    /api/products/:id      Get single product
```

### Orders (protected)
```
GET    /api/orders            Get orders for authenticated user
POST   /api/orders            Create new order
```

---

## 📁 Project Structure

```
backend/
├── controllers/    # Route handler logic
├── middleware/     # Auth middleware (JWT verify)
├── models/         # Mongoose schemas (User, Product, Order)
├── routes/         # Express routers
└── server.js       # Entry point
```

---

## ☁️ Deploy on Render

1. Push repo to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repo
4. Set environment variables in the Render dashboard
5. Build command: `npm install`  
   Start command: `node server.js`
