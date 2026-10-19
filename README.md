# ServiceHub
### On-Demand Electrician Booking & Management Platform

ServiceHub connects homeowners with verified local **electricians** across Mathura, Vrindavan, Agra and Delhi NCR. A customer posts an electrical problem, nearby electricians express interest with a quote, the customer picks one, and the job closes only after both sides confirm completion.

> The platform is deliberately focused on a **single service: electrician work** (wiring, MCB tripping, fans, geysers, inverters, lighting, smart switches and home safety checks). The data model keeps a `category` field so further trades can be added later without a redesign.

---

## Key Highlights

- **Trust & verification:** admin screens every electrician (ID proof and electrical experience) before they appear anywhere.
- **Transparent pricing:** a benchmark estimate range for every electrical problem type, plus mandatory customer approval for any change to the final cost.
- **Area and pincode matching:** electricians are matched by city, locality and 6-digit pincode (no GPS or maps needed).
- **Two-sided completion:** the electrician marks the job done and the customer confirms before it is closed.
- **Spring Boot ready:** an Axios service layer with JWT interceptors that falls back to persistent local mock data when the backend is offline.

---

## Three Role Experiences

### 1. Customer (`customer@servicehub.com` / `password123`)
- **Dashboard:** quick-start electrical problems, active requests, ongoing jobs and completed work.
- **Post a request:** pick the electrical problem, describe it, set locality, pincode, schedule and budget, with an instant estimate range and a safety notice.
- **Request details:** compare interested electricians, accept one, track the job, confirm completion, and rate and review.
- **Find electricians:** filter by city, area, pincode, rating, price and specialty (fan, MCB, inverter, lighting, smart switch, geyser, safety inspection).
- **Payments, reviews and profile.**

### 2. Electrician (`provider@servicehub.com` / `password123`)
- **Dashboard:** available electrical job requests in service areas, active jobs, earnings and rating.
- **Requests:** express interest with a quote, or decline.
- **Job management:** step-by-step status updates with confirmation dialogs, and final cost revision for customer approval.
- **Services and pricing:** electrical service packages with starting prices (title suggestions from common problems).
- **Weekly schedule, service areas, earnings and reviews.**

### 3. Administrator (`admin@servicehub.com` / `password123`)
- **Dashboard:** Recharts analytics (bookings over time, demand by electrical problem, status distribution, verification status).
- **Electrician verification queue:** approve with a trust badge, or reject with a reason.
- **User directory:** search and filter accounts, block or unblock.
- **Electrical service pricing:** edit the benchmark visit price (which drives every customer estimate), pause or resume the service, and review estimate ranges per problem type.
- **Global bookings and complaints:** audit all jobs and resolve customer complaints.

---

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS**
- **React Router 7** (protected routes and role guards)
- **Lucide React** icons
- **Recharts** (admin analytics)
- **Axios** (API client with JWT bearer interceptor and local mock fallback)

---

## Getting Started

```bash
git clone https://github.com/Payal-03/ServiceHub.git
cd ServiceHub

npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run lint     # oxlint
```

Set `VITE_API_BASE_URL` to point at a real backend. The app expects `http://localhost:8080/api` by default. Mock accounts, local browser storage, and the role-switching demo tools are enabled only when `VITE_DEMO_MODE=true` is set in a local `.env` file. Copy `.env.example` to `.env` for the demo. In normal mode, authentication errors are shown instead of silently signing in with sample accounts.

---

## Demo Personas

Use the login page buttons or the role selector in the top navigation bar.

| Persona | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| Payal Sharma | `customer@servicehub.com` | `password123` | Customer |
| Raj Kumar | `provider@servicehub.com` | `password123` | Electrician |
| Ayush Admin | `admin@servicehub.com` | `password123` | Admin |

Demo mode accepts any password for these accounts, and data is stored in the browser's `localStorage`. Use **Admin → System Settings → Reset Demo Data** to restore the seed data.
