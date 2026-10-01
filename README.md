# SERVICEHUB
### Local Service Booking & Management Platform

ServiceHub is an on-demand local service marketplace connecting homeowners with verified local service providers (Electricians, Plumbers, AC Mechanics, Laptop Specialists, and Deep Cleaners) across Mathura, Vrindavan, Agra, and Delhi NCR.

---

## 🌟 Key Highlights & Design Direction

- **Trust & Verification**: Mandatory administrative credential screening before any provider appears in discovery.
- **Structured State Machine**: PENDING → ACCEPTED → SCHEDULED → ON_THE_WAY → IN_PROGRESS → COMPLETED → PAID → REVIEWED.
- **Transparent Pricing**: Category benchmark pricing with mandatory customer approval for any final cost adjustment.
- **In-System Settlement**: Recorded payments with receipts and verified feedback.
- **Area & Pincode Matching**: Precise territory matching by City, Locality, and 6-digit Postal Pincode (non-GPS/maps dependent).
- **Spring Boot REST Ready**: Pre-configured Axios service layer with automatic interactive local fallback when backend is offline.

---

## 👥 Three Complete Role Experiences

### 1. Customer (`customer@servicehub.com` / `password123`)
- **Dashboard**: Upcoming appointments, active progress, quick service cards, stats.
- **Service Discovery**: Filter by City, Locality, Pincode, Category, Rating, and Price.
- **Provider Profiles**: Verified badge, experience, pricing, weekly schedule, and customer reviews.
- **Multi-Step Booking**: 6-step guided booking with problem description and slot selection.
- **Booking Details**: Visual status timeline stepper, final price revision approval, in-system payment recording, and 5-star review submission.
- **Payments & Receipts**: Itemized settlement ledger.
- **Reviews & Profile**: Saved address and contact preferences.

### 2. Service Provider (`provider@servicehub.com` / `password123`)
- **Dashboard**: Today's dispatch schedule, active jobs, KPIs, earnings, rating.
- **Incoming Requests**: Accept / Decline with optional rejection reason.
- **Booking Management**: Strict sequential state transitions with confirmation dialogs:
  - *SCHEDULED → ON THE WAY → IN PROGRESS → COMPLETED*
- **Final Cost Revision**: Submit diagnosed costs and replacement spare part reasons for customer authorization.
- **Offered Services**: Add, edit, pause, and price trade packages.
- **Weekly Schedule**: Toggle availability and working hours per weekday.
- **Service Areas**: Add coverage localities and postal pincodes.
- **Earnings & Reviews**: Ledger breakdown and rating distribution chart.

### 3. Administrator (`admin@servicehub.com` / `password123`)
- **Dashboard**: Recharts data visualizations (Bookings Over Time, Demand by Category, Booking Status Distribution, Provider Verification Status).
- **Provider Verification Queue**: Screen applications, verify with official trust badge, or reject with formal reason.
- **User Directory**: Search and filter Customer, Provider, and Admin accounts; block / unblock with confirmation.
- **Category Management**: Create, edit, and toggle trade categories and base benchmarks.
- **Global Bookings**: Audit ledger of all platform orders with full timeline drawer.
- **Grievances & Complaints**: Review customer complaints, assign priorities, record admin investigation notes, and resolve tickets.

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** (Custom SaaS design system, glassmorphism, Inter typography)
- **React Router 7** (Protected routes & role guards)
- **Lucide React Icons**
- **Recharts** (Administrative operations analytics)
- **Axios** (API client with JWT bearer interceptors and persistent local mock fallback)

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Payal-03/MINIproject.git
cd MINIproject

# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## 🔑 Demo Personas & One-Click Testing

Use the top navigation bar's **Role: [Selector]** dropdown or the login page buttons:

| Persona | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Payal Sharma** | `customer@servicehub.com` | `password123` | Customer |
| **Raj Kumar** | `provider@servicehub.com` | `password123` | Provider |
| **Ayush Admin** | `admin@servicehub.com` | `password123` | Admin |
