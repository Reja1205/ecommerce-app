## README File

E-commerce App (Next.js + Express + MongoDB + Docker)

A full-stack e-commerce application built with Next.js (App Router), Express, MongoDB, and Docker Compose.
The project demonstrates real production patterns: authentication, cart, checkout, admin workflows, SSR considerations, and containerized deployment.

⸻

Features

User
	•	Register / Login (cookie-based auth)
	•	Browse products
	•	Add to cart
	•	Checkout (mock payment)
	•	View orders

Admin
	•	Create / edit products
	•	View all orders
	•	Update order status

Engineering
	•	Next.js App Router (Server + Client Components)
	•	Express REST API
	•	MongoDB with Mongoose
	•	Dockerized frontend, backend, and database
	•	Health check endpoint
	•	Production-ready env handling

⸻

Tech Stack
	•	Frontend: Next.js 16 (App Router), React
	•	Backend: Node.js, Express
	•	Database: MongoDB
	•	Auth: JWT (HTTP-only cookies)
	•	Containerization: Docker, Docker Compose

⸻

Project Structure

ecommerce-app/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── app/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md

Environment Variables

Backend (Docker)

MONGO_URI=mongodb://mongo:27017/ecommerce
JWT_SECRET=dev_secret
FRONTEND_ORIGIN=http://localhost:3000
PORT=4000

Frontend

NEXT_PUBLIC_API_URL=http://localhost:4000

Note: NEXT_PUBLIC_* variables are used in the browser. Server-only values are kept private

Run Locally (Docker)

Prerequisites
	•	Docker Desktop (Mac / Windows / Linux)

Start the app

From the project root:

docker compose up --build

Access
	•	Frontend: http://localhost:3000
	•	Backend health: http://localhost:4000/health

⸻

Common Commands

# Stop containers
docker compose down

# Rebuild everything
docker compose up --build

# View logs
docker compose logs -f backend
docker compose logs -f frontend
Key Engineering Learnings
	•	Docker networking: containers don’t use localhost to talk to each other
	•	Next.js SSR: Server Components need server-safe env vars
	•	Port binding: backend must bind to 0.0.0.0 inside containers
	•	App Router: useSearchParams requires a Suspense boundary
	•	Debugging: logs, health endpoints, and rebuilds beat guesswork

⸻

Why This Project Matters

This project mirrors real production issues:
	•	environment mismatches
	•	SSR build failures
	•	container networking bugs
	•	service orchestration

It was built and debugged end-to-end, not scaffolded.

⸻

Next Steps
	•	Public deployment (Render / Railway / Fly.io)
	•	CI with GitHub Actions
	•	Payment integration (Stripe)
	•	Role-based UI permissions
