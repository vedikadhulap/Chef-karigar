# Chef-Karigar Staff Agency

A full-stack-ready web application for managing hospitality staff placements. It connects **Businesses** (restaurants, cafes) with **Staff** (chefs, waiters, and other hospitality workers) through an **Agency** that manages matching, commissions, and operations — with an optional **External Sales Partner** role for lead generation.

---

## Features

- **Role-based dashboards** — separate views for Business, Staff, Agency, and External Sales Partner
- **Job management** — post, edit, and track jobs with status (Draft / Open / Filled / Cancelled)
- **Staff management** — register, verify, and rate staff members with full work history
- **Match bundles** — pitch candidate shortlists to businesses and track hiring pipeline
- **Commission & transaction tracking** — automatic fee/commission calculation per placement
- **Referral system** — staff and sales partners earn bonuses for approved referrals
- **Grievance modal** — structured feedback and dispute submission
- **Chat hub** — in-app messaging between roles
- **Map component** — location-based staff/job discovery
- **Offline sync** — queues actions locally and flushes them automatically when back online
- **Dark / Light theme toggle**
- **Animated UI** using Framer Motion

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

## Project Structure

```
├── components/          # All UI views and shared components
│   ├── AgencyView.tsx   # Agency dashboard (support / sales / finance sub-roles)
│   ├── BusinessView.tsx # Business dashboard — post jobs, view matches
│   ├── StaffView.tsx    # Staff dashboard — browse jobs, register profile
│   ├── ExternalSalesView.tsx # Sales partner leads & commissions
│   ├── ChatHub.tsx      # Messaging hub
│   ├── MapComponent.tsx # Location map
│   └── ...
├── context/             # React context providers (ThemeContext)
├── hooks/               # Custom hooks (useOfflineSync)
├── services/            # API service layer (api.ts)
├── types.ts             # Shared TypeScript types and enums
├── constants.ts         # App-wide constants and mock data
└── App.tsx              # Root component with routing
```

---

## User Roles

| Role | Description |
|---|---|
| `BUSINESS` | Restaurants / cafes — post jobs, review candidates, hire staff |
| `STAFF` | Job seekers — browse openings, register profile, track applications |
| `AGENCY` | Internal team — manage staff, create match bundles, handle finances |
| `EXTERNAL_SALES` | Sales partners — generate leads and earn placement commissions |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chef-karigar-staff-agency.git
   cd chef-karigar-staff-agency
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview the production build locally |

---

## Key Constants

Defined in [constants.ts](constants.ts):

| Constant | Value | Description |
|---|---|---|
| `INITIAL_PROCESS_FEE` | ₹100 | Upfront processing fee |
| `ACCOUNT_OPENING_FEE` | ₹500 | One-time account opening fee |
| `AGENCY_COMMISSION_PERCENT` | 40% | Agency's share of placement commission |
| `BASE_COMMISSION_PERCENT` | 50% | Base commission rate |
| `REFERRAL_BONUS_AMOUNT` | ₹500 | Bonus paid per approved referral |
| `SALES_COMMISSION_AMOUNT` | ₹1500 | Commission paid to sales partners per hire |
| `CONTRACT_DURATION_MONTHS` | 6 | Default contract length in months |

---

## License

This project is private. All rights reserved.
