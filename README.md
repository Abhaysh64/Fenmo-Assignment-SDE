# Expense Tracker — Fenmo Technical Assessment

A production-oriented expense tracking application built as part of the Fenmo SDE technical assessment.

## Live Application
Frontend: https://fenmo-assignment-sde.vercel.app  
Backend API: https://fenmo-assignment-sde.onrender.com

## Features
- Add expenses with amount, category, description, and date
- Filter expenses by category
- Sort expenses by newest / oldest
- Persistent SQLite storage
- Retry-safe submission using idempotency keys

## Technical Design Decisions
- Amount stored internally in paise to avoid floating point precision issues
- SQLite selected for lightweight persistence
- better-sqlite3 chosen for deployment reliability
- Idempotency implemented to prevent duplicate inserts during retries

## Architecture
Frontend:
- React + Vite
- Axios API layer

Backend:
- Express
- SQLite
- Structured controller / route separation

## Deployment
Frontend deployed on Vercel  
Backend deployed on Render

## Tradeoffs
- No authentication added to keep scope aligned with assignment timebox
- No pagination due small expected dataset

## Future Improvements
- Automated integration tests
- Pagination
- Edit/Delete expenses
- Category analytics dashboard