# 🗳️ Mission 2028 — Constituency Command Center

A field-ready web app to run a grassroots development + public-life mission in the **Sirpur Kaghaznagar** assembly constituency (Telangana, India) and across the wider state.

## 📋 Overview

This app gives constituency teams a single place to track **people, funding, programs, activities, and team** — and surfaces progress as **leaderboards and scoreboards** so momentum across every mandal and district is visible at a glance.

## 🗂️ Features

| Module | Description |
|---|---|
| 📊 **Dashboard** | Real-time overview of all KPIs and top leaderboard snapshot |
| 🏆 **Leaderboard** | Mandal rankings scored on people, programs, activities and funding |
| 👥 **People** | Track constituents, volunteers, beneficiaries and local leaders |
| 📋 **Programs** | Manage development programs and welfare schemes with status updates |
| 📅 **Activities** | Log meetings, events, outreach, surveys and inaugurations |
| 💰 **Funding** | Track fund allocations, releases and expenditure per mandal |
| 🤝 **Team** | Manage field staff, volunteers and mandal in-charges |

## 🏅 Leaderboard Scoring

Each mandal is scored on:

```
Score = (People × 5) + (Programs × 20) + (Completed Programs × 30)
      + (Completed Activities × 15) + (Funds Deployed per ₹1L × 2)
```

## 🗺️ Constituency

- **Assembly Constituency:** Sirpur Kaghaznagar
- **District:** Komaram Bheem Asifabad
- **State:** Telangana, India
- **Mandals covered:** Sirpur (T), Kaghaznagar, Tiryani, Dahegaon, Rebbena, Bejjur

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **React Router v7** (client-side routing)
- **localStorage** (offline-first data persistence — no backend required)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## �� Mobile-Ready

The app is responsive and works on smartphones and tablets, making it suitable for field use in constituencies with limited connectivity.

## 💾 Data Persistence

All data is stored in the browser's **localStorage** — no internet connection or backend server required for use in the field. Data persists across page refreshes. Each device maintains its own copy.
