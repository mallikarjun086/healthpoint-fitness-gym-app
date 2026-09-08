# 🏋️‍♂️ HealthPoint Fitness — Top-1% Athletic OS & Biomechanics Platform

[![Spring Boot](https://img.shields.io/badge/Spring--Boot-3.2.5-brightgreen.svg?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?logo=react&logoColor=white)](https://react.dev/)
[![React Three Fiber](https://img.shields.io/badge/R3F-Three.js-black.svg?logo=three.js&logoColor=white)](https://docs.pmnd.rs/react-three-fiber)
[![Framer Motion](https://img.shields.io/badge/Framer--Motion-11.0-purple.svg?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **HealthPoint Fitness** is a world-class, top-1% athletic operating system uniting athlete hypertrophy splits, 3D interactive anatomical biomechanics, live progressive overload telemetry, wearable HRV readiness scoring, and automated gym facility access. Engineered with an Apple/Whoop-grade obsidian titanium aesthetic, Framer Motion spring physics, and Spring Boot 3 + PostgreSQL microservice architecture.

---

## ✨ Signature Highlights & Features

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      HEALTHPOINT ATHLETIC PLATFORM                          │
├─────────────────────────┬─────────────────────────┬─────────────────────────┤
│ 🧍 3D ANATOMICAL BODY   │ 👤 MEMBER PERFORMANCE   │ 🏋️ TRAINER & SAFETY     │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ • React Three Fiber 360°│ • Daily Readiness Score │ • Flagged Safety Queue  │
│   Orbit Muscle Model    │   (HRV, RHR, Sleep)     │   (Pain & Form Faults)  │
│ • Camera Push-In &      │ • Periodized Split      │ • Client Coaching       │
│   Anatomical Hotspots   │   Generator & Logger    │   Roster & Macro Builder│
│ • Progress Heatmap Mode │ • Exercise Biomechanics │ • 3D Coaching Load      │
│   (Training Recency)    │   Modal & Safe Angles   │   Distribution Viz      │
│ • WebGL 2D Vector       │ • Wearable Device Sync  │ • Session Scheduler     │
│   Fallback Engine       │   & AES-256 Data Purge  │   & Direct Chat         │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

---

## 🎨 Design Foundation & Aesthetic System

- **Obsidian Titanium Theme**: Base obsidian canvas (`#08090B`), matte surface hierarchy (`#111216`, `#131419`, `#17191F`), and Royal Indigo accent (`#4F46E5` / `#6366F1`) — zero generic neon or default drop shadows.
- **Typography Scale**: Display headlines powered by `Outfit` (`display-2xl`, `display-xl`), body and UI text powered by `Inter`.
- **Tactile Motion Physics**: Framer Motion spring definition tokens (`stiff`, `gentle`, `bouncy`) enforcing non-linear tactile physical responses on every button press, hover card, modal sheet, and route transition.
- **Elevation & Depth**: Multi-layered ambient + focused drop shadows (`shadow-card`, `shadow-elevated`, `shadow-modal`). Frosted glass restricted to fixed hero headers, floating docks, and modal backdrops.

---

## 🧍 3D Interactive Human Body (Signature Centerpiece)

The primary way users browse workouts and track training volume:

1. **360° Orbit & Camera Focus**: Full 360° rotation (drag desktop / touch mobile), subtle idle auto-rotation that halts smoothly upon interaction, and 180° front/back flip controller.
2. **Camera Push-In**: Clicking any muscle group lerps the camera into focus on those 3D coordinates and opens the connected `MuscleGroupPanel`.
3. **Selection & Progress Heatmap**: Toggle between multi-select workout building and live training recency heatmap (cool blue = unworked, warm indigo/gold = recently trained).
4. **Resilience & Fallback**: WebGL capability detector automatically switches to `BodyModel2DFallback.jsx` (vector SVG diagram with interactive hotspot dots) on unsupported environments.

---

## 🔑 Default Demo Credentials

The database automatically seeds demo accounts for instant testing:

| Role | Email | Password | Default Target Route |
| :--- | :--- | :--- | :--- |
| **Member** | `user@hp.com` | `password123` | `/member/dashboard` |
| **Trainer** | `trainer@hp.com` | `password123` | `/trainer/dashboard` |
| **Admin** | `admin@hp.com` | `password123` | `/admin/dashboard` |

---

## 🏗️ Architecture & Tech Stack

```text
                            ┌────────────────────────────┐
                            │    Client Web Browsers     │
                            └─────────────┬──────────────┘
                                          │
                           HTTPS (Port 443 / Port 80)
                                          │
                                          ▼
                ┌──────────────────────────────────────────────────┐
                │ Frontend: React 18 + Three.js + Framer Motion    │
                │        (Served via Vercel / Nginx Alpine)        │
                └─────────────────────────┬────────────────────────┘
                                          │ /api/*
                                          ▼
                ┌──────────────────────────────────────────────────┐
                │   Backend: Spring Boot 3.2.5 (Java 21) REST API  │
                │       (Spring Security + JWT Authentication)     │
                └────────────┬───────────────────────┬─────────────┘
                             │                       │
                             ▼                       ▼
                ┌─────────────────────────┐     ┌────────────────────────┐
                │   PostgreSQL Database   │     │   External Providers:  │
                │   (Flyway Migrations)   │     │ • Razorpay Gateway     │
                └─────────────────────────┘     │ • OpenAI GPT-4o Mini   │
                                                └────────────────────────┘
```

### Backend
- **Framework**: Spring Boot 3.2.5 (Java 21)
- **Security**: Spring Security 6 with stateless JWT Bearer token authentication & BCrypt hashing
- **Database**: PostgreSQL 15+ / Flyway automated schema migrations (`V1` through `V5`)
- **Payments**: Razorpay Java SDK with cryptographic HMAC-SHA256 signature verification
- **Testing**: JUnit 5, MockMvc, AssertJ

### Frontend
- **Framework & Build**: React 18 + Vite 5 + Code-Splitting
- **3D Graphics**: React Three Fiber (`@react-three/fiber`) + Drei (`@react-three/drei`) + Three.js
- **Animations**: Framer Motion 11 (Spring easing & Shared layout `layoutId`)
- **Styling**: Tailwind CSS 3.4 + Custom Design Tokens (`designTokens.js`)
- **Data Viz**: Custom Dark Recharts (MRR telemetry, volume curves, coaching load)
- **Notifications & Icons**: Sonner Toast notifications & Lucide React icons

---

## ⚡ Quick Start: Local Development

### Prerequisites
- **Java 21 JDK** (Eclipse Temurin / OpenJDK)
- **Node.js 18+** & **NPM**
- **Maven 3.8+** (or use `./mvnw`)

### 1. Start Backend API
```bash
cd backend
mvn clean spring-boot:run
```
*API boots at `http://localhost:8085`. Uses in-memory H2 PostgreSQL-compatible mode by default with automatic schema seeding.*

### 2. Start Frontend App
```bash
cd frontend
npm install
npm run dev
```
*App launches at `http://localhost:5173`.*

---

## 🚀 Cloud Deployment Guide

### Deploying to Vercel (Frontend) & Render (Backend)
1. Push code to GitHub repository (`mallikarjun086/healthpoint-fitness-gym-app`).
2. **Frontend (Vercel)**: Import repo, set Root Directory to `frontend`, Framework to `Vite`, Build Command to `npm run build`, and `VITE_API_URL` to backend URL.
3. **Backend (Render / Railway)**: Set Root Directory to `backend`, Runtime to Docker/Java 21, and configure PostgreSQL connection string (`SPRING_DATASOURCE_URL`).

Refer to [`DEPLOYMENT.md`](file:///c:/Users/Mallikarjun%20Gala/OneDrive/Desktop/healthpoint-fitness/DEPLOYMENT.md) for step-by-step production setup.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
