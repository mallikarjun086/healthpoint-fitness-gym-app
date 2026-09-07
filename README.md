# 🏋️‍♂️ HealthPoint Fitness — Enterprise AI Gym Platform

[![Spring Boot](https://img.shields.io/badge/Spring--Boot-3.2.5-brightgreen.svg?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **HealthPoint Fitness** is a world-class, enterprise SaaS gym management ecosystem and AI-powered fitness coaching platform. Engineered with **20+ years of strength & conditioning periodization science** and **modern cloud-native microservice architecture**, it delivers real-time hypertrophy splits, live workout telemetry, precision nutrient timing, digital QR check-ins, automated billing, and dedicated operational portals for **Members**, **Trainers**, and **Admins**.

---

## 📸 Key Features & Capabilities

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HEALTHPOINT FITNESS PLATFORM                          │
├─────────────────────────┬─────────────────────────┬─────────────────────────┤
│    👤 MEMBER PORTAL     │   🏋️ TRAINER PORTAL     │    🛡️ ADMIN CONTROL     │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ • Interactive Workout   │ • Client Coaching Roster│ • Executive Analytics   │
│   Execution Logger      │ • Dynamic Diet Plan     │   & MRR Telemetry       │
│ • Strength & Volume     │   Builder & Macros      │ • Member CRM & Role     │
│   Progression Analytics │ • Session Scheduling &  │   Management Directory  │
│ • AI Periodized Plan    │   Weekly Calendar Grid  │ • Lead Conversion &     │
│   Wizard (TDEE/Macros)  │ • Direct Messaging &    │   Walk-in Inquiries     │
│ • Digital QR Pass &     │   Client Progression    │ • Media Tutorial Vault  │
│   Attendance Timeline   │   Telemetry View        │   & Content Operations  │
│ • Indian/Global Food &  │                         │ • Subscription & Addon  │
│   Water Hydration Log   │                         │   Tier Revenue Engine   │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

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
                │     Frontend: React 18 + Tailwind CSS + Vite     │
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
- **Database**: PostgreSQL 15+ / Flyway automated schema migrations (`V1__init_schema.sql`, `V2__seed_initial_data.sql`)
- **Payments**: Razorpay Java SDK with cryptographic HMAC-SHA256 signature verification
- **Documentation & Testing**: JUnit 5, MockMvc, AssertJ

### Frontend

- **Framework**: React 18 with Vite 5
- **Styling**: Tailwind CSS 3.4 with Electric Obsidian design tokens & glassmorphism
- **Charts & Telemetry**: Recharts (Area, Bar, Pie charts with customized glowing gradients)
- **Routing & State**: React Router DOM v6 + React Context API with persistent localStorage
- **Notifications & Icons**: Sonner Toast notifications & Lucide React icons

---

## ⚡ Quick Start: Local Development

### Prerequisites

- **JDK 21** or **JDK 17**
- **Node.js 18+** & **npm**
- **Maven 3.8+** (or use included wrapper)

### 1. Start the Backend API (Port 8085)

```bash
cd backend
mvn clean spring-boot:run
```

- API Base URL: `http://localhost:8085/api`
- Public Health Check: `http://localhost:8085/api/public/health`
- Embedded H2 Console: `http://localhost:8085/h2-console` (JDBC URL: `jdbc:h2:mem:healthpointdb`)

### 2. Start the Frontend App (Port 5173)

```bash
cd frontend
npm install
npm run dev
```

- Web Application: `http://localhost:5173`

---

## 🐳 Docker Deployment

The application is pre-configured with multi-stage Dockerfiles and Docker Compose orchestration:

```bash
# 1. Clone environment variables template
cp .env.example .env

# 2. Start all services (PostgreSQL, Spring Boot Backend, Nginx Frontend)
docker-compose up --build -d

# 3. Check status
docker-compose ps
```

- Web UI: `http://localhost` (or `http://localhost:5173`)
- Backend API: `http://localhost:8085/api`

---

## 🆓 100% FREE Cloud Deployment Guide (Zero Cost)

Deploy the entire full-stack app to the cloud for **$0.00 / Month** with **no credit card required**:

### 1. Free PostgreSQL Database on [Neon.tech](https://neon.tech)

1. Sign up at [Neon.tech](https://neon.tech) using GitHub.
2. Click **"New Project"** → Name: `healthpoint-fitness` → Create.
3. Under **Connection Details**, copy your JDBC connection parameters (`host`, `database`, `user`, `password`).

### 2. Free Spring Boot Backend on [Render.com](https://render.com)

1. Sign up at [Render.com](https://render.com) using GitHub.
2. Click **"New +"** → **"Web Service"** → Select your repository.
3. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Instance Type**: **Free**
4. Add Environment Variables:
   - `PORT`: `8085`
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<neon-host>:5432/<database>?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME`: `<neon-username>`
   - `SPRING_DATASOURCE_PASSWORD`: `<neon-password>`
   - `SPRING_DATASOURCE_DRIVER`: `org.postgresql.Driver`
   - `FLYWAY_ENABLED`: `true`
   - `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`
   - `CORS_ALLOWED_ORIGINS`: `*`
5. Click **"Create Web Service"**. Your live API URL will be: `https://<your-backend>.onrender.com`.

### 3. Free React Frontend on [Vercel](https://vercel.com)

1. Sign up at [Vercel.com](https://vercel.com) using GitHub.
2. Click **"Add New..."** → **"Project"** → Select this repository.
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, set:
   - `VITE_API_URL` = `https://<your-backend>.onrender.com/api`
5. Click **"Deploy"**. Your live app URL will be: `https://<your-app>.vercel.app`.

---

## 📡 REST API Gateway Reference

| HTTP Method | Route Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/public/health` | Public | Cloud monitoring & uptime health check |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile & role |
| `GET` | `/api/goals/my-plan` | Member | Get personalized training split & nutrition JSON |
| `POST` | `/api/goals/setup` | Member | Calculate TDEE, macros, & generate workout plan |
| `POST` | `/api/workout/logs/add` | Member | Log workout session with set telemetry |
| `GET` | `/api/classes/upcoming` | Public / Member | Browse upcoming fitness group sessions |
| `POST` | `/api/classes/book` | Member | Reserve slot for class session |
| `GET` | `/api/nutrition/summary/user/{id}` | Member | Get daily calories & macro compliance |
| `POST` | `/api/nutrition/log` | Member | Log food entry from Indian/Global library |
| `GET` | `/api/trainer/clients` | Trainer / Admin | Retrieve assigned athlete roster |
| `POST` | `/api/trainer/diet/assign` | Trainer | Assign customized diet plan to member |
| `GET` | `/api/admin/stats` | Admin | Real-time system MRR, member scale & metrics |
| `GET` | `/api/admin/members` | Admin | Member directory & status toggle switches |
| `GET` | `/api/leads/all` | Admin | Lead pipeline tracking & status updates |
| `POST` | `/api/payments/create-order` | Member | Create Razorpay order ID |
| `POST` | `/api/payments/verify` | Member | Verify Razorpay HMAC signature & upgrade tier |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
