# TESTING_OVERVIEW.md
## Testing Strategy & What I Implemented

This document explains the testing work completed for the backend (Express + MongoDB) and how it validates critical business logic for the e-commerce system.

---

## 1) Why I added tests

E-commerce systems are business-logic heavy: authentication, authorization, cart integrity, and stock consistency must be correct.  
So I focused first on **API-level integration tests** because they are:
- fast to run locally and in CI
- stable (no browser flakiness)
- directly validate core business rules

---

## 2) Testing approach

### Type
✅ **Integration tests** using:
- **Jest** (test runner + assertions)
- **Supertest** (HTTP requests against the Express app)
- **MongoDB (Mongoose)** real database connection in test environment

### Scope
Tests hit real endpoints (e.g. `/api/auth/register`, `/api/checkout`) and verify:
- HTTP status codes
- authorization behavior
- database state changes (stock updates, cart cleared)
- order creation and snapshot fields

---

## 3) Test environment setup

### Separate test configuration
I use a dedicated test environment file:
- `backend/.env.test`

This keeps tests deterministic and prevents accidental dependency on production values.

### Loading env variables for Jest
In `backend/package.json`, tests run with dotenv preloaded:

- `DOTENV_CONFIG_PATH=./.env.test node -r dotenv/config ...`

This ensures `MONGO_URI` and `JWT_SECRET` are available during test runs.

---

## 4) Tests implemented (What they prove)

### A) Auth + RBAC protection
**File:** `backend/tests/auth.admin.test.js`

1) **Register works**
- Sends POST `/api/auth/register`
- Verifies request succeeds
- Confirms returned email matches input (supports different response shapes)

2) **Non-admin blocked**
- Registers + logs in as normal user
- Calls admin endpoint `/api/admin/orders` with user cookie
- Expects **403 Forbidden**

✅ Recruiter takeaway:
- “I enforce role-based authorization on admin routes and I have automated tests to prove it.”

---

### B) Stock reduction on checkout (core e-commerce rule)
**File:** `backend/tests/checkout.stock.test.js`

- Creates a product in DB with known stock
- Adds product to cart with qty = 2
- Calls POST `/api/checkout`
- Reads product again from DB
- Confirms `stockQty` decreased by exactly 2

✅ Recruiter takeaway:
- “Stock changes are validated server-side and verified via integration tests to prevent overselling.”

---

### C) Checkout integrity (end-to-end data correctness)
**File:** `backend/tests/checkout.integrity.test.js`

Validates multiple invariants after checkout:
1) Checkout returns success (200/201)
2) Cart becomes empty (`GET /api/cart` returns `items.length === 0`)
3) New order exists in `/api/orders`
4) Order contains **snapshot fields**:
   - `titleSnapshot`
   - `slugSnapshot`
   - `priceSnapshotUSD`
   - `qty`

✅ Recruiter takeaway:
- “I designed orders to store snapshots so pricing/title changes later don’t corrupt historical orders.”
- “My tests verify cart clearing and order creation integrity.”

---





## Expected output:
PASS auth tests
PASS stock test
PASS checkout integrity test
6) Why this is recruiter-relevant
These tests demonstrate:
secure auth + cookie usage in API testing
role-based access control (RBAC)
real e-commerce business logic validation
database state verification (not just response checking)
production-oriented approach (separate test env, deterministic runs)
7) Next testing steps (planned)
A) Cypress E2E (frontend)
I have experience with Cypress and plan to add 3 E2E flows:
User login → add to cart
Checkout → order appears
Admin status update works
B) CI integration
Run tests automatically on every PR using GitHub Actions