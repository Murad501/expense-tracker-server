# Expense Tracker Server

A comprehensive expense tracking API built with Node.js, Express, TypeScript, and Prisma. This server provides authentication and expense management functionality with PostgreSQL database integration.

## 🚀 Features

- **Authentication System**: User registration, login, logout with JWT tokens
- **Expense Management**: Create, read, update, delete expenses
- **Expense Analytics**: Summary statistics and filtering
- **Role-based Access**: User and Admin roles
- **Secure API**: JWT authentication with HTTP-only cookies
- **Database Integration**: PostgreSQL with Prisma ORM

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🛠️ Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd expense-tracker-server
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Environment Setup
Create a `.env` file in the root directory:

```env
PORT="3000"
NODE_ENV="development"

DATABASE_URL="postgresql://neondb_owner:npg_FpM21APiBJXw@ep-proud-leaf-a1r5shbs-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"



# JWT Configuration

JWT_SECRET=supersecretkey123
EXPIRES_IN=1d

REFRESH_TOKEN_SECRET=refreshsupersecretkey456
REFRESH_TOKEN_EXPIRES_IN=7d

SALT_ROUND=10
```

### Step 4: Database Setup
```bash
# Generate Prisma client
npm run postinstall

# Run database migrations
npm run prisma:migrate
```

### Step 5: Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

---

## 🔐 Authentication Module (`/auth`)

### Endpoints

#### 1. User Registration
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "User created in successfully!",
  "data": {
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "jwt-token-here"
  }
}
```

#### 2. User Login
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "User logged in successfully!",
  "data": {
    "accessToken": "jwt-token-here"
  }
}
```

#### 3. User Logout
```http
POST /api/v1/auth/logout
```

**Response:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "User logged out successfully!",
  "data": {
    "accessToken": "jwt-token-here"
  }
}
```

#### 4. Get Current User Profile
```http
GET /api/v1/auth/me
```

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Profile retrieval successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 💰 Expense Module (`/expense`)

### Endpoints

#### 1. Create Expense
```http
POST /api/v1/expense
```

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "title": "Grocery Shopping",
  "amount": 150,
  "category": "FOOD",
  "type": "EXPENSE",
  "note": "Weekly groceries from supermarket"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Expense history created successfully",
  "data": {
    "id": 1,
    "title": "Grocery Shopping",
    "amount": 150,
    "category": "FOOD",
    "type": "EXPENSE",
    "note": "Weekly groceries from supermarket",
    "isLarge": false,
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Get All Expenses
```http
GET /api/v1/expense
```

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: Sort direction (asc/desc)
- `searchTerm`: Search in title and note fields
- `category`: Filter by category (see available categories below)
- `type`: Filter by type (INCOME/EXPENSE)

**Available Categories:**
- `FOOD` - Food and dining
- `TRANSPORTATION` - Transport and travel
- `UTILITIES` - Bills and utilities
- `ENTERTAINMENT` - Entertainment and leisure
- `HEALTHCARE` - Medical and health expenses
- `EDUCATION` - Educational expenses
- `PERSONAL_CARE` - Personal care and grooming
- `MISCELLANEOUS` - Other expenses
- `SALARY` - Salary and income
- `OTHERS` - Other income/expenses

**Available Types:**
- `INCOME` - Money coming in
- `EXPENSE` - Money going out

**Filter Examples:**
```http
# Filter by single category
GET /api/v1/expense?category=FOOD

# Filter by multiple categories (comma-separated)
GET /api/v1/expense?category=FOOD,TRANSPORTATION

# Filter by type
GET /api/v1/expense?type=EXPENSE

# Search with filters
GET /api/v1/expense?searchTerm=grocery&category=FOOD&type=EXPENSE

# Pagination with filters
GET /api/v1/expense?page=1&limit=10&category=FOOD&type=EXPENSE
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Expense retrieval successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPage": 3
  },
  "data": [
    {
      "id": 1,
      "title": "Grocery Shopping",
      "amount": 150,
      "category": "FOOD",
      "type": "EXPENSE",
      "note": "Weekly groceries",
      "isLarge": false,
      "userId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3. Get Expense Summary
```http
GET /api/v1/expense/summary
```

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Summary retrieval successfully",
  "data": {
    "totalIncome": 2500,
    "totalExpense": 1800,
    "balance": 700,
    "balanceStatus": "Positive"
  }
}
```

#### 4. Update Expense
```http
PATCH /api/v1/expense/:id
```

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "title": "Updated Grocery Shopping",
  "amount": 175,
  "type": "EXPENSE",
  "note": "Updated note"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Expense updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Grocery Shopping",
    "amount": 175,
    "category": "FOOD",
    "type": "EXPENSE",
    "note": "Updated note",
    "isLarge": false,
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### 5. Delete Expense
```http
DELETE /api/v1/expense/:id
```

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Expense deleted successfully",
  "data": {
    "id": 1,
    "title": "Grocery Shopping",
    "amount": 150,
    "category": "FOOD",
    "type": "EXPENSE",
    "note": "Weekly groceries",
    "isLarge": false,
    "userId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📊 Data Models

### User Model
```typescript
{
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}
```

### Expense Model
```typescript
{
  id: number;
  title: string;
  amount: number;
  category: 'FOOD' | 'TRANSPORTATION' | 'UTILITIES' | 'ENTERTAINMENT' | 'HEALTHCARE' | 'EDUCATION' | 'PERSONAL_CARE' | 'MISCELLANEOUS' | 'SALARY' | 'OTHERS';
  type: 'INCOME' | 'EXPENSE';
  note?: string;
  isLarge: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Database
npm run prisma:migrate   # Run database migrations
npm run prisma:reset     # Reset database (WARNING: Deletes all data)
npm run postinstall      # Generate Prisma client

# Production
npm run build           # Build for production
npm start              # Start production server
npm run vercel-build   # Build for Vercel deployment
```

---

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Request body validation
- **CORS Protection**: Cross-origin resource sharing configuration

---

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Error description",
  "errorMessages": [
    {
      "path": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

---

## 📝 Notes

- All expense amounts are stored as integers (in cents or smallest currency unit)
- Expenses over 5000 are automatically marked as `isLarge: true`
- Authentication is required for all expense operations
- Users can only access their own expenses
- The API uses HTTP-only cookies for token storage
- Filtering supports comma-separated values for multiple selections (e.g., `category=FOOD,TRANSPORTATION`)
- Search functionality works on title and note fields

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.
