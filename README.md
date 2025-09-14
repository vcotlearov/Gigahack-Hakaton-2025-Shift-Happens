# FarmProfit – Agrihack Challenge @ GigaHack 2025

Welcome to FarmProfit, a full-stack hackathon project for the Agrihack challenge at GigaHack 2025! This repository contains a modern, production-grade web application for digital farm management, built to impress both users and judges.

---

## 🚀 Features
- **Modern React Frontend** (Vite, TypeScript, MUI, React Router v5)
- **.NET 9 Web API** (C#, Entity Framework, Auth0 JWT Auth)
- **Interactive Farm Map** (Leaflet, GeoJSON, drawing, area calculation)
- **Business Registration & Management** (multi-entity, edit, onboarding)
- **Profile Onboarding** (step-by-step, validation)
- **Asset Management** (land, crops, extensible)
- **Auth0 Authentication** (secure, social login ready)
- **Cloud-ready** (Docker, Azure SQL, production logging)
- **Pro-level code style** (ESLint, Prettier, strict TypeScript)

---

## 🏗️ Project Structure

```
FarmProfit/
├── FarmProfit.API/         # .NET 8 Web API backend
│   ├── Controllers/        # REST endpoints
│   ├── Models/             # EF Core models
│   ├── Middleware/         # Custom middlewares
│   ├── Program.cs          # Main entrypoint
│   └── ...
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx         # Main app router
│   │   ├── auth/           # Auth0, login, guards
│   │   ├── register/       # Business & profile registration
│   │   ├── MyBusinesses/   # Business list, details, modals
│   │   ├── maps/           # Farm field map (Leaflet)
│   │   ├── assets/         # Asset management
│   │   ├── logo/           # SVG logo component
│   │   └── ...
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── ...
├── Dockerfile              # Multi-stage build for API/frontend
└── README.md               # This file
```

---

## ⚡ Quickstart (Local Dev)

### Prerequisites
- Node.js 20+
- .NET 9 SDK
- Docker (for DB, optional)

### 1. Clone & Install
```sh
git clone https://github.com/vcotlearov/Gigahack-Hakaton-2025-Shift-Happens.git
cd Gigahack-Hakaton-2025-Shift-Happens/FarmProfit

# Frontend
cd frontend
npm install

# Backend
cd ../FarmProfit.API
# (optional) dotnet tool restore
```

### 2. Run the Frontend
```sh
cd frontend
npm run dev
# App: http://localhost:5173
```

### 3. Run the Backend
```sh
cd ../FarmProfit.API
dotnet run
# API: http://localhost:5233 (or as configured)
```

### 4. Environment
- Auth0: see `FarmProfit.API/appsettings.json` for domain/audience
- DB: Azure SQL (see connection string in `appsettings.json`)
- CORS: Preconfigured for local frontend

---

## 🧑‍💻 Developer Guide

### Frontend
- **Stack:** React 19, Vite, TypeScript, MUI, React Router v5
- **Auth:** Auth0 via `@auth0/auth0-react`
- **Map:** Leaflet + Geoman for field drawing, @turf/turf for area
- **Lint:** `npm run lint` (ESLint, Prettier)
- **Build:** `npm run build` (Vite, TypeScript)

### Backend
- **Stack:** .NET 8, C#, Entity Framework Core, Serilog
- **Auth:** JWT (Auth0)
- **DB:** Azure SQL (see connection string)
- **Logging:** Serilog (console, file)
- **API:** RESTful, ready for extension

### Docker
- Multi-stage build for API and frontend
- Ready for Azure or any cloud

---

## 🏆 Hackathon Tips
- **Demo:** Use `/register-profile` to onboard, then `/my-businesses` to add businesses.
- **Map:** Draw fields, import/export GeoJSON, see area instantly.
- **Edit:** Click three dots on a business to edit or view details.
- **Auth:** Use Auth0 social login for quick access.
- **Extensible:** Add more asset types, business logic, or analytics easily.

---

## 🤝 Team & Credits
- Team: Shift Happens
- Challenge: Agrihack @ GigaHack 2025

---

## 💡 Inspiration
Built for the future of digital agriculture. Good luck at GigaHack!
