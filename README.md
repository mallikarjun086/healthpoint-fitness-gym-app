# 🏋️‍♂️ HealthPoint Fitness — Enterprise AI Gym Platform

![Spring Boot](https://img.shields.io/badge/Spring--Boot-3.2.5-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-3.4-38B2AC.svg)
![Razorpay](https://img.shields.io/badge/Razorpay-Payment%20Gateway-blueviolet.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**HealthPoint Fitness** is a world-class, enterprise-grade SaaS gym management application and multi-agent AI fitness coaching platform. Designed with **20+ years of strength & conditioning exercise science periodization** and **30+ years of principal software architectural design**, HealthPoint Fitness offers personalized hypertrophy splits, live workout execution logging, real-time volume load analytics, precision nutrition timing, and multi-portal operations for **Members**, **Trainers**, and **Admins**.

---

## ⚡ Key Highlights & Architecture

### 🎨 1. Electric Obsidian Design System
- **Curated Palette**: Obsidian Dark (`#09090B`), Electric Lime (`#C9FF00`), Cyber Blue (`#00F0FF`), and Dark Surface cards (`#121215`).
- **Glassmorphism**: Glass cards with `backdrop-blur-xl`, radiant glowing borders (`glow-border`), animated pill badges (`badge-lime`, `badge-blue`), and glowing gradient typography.
- **Fluid Micro-Animations**: Smooth page transitions via Framer Motion, hover-scale cards, and active tab indicators.

---

### ⏱️ 2. Live Interactive Workout Execution Logger
- **Real-Time Logger Modal**: Set-by-set checkoffs, weight (kg) & rep inputs, target RPE (8-9), and tempo recommendations (`3-0-1-0`).
- **Built-in Rest Countdown Timer**: Automated 90s/60s rest countdown timer with Play/Pause/Reset controls and audio-visual completion alerts.
- **Session History Logging**: Saves completed sets, volume load, duration, and calories burned to user history.

---

### 📊 3. Interactive Progression Analytics (Recharts)
- **Volume Load Progress Chart**: Live AreaChart tracking total volume load ($\text{Weight} \times \text{Reps}$) over time with an electric lime gradient glow on the Member Dashboard.
- **Daily Macro Compliance Meters**: Real-time progress bars for Protein (2.2g/kg LBM), Carbs (glycogen replenishment), Healthy Fats (hormonal health), and Hydration (3.8L + electrolytes).
- **Executive Admin Analytics**: MRR growth trends and active member scale charts connected to `/api/admin/stats` backend APIs.

---

### 🧬 4. Scientific Hypertrophy & Precision Nutrition Engine
- **Periodized Training Splits**: Generates 7-day splits tailored to primary goals (*Aesthetic, Competition Prep, Strength Training, Powerlifting, Sports Performance*) and experience levels (*Beginner, Intermediate, Advanced*).
- **Nutrient Partitioning & Anabolic Windows**: Meal-by-meal timing breakdown (Pre-workout, Post-workout, Breakfast, Lunch, Dinner) with export to PDF/TXT receipt.
- **HD Video Execution Library**: Filterable exercise library by muscle group (*Chest, Back, Legs, Shoulders, Arms, Core*) with video modal, key coaching cues, and common mistakes callouts.

---

### 👥 5. Role-Based Access Control (RBAC) & Portals

| Portal | Route | Key Features Unlocked |
| :--- | :--- | :--- |
| **Member** | `/member/*` | Interactive Workout Logger, Strength Progression Analytics, AI Coach Assistant, Daily Macro Meters, Billing History |
| **Trainer** | `/trainer/*` | Client Coaching Roster, Client Attendance Tracking, Custom Plan Assignments |
| **Admin** | `/admin/*` | Executive Control Center, MRR Financial Analytics, Member Status Management, Staff Directory |

---

## 🔑 Demo Access Credentials

The database automatically seeds demo accounts on backend startup:

| Role | Email | Password | Default Target Route |
| :--- | :--- | :--- | :--- |
| **Member** | `user@hp.com` | `password123` | `/member/dashboard` |
| **Trainer** | `trainer@hp.com` | `password123` | `/trainer/dashboard` |
| **Admin** | `admin@hp.com` | `password123` | `/admin/dashboard` |

---

## 🛠️ Tech Stack Overview

### Backend Architecture
- **Framework**: Spring Boot 3.2.5
- **Security**: Spring Security, JWT (Role-Based Claims), BCrypt Hashing
- **Database**: H2 (In-Memory for Demo) / PostgreSQL 17 + Spring Data JPA
- **Payment Gateway**: Razorpay Java SDK (HMAC Signature Verification)
- **Utilities**: Jackson JSON, Lombok, Java 17

### Frontend Architecture
- **Framework**: React 18 (Vite 5)
- **Styling**: Tailwind CSS + Custom Obsidian Glassmorphism System
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons & Notifications**: Lucide React + Sonner

---

## 📂 Project Repository Structure

```text
healthpoint-fitness/
├── backend/                        # Spring Boot Application
│   ├── src/main/java/com/healthpoint/
│   │   ├── config/                # SecurityConfig, JwtAuthenticationFilter
│   │   ├── controller/            # AuthController, GoalProfileController, AdminController, PaymentController
│   │   ├── dto/                   # Data Transfer Objects
│   │   ├── entity/                # JPA Entities (User, UserProfile, Payment)
│   │   ├── repository/            # Spring Data Repositories
│   │   ├── service/               # GoalPlanService, AuthService, PaymentService
│   │   └── util/                  # JwtUtil Token Generator
│   └── src/main/resources/
│       └── application.yaml       # Configuration & Database Settings
└── frontend/                       # Vite + React Application
    ├── src/
    │   ├── api/                   # Axios API Gateway & Interceptors
    │   ├── components/
    │   │   ├── ai/                # Floating AiChatWidget & AiInsightCard
    │   │   ├── layout/            # Sidebar, Navbar
    │   │   └── member/            # WorkoutLoggerModal
    │   ├── context/               # AuthContext Session State
    │   └── pages/
    │       ├── admin/             # AdminDashboard, MemberManagement, RevenueAnalytics
    │       ├── member/            # MemberDashboard, WorkoutPlans, DietPlans, VideoLibrary, Payments
    │       ├── public/            # LandingPage, LoginPage, RegisterPage
    │       └── trainer/           # TrainerDashboard
    ├── tailwind.config.js         # Design System Tokens
    └── index.html
```

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- **JDK 17+**
- **Node.js (v18+) & npm**
- **Maven 3.8+**

---

### 2. Launch Backend Server
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Build and start the Spring Boot API server:
   ```bash
   mvn spring-boot:run
   ```
3. Backend starts at `http://localhost:8085`.
   - H2 Console available at `http://localhost:8085/h2-console` *(JDBC URL: `jdbc:h2:mem:healthpointdb`)*.

---

### 3. Launch Frontend Web App
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Frontend starts live at `http://localhost:5173`.

---

## 📡 REST API Gateway Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token with role claims |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |
| `GET` | `/api/goals/my-plan` | Member | Fetch personalized 7-day split & nutrition JSON |
| `POST` | `/api/goals/setup` | Member | Calculate TDEE, macros, & generate periodized workout plan |
| `POST` | `/api/workout/logs/add` | Member | Log completed workout session & set metrics |
| `GET` | `/api/admin/stats` | Admin | Retrieve live system MRR, member scale, & payment count |
| `GET` | `/api/admin/users` | Admin | Fetch full member directory |
| `POST` | `/api/payments/create-order` | Member | Create Razorpay order ID |
| `POST` | `/api/payments/verify` | Member | Verify Razorpay HMAC signature & upgrade tier |

---

## 📄 License
This project is licensed under the **MIT License**.
