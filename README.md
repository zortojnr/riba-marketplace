📦 RIBA Frontend — MVP
Quick Menu / Cart Creator • Storefront Builder • React + Vite + Tailwind + Framer Motion

RIBA is a no-code storefront builder that enables small businesses to create a digital menu, accept orders, share a link/QR, and receive payments (Paystack/Flutterwave). This repository contains the frontend for the RIBA MVP built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

🚀 Features (MVP)
Public Storefront

Mobile-first digital menu

Category filter tabs

Product list & product modal

Add to cart (with animations)

Multi-currency display (₦ as primary, $ optional secondary)

Shareable link + QR code

PWA install support

Cart & Checkout

Slide-over cart drawer

Customer checkout form (name, phone, address/pickup)

Payment selection: Pay Now (Paystack/Flutterwave) or Pay on Pickup/Delivery

Order summary + order success screen

Product Management (Owner)

Add / edit / delete products

Upload images

Set price, description, category

Toggle available/out-of-stock

Inventory count (basic MVP)

Store Builder / Settings

Store logo upload

Theme color selection

Editable share link (slug)

QR download

Notification preferences (email, SMS, WhatsApp)

Business Dashboard

Orders list with statuses

Sales summary

Basic analytics (visits, orders, most viewed, top selling)

User Authentication

Email login

Phone login

Google OAuth

Update profile

Multiple stores under one user

Plans & Subscription

Free / Starter / Premium

Product limits and feature limits enforced on the frontend

PWA Support

Install to home screen

Offline menu viewing

Cached assets

Optimized mobile UX

🧱 Tech Stack
Layer	Tools
Framework	React 18, TypeScript, Vite
Styling	Tailwind CSS, CSS variables, custom utility classes
Animations	Framer Motion
State Management	React Context, React Query / SWR
Forms	React Hook Form + Zod
Routing	React Router
Payments	Paystack JS SDK, Flutterwave, Pay on Pickup
PWA	Vite-plugin-pwa
Icons	Lucide Icons / HeroIcons
Code Quality	ESLint, Prettier
📂 Folder Structure
riba-frontend/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── storefront/
│   │   ├── admin/
│   │   ├── cart/
│   │   └── ui/
│   │
│   ├── pages/
│   │   ├── Storefront/
│   │   ├── Dashboard/
│   │   ├── Auth/
│   │   ├── Settings/
│   │   └── Checkout/
│   │
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   ├── api/
│   ├── assets/
│   ├── routes/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── logo.svg
│
├── .env.example
├── package.json
├── README.md
└── tsconfig.json

🔧 Getting Started
Prerequisites

Make sure you have installed:

Node.js 18+

npm (default) or pnpm (optional)

If you want pnpm:

npm install -g pnpm

1️⃣ Clone the repo
git clone https://github.com/<your-username>/riba-frontend.git
cd riba-frontend

2️⃣ Install dependencies
npm install

3️⃣ Set environment variables

Create .env file based on .env.example:

VITE_API_URL=http://localhost:5000
VITE_PAYSTACK_KEY=pk_test_xxxx
VITE_FLUTTERWAVE_KEY=FLWPUBK_TEST-xxxx
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
VITE_PWA_NAME=RIBA
VITE_PWA_THEME_COLOR=#0B6E4F

4️⃣ Run the development server
npm run dev


Then visit:

http://localhost:5173

🧪 Testing

Run unit tests:

npm run test


Tests cover:

Cart state

Checkout form validation

Product card rendering

API hooks fallback behavior

🧱 Build for Production
npm run build


Generated files will appear in:

/dist

🚨 API Endpoints (Expected From Backend)
Auth

POST /api/auth/signup

POST /api/auth/login

Store

GET /api/stores/:slug

PUT /api/stores/:id

Products

GET /api/stores/:id/products

POST /api/stores/:id/products

PATCH /api/products/:id

Orders

POST /api/stores/:id/orders

GET /api/stores/:id/orders

Payments

POST /api/payments/paystack/initialize

POST /api/payments/flutterwave/initialize

Analytics

POST /api/analytics/event

🎨 Design Guidelines
Colors

Primary: #0B6E4F

Accent: #F59E0B

Muted: #6B7280

Background: #FFFFFF

Success: #10B981

Danger: #EF4444

Typography

Inter / Poppins

h1: 28px • h2: 22px • body: 16px • small: 13px

Components Use Framer Motion For:

Add to cart feedback

Slide-in modals

Page transitions

Button interactions

📦 Deployment
Deploy to Vercel
vercel deploy

Deploy to Netlify
netlify deploy

Deploy to Cloudflare Pages
npm run build
wrangler pages publish dist
