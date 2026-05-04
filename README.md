# Bookstore Backend (Express + Prisma + Stripe)

REST API for the Bookstore app. Built with **Express (TypeScript)**, **Prisma**, **PostgreSQL**, and **Stripe Checkout**.

## Requirements

- Node.js 18+ (recommended)
- npm
- PostgreSQL database (local or hosted)
- Stripe account (test mode is fine)
- Optional: Stripe CLI (for local webhook testing)

## Getting started

```bash
cd Bookstore-app-backend
npm install
```

### Environment variables

Create a `.env` file in `Bookstore-app-backend/` (see `.env.example`).

**Never commit your real `.env`** (it contains secrets).

### Prisma / Database

Generate the Prisma client:

```bash
npx prisma generate
```

Run migrations (choose one based on your workflow):

```bash
# local development (creates migrations interactively)
npx prisma migrate dev

# production / CI (applies existing migrations)
npx prisma migrate deploy
```

Seed sample books:

```bash
npx prisma db seed
```

### Run the server

```bash
# dev (ts-node + nodemon)
npm run dev

# build + start
npm run build
npm start
```

Server listens on `PORT` (default in `.env.example` is `8000`).

## API overview

Base URL: `http://localhost:<PORT>`

### Auth / User

- `POST /user/signup` — create user
- `POST /user/login` — login (returns JWT)
- `GET /user/:id` — get user profile
- `POST /user/update-profile/:id` — update profile
- `GET /user/cart/:id` — get user cart items
- `GET /user/wishlist/:id` — get wishlist items (includes `book`)

### Books

- `GET /books` — list books (supports filtering)
  - Common query params: `limit`, `genre`, `minPrice`, `maxPrice`, `minRating`, `featured`, `bestSellers`, `sort`
  - `sort` currently supports at least `oldest` (newest is default)
- `GET /books/:id` — get book by id
- `GET /books/featured` — featured books
- `GET /books/bestsellers?limit=4` — bestsellers
- `GET /books/genre/:genre?limit=8` — books by genre
- `POST /books/wishlist/:id` (auth) — add book to wishlist
- `DELETE /books/wishlist/:id` (auth) — remove book from wishlist

### Search

- `GET /search?q=<query>` — search by title/author/description/genre

### Cart (auth required)

All `/cart/*` routes require `Authorization: Bearer <token>`.

- `GET /cart` — list cart items
- `POST /cart/add` — add to cart (body: `{ "bookId": "<uuid>" }`)
- `DELETE /cart/remove/:id` — remove cart row by id

## Payments (Stripe Checkout)

This backend creates Stripe Checkout sessions and updates orders via Stripe webhooks.

### Payment routes (auth required)

- `POST /payment/create-checkout-session`
  - Creates an `Order` + `OrderItem` rows from the current cart
  - Returns `{ url, sessionId, orderId }`
- `GET /payment/session/:sessionId`
  - Fetch an order by Stripe session id (scoped to the authenticated user)
- `GET /payment/orders`
  - List authenticated user's orders (newest first)

### Webhook route (Stripe → backend)

- `POST /payment/webhook`
  - **Must receive the raw request body** (already configured in `src/server.ts`)
  - Handles:
    - `checkout.session.completed`
    - `checkout.session.async_payment_succeeded`
    - `checkout.session.expired`
    - `checkout.session.async_payment_failed`
  - Updates `Order.status` and performs side effects (stock decrement, cart clearing) idempotently.

### Local webhook testing (recommended)

1) Install Stripe CLI and login:

```bash
stripe login
```

2) Forward events to your local server:

```bash
stripe listen --forward-to localhost:8000/payment/webhook
```

3) Copy the printed webhook signing secret into `.env` as `STRIPE_WEBHOOK_SECRET`.

4) Use the frontend to run a Checkout flow. The success page polls `GET /payment/session/:sessionId` until the webhook marks the order as `paid`.

## CORS / Client URL

- Allowed origins are configured in `src/server.ts`.
- Stripe success/cancel redirects are controlled via `CLIENT_URL` (example: `http://localhost:5173`).

## Project structure (high level)

- `src/server.ts` — Express app + routes + webhook raw-body middleware
- `src/routes/*` — route definitions
- `src/controllers/*` — route handlers
- `src/lib/prisma.ts` — Prisma client
- `src/lib/stripe.ts` — Stripe client singleton
- `prisma/schema.prisma` — DB schema
- `prisma/seed.ts` — seed script

