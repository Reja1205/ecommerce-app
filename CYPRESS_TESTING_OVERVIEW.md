# CYPRESS_TESTING_OVERVIEW.md
## Cypress E2E Testing – What I Built & Why

This document explains the Cypress end-to-end tests added to the project and what they validate from a recruiter/interview perspective.

---

## 1) Why Cypress E2E tests were added

Backend integration tests (Jest + Supertest) validate API correctness, but real applications also need proof that:
- the UI flows work end-to-end,
- authentication state is preserved,
- admin operations work from the dashboard.

So I added Cypress E2E tests to validate the complete user journey in a browser-like environment.

---

## 2) Test philosophy

### What I test (high value flows)
I focused on “recruiter-relevant” flows:
- user can log in and buy something
- checkout results in an order
- admin can manage operational workflows (order status updates)

### What I avoid in E2E
I avoid testing every UI detail.  
Instead I test core business outcomes (cart updated, order exists, status changed).

---

## 3) Cypress setup

Cypress is installed in the frontend project:

- `frontend/` contains Cypress config and specs
- `cypress.config.js` uses:
  - `baseUrl: http://localhost:3000`

Precondition:
- Backend running on `http://localhost:4000`
- Frontend running on `http://localhost:3000`

---

## 4) Authentication handling (important detail)

This app uses cookie-based auth (HttpOnly JWT cookie).  
UI login can be flaky in E2E due to redirects and auth guards, so I use a reliable approach:

✅ **API-based login helper**:
- Cypress performs `POST http://localhost:4000/api/auth/login`
- cookie is set automatically
- then the test visits pages as an authenticated user

This reduces flakiness and makes tests stable and fast.

---

## 5) Cypress custom command used

**File:** `frontend/cypress/support/commands.js`

- `cy.loginByApi(email, password)`
  - sends login request to backend
  - asserts status 200
  - ensures authenticated session for subsequent UI steps

This is a common production approach to make E2E tests deterministic.

---

## 6) E2E specs implemented (what they prove)

### A) User flow: login + add to cart
**Spec:** `frontend/cypress/e2e/user_add_to_cart.cy.js`

Validates:
- user session works
- products load on store page
- clicking “Add to Cart” results in cart containing an item

Recruiter takeaway:
> “I tested the storefront → cart conversion flow end-to-end.”

---

### B) Checkout flow: checkout creates order
**Spec:** `frontend/cypress/e2e/checkout_creates_order.cy.js`

Validates:
- user can add a product to cart
- user can checkout
- order appears in `/orders`

Recruiter takeaway:
> “I validated the purchase lifecycle (cart → checkout → order) via E2E automation.”

---

### C) Admin flow: update order status from dashboard
**Spec:** `frontend/cypress/e2e/admin_updates_order_status.cy.js`

Validates:
- admin session works
- admin-only page `/admin/orders` is accessible
- admin can update status using dropdown (operational workflow)

Recruiter takeaway:
> “I validated role-based access control and admin operational workflows.”

---

## 7) How to run Cypress tests

### UI mode (interactive)
```bash
cd frontend
npx cypress open



## Headless mode (CI-style)
cd frontend
npx cypress run
Run a single spec:
npx cypress run --spec cypress/e2e/admin_updates_order_status.cy.js


# CYPRESS_TESTING_OVERVIEW.md
## Cypress E2E Testing – What I Built & Why

This document explains the Cypress end-to-end tests added to the project and what they validate from a recruiter/interview perspective.

---

## 1) Why Cypress E2E tests were added

Backend integration tests (Jest + Supertest) validate API correctness, but real applications also need proof that:
- the UI flows work end-to-end,
- authentication state is preserved,
- admin operations work from the dashboard.

So I added Cypress E2E tests to validate the complete user journey in a browser-like environment.

---

## 2) Test philosophy

### What I test (high value flows)
I focused on “recruiter-relevant” flows:
- user can log in and buy something
- checkout results in an order
- admin can manage operational workflows (order status updates)

### What I avoid in E2E
I avoid testing every UI detail.  
Instead I test core business outcomes (cart updated, order exists, status changed).

---

## 3) Cypress setup

Cypress is installed in the frontend project:

- `frontend/` contains Cypress config and specs
- `cypress.config.js` uses:
  - `baseUrl: http://localhost:3000`

Precondition:
- Backend running on `http://localhost:4000`
- Frontend running on `http://localhost:3000`

---

## 4) Authentication handling (important detail)

This app uses cookie-based auth (HttpOnly JWT cookie).  
UI login can be flaky in E2E due to redirects and auth guards, so I use a reliable approach:

✅ **API-based login helper**:
- Cypress performs `POST http://localhost:4000/api/auth/login`
- cookie is set automatically
- then the test visits pages as an authenticated user

This reduces flakiness and makes tests stable and fast.

---

## 5) Cypress custom command used

**File:** `frontend/cypress/support/commands.js`

- `cy.loginByApi(email, password)`
  - sends login request to backend
  - asserts status 200
  - ensures authenticated session for subsequent UI steps

This is a common production approach to make E2E tests deterministic.

---

## 6) E2E specs implemented (what they prove)

### A) User flow: login + add to cart
**Spec:** `frontend/cypress/e2e/user_add_to_cart.cy.js`

Validates:
- user session works
- products load on store page
- clicking “Add to Cart” results in cart containing an item

Recruiter takeaway:
> “I tested the storefront → cart conversion flow end-to-end.”

---

### B) Checkout flow: checkout creates order
**Spec:** `frontend/cypress/e2e/checkout_creates_order.cy.js`

Validates:
- user can add a product to cart
- user can checkout
- order appears in `/orders`

Recruiter takeaway:
> “I validated the purchase lifecycle (cart → checkout → order) via E2E automation.”

---

### C) Admin flow: update order status from dashboard
**Spec:** `frontend/cypress/e2e/admin_updates_order_status.cy.js`

Validates:
- admin session works
- admin-only page `/admin/orders` is accessible
- admin can update status using dropdown (operational workflow)

Recruiter takeaway:
> “I validated role-based access control and admin operational workflows.”

---

## 7) How to run Cypress tests

### UI mode (interactive)
```bash
cd frontend
npx cypress open
