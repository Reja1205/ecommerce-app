# PROJECT_OVERVIEW.md
## Full-Stack E-Commerce Application – Architecture & Build Explanation

This document explains **how the project was built step-by-step**, why certain design decisions were taken, and how each major part works.  
It is intended to explain the project clearly during technical interviews.

---

## 1. Project Goal

The goal was to build a **realistic, production-style e-commerce system**, not just a CRUD demo.

Key objectives:
- Clear frontend–backend separation
- Secure authentication
- Role-based admin control
- Proper cart → checkout → order lifecycle
- Clean API design and state handling
- Recruiter-ready structure

---

## 2. Tech Stack & Why

### Frontend
- **Next.js (App Router)**
  - Server Components for data fetching
  - Client Components for interactions
  - File-based routing for clarity
- Fetch API with `credentials: "include"`
- Inline styles (focus on logic, not UI frameworks)

### Backend
- **Node.js + Express**
  - Explicit middleware flow
  - Easy to reason about request lifecycle
- **MongoDB + Mongoose**
  - Schema-driven design
  - Flexible product & order models
- **JWT Authentication**
  - Stored in HttpOnly cookies (secure, no XSS access)

---

## 3. High-Level Architecture
Browser (Next.js)
↓ (HTTP + cookies)
Express API
↓
Auth / Role Middleware
↓
Controllers
↓
MongoDB (Mongoose models)

Key principle:  
👉 **Frontend never trusts itself** – backend validates everything.

---

## 4. Authentication Design (Important)

### Flow
1. User logs in
2. Backend generates JWT
3. JWT stored in **HttpOnly cookie**
4. Frontend sends requests with `credentials: "include"`
5. Backend middleware validates JWT on every protected route

### Why cookies instead of localStorage?
- Safer against XSS
- Works naturally with server-side rendering
- Real-world production pattern

---

## 5. Role-Based Access Control (RBAC)

Two roles:
- `user`
- `admin`

### Backend
- `requireAuth` → checks JWT
- `requireAdmin` → checks `user.role === "admin"`

### Frontend
- `/admin/*` wrapped with **AdminGuard**
- Non-admin users redirected to `/login`

This ensures **defense in depth** (frontend + backend).

---

## 6. Product System

### Product Model Concepts
- `title`
- `slug` (SEO-friendly, unique)
- `priceUSD`
- `stockQty`
- `active`

### Slug Strategy
- Auto-generated from title
- Ensures uniqueness (`product`, `product-2`, etc.)
- Used in URLs: `/products/[slug]`

Why?
- SEO
- Human-readable URLs
- Stable identifiers for frontend routing

---

## 7. Cart Design (Key Interview Topic)

### Important Design Choice
👉 **Cart stores price & title snapshots**

Why?
- Product price may change later
- Cart/order integrity must remain correct

### Cart Flow
1. User adds product
2. Backend:
   - Validates stock
   - Stores snapshot
3. User updates quantity
4. Cart recalculates totals

Each user has **one cart**.

---

## 8. Checkout & Orders

### Checkout Logic
- Mock payment (pluggable for Stripe later)
- Validates stock again
- Reduces product stock
- Creates order
- Clears cart

### Order Design
Orders store:
- Product snapshots
- Quantities
- Totals
- Shipping fee
- Status

### Order Status Flow
PLACED → PROCESSING → SHIPPED → DELIVERED

Only admins can update status.

---

## 9. Admin Dashboard

### Admin Capabilities
- Create products (auto slug)
- Edit products (price, stock, active)
- Delete products
- View all orders
- Update order status via UI

### Why Admin UI matters
Shows:
- Role-based security
- Real operational workflows
- Business logic, not just CRUD

---

## 10. Frontend UX Polish

Added intentionally:
- Search/filter on home page
- Add-to-cart shortcut
- Clear loading & empty states
- Navigation header with role-aware links

This shows attention to **user experience**, not just APIs.

---

## 11. Error Handling Philosophy

- Backend always returns meaningful HTTP status codes
- Frontend always shows user-friendly messages
- Network errors handled explicitly

---

## 12. What This Project Demonstrates

- End-to-end full-stack ownership
- Secure authentication design
- Real e-commerce domain knowledge
- Clean separation of concerns
- Admin vs user workflows
- Production-style thinking

---

## 13. What Comes Next

Planned next steps:
- Integration testing (Jest + Supertest)
- Deployment (Vercel + Render)
- Environment separation
- API documentation

---

## Summary (One-line for recruiter)

> “I designed and built a full-stack e-commerce system with secure cookie-based authentication, role-based admin control, cart and checkout logic, and a production-style frontend–backend architecture.”

কীভাবে ব্যবহার করবে interview এ
Recruiter প্রশ্ন করলে → এই file mentally follow করো
“Why did you do X?” → section 4–8 থেকে explain করো
এটা দেখালে তুমি junior না, senior-thinking developer হিসেবে দাঁড়াবে