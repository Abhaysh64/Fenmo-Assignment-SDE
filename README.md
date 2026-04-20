# Expense Tracker — Fenmo Technical Assessment

A production-oriented full-stack expense tracking application built as part of the Fenmo SDE technical assessment.

The application focuses on correctness, deployment reliability, and production-minded backend design rather than feature breadth.

---

## Live Application

- **Frontend**: https://fenmo-assignment-sde.vercel.app  
- **Backend API**: https://fenmo-assignment-sde.onrender.com  

---

## Repository

**GitHub Repository**: https://github.com/Abhaysh64/Fenmo-Assignment-SDE

---

## Features

- Add expenses with amount, category, description, and date
- Filter expenses by category
- Sort expenses by:
  - Newest First
  - Oldest First
- Persistent database storage using SQLite
- Retry-safe expense creation using idempotency keys
- Responsive UI with production-style deployment setup

---

## Tech Stack

### Frontend
- React
- Vite
- Axios

### Backend
- Node.js
- Express

### Database
- better-sqlite3

### Deployment
- Frontend deployed on Vercel
- Backend deployed on Render

### Testing
- Jest
- Supertest

---

## Architecture Overview

```
expense-tracker/
│
├── client/        # React frontend
│
├── server/        # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── db/
│   ├── utils/
│   ├── tests/
│
└── README.md
```

---

## Key Engineering Decisions

### 1. Amount Storage Strategy

Expense amounts are stored internally in **paise** instead of floating point values.

**Example:**

```
₹250.50 → 25050
```

This avoids floating point precision issues commonly seen in financial calculations.

---

### 2. Idempotency Handling

Expense creation supports an `Idempotency-Key` header.

This ensures repeated requests (caused by retries, refreshes, or duplicate submissions) do not create duplicate records.

This was added because retry-safety was explicitly emphasized in the assessment requirements.

---

### 3. Database Choice

SQLite was selected because:

- Lightweight
- Persistent
- Minimal setup overhead
- Sufficient for assignment scope

`better-sqlite3` was chosen over `sqlite3` for deployment compatibility and cleaner synchronous queries.

---

### 4. Deployment Separation

Frontend and backend were deployed independently:

- Frontend on Vercel
- Backend on Render

This reflects a realistic production deployment pattern and allows environment-based API configuration.

---

## API Endpoints

### Create Expense

**POST** `/expenses`

**Request body:**

```json
{
  "amount": "250",
  "category": "Food",
  "description": "Lunch",
  "date": "2026-04-20"
}
```

**Optional header:**

```
Idempotency-Key: unique-request-key
```

### Fetch Expenses

**GET** `/expenses`

**Optional query params:**

```
?category=Food
?sort=date_desc
?sort=date_asc
```

---

## Running Locally

### Backend

```bash
cd server
npm install
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Environment Variables

### Frontend (.env)

```
VITE_API_URL=https://fenmo-assignment-sde.onrender.com
```

---

## Tests

Integration tests added using Jest + Supertest.

**Covered scenarios:**

- Expense creation
- Validation failures
- Idempotent retry protection
- Sorting endpoint behavior

**Run tests:**

```bash
cd server
npm test
```

---

## Tradeoffs

To stay aligned with the assignment timebox, the following were intentionally kept out of scope:

- Authentication
- Edit/delete expense flows
- Pagination
- Analytics/dashboard visualizations

The goal was to prioritize production correctness over feature breadth.

---

## Future Improvements

- Add edit/delete expense support
- Add pagination for large datasets
- Add API-level schema validation layer
- Add CI workflow for automated tests
- Add category analytics dashboard

---

## Notes

The solution was built with focus on:

- Production-readiness
- Reliability under retries
- Clean deployment
- Maintainable code structure