# Project Context – Ecommerce App

## Tech Stack
- Frontend: Next.js (App Router, JS)
- Backend: Node.js, Express.js
- DB: MongoDB Atlas + Mongoose
- Auth: JWT in HttpOnly cookies
- Roles: user, admin

## Implemented Features
- Auth: register, login, logout, /me
- Role-based access (admin routes protected)
- Products:
  - Auto slug from title
  - List, details by slug
  - Admin CRUD (create, edit, delete)
- Cart:
  - Add/update/remove items
  - Price snapshot stored
- Checkout:
  - Mock payment
  - Stock decrement
  - Order created
- Orders:
  - User orders list + details
  - Admin orders list
  - Admin status update (PLACED → PROCESSING → SHIPPED → DELIVERED)
- Frontend:
  - Store, Product details, Cart, Orders
  - Admin dashboard
  - Navbar + route protection

## Current State
- Frontend and backend both running locally
- Admin and user flows fully working
- Ready for testing / deployment

## Next Planned Steps
- Testing (Jest + Supertest)
- Deployment (Backend + Frontend)
- Repo polish (docs, screenshots)
এখন তোমার প্রজেক্টটা “working demo” থেকে “recruiter-ready production-style” বানানোর সময়। আমি recommend করব এই order এ এগোতে:
Finish polish (frontend UX)
Home page এ search/filter + “Add to cart” shortcut
Cart এ “Continue shopping” + clear messages
Orders/ Admin pages এ better empty/loading states
Testing (recruiter signal)
Backend: auth/cart/checkout/order endpoints এর জন্য 6–10টা integration test (Jest + supertest)
“stock reduce works” + “non-admin blocked” এই ২টা test অবশ্যই
Deployment
Backend deploy (Render/Railway) + MongoDB Atlas prod URI
Frontend deploy (Vercel)
CORS origin update (Vercel domain)
Repo cleanup
.env.example add
API_DOCS.md লিখে endpoints list
Screenshots + demo GIF