# 🏋️ HealthPoint Fitness — Gym Management & AI Fitness Platform

[![Spring Boot](https://img.shields.io/badge/Spring--Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-purple.svg)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue.svg)](https://www.postgresql.org/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment%20Gateway-blueviolet.svg)](https://razorpay.com/)

**HealthPoint Fitness** is a full-stack, enterprise-grade gym management application and AI-powered fitness coaching platform. It seamlessly integrates member subscriptions via **Razorpay**, personalized AI workout & diet generation based on individual body metrics, and dedicated portals for **Members**, **Trainers**, and **Admins**.

---

## ✨ Key Features

### 💳 1. Seamless Razorpay Payment Integration
- **Subscription Upgrades**: Buy or upgrade membership tiers (Basic Starter, Pro Fitness, Annual Elite).
- **HMAC Signature Verification**: Secure server-side validation of Razorpay order IDs and payment signatures.
- **Payment History**: Real-time logging of transactions in PostgreSQL with instant receipt downloads.

### 🧬 2. Person-Specific AI Workout & Nutrition Engine
- **Custom Body Calculations**: Calculates BMI, daily caloric needs (TDEE), and target macronutrients (Protein, Carbs, Fats).
- **7-Day Personalized Workout Splits**: Dynamically generates splits tailored to goals (*Aesthetic, Competition Prep, Strength Training, Powerlifting, Sports Performance*) and experience levels (*Beginner, Intermediate, Advanced*).
- **Custom Diet Plans**: Meal-by-meal timing and nutrition guidance suited for specific target goals.

### 👥 3. Role-Based Access Control & Multi-Portal System
- **Member Portal (`/member/*`)**: View workouts, nutrition, payment history, video exercise library, and goal setups.
- **Trainer Portal (`/trainer/*`)**: Client coaching roster, client attendance tracking, and custom workout/diet plan assignments.
- **Admin Portal (`/admin/*`)**: Complete member/staff directory management, role updates, account activation/deactivation, and interactive **Revenue & Payment Analytics** using Recharts.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.5
- **Security**: Spring Security, JWT (JSON Web Tokens), BCrypt Password Hashing
- **Database**: PostgreSQL 17 + Hibernate / Spring Data JPA
- **Payment Integration**: Razorpay Java SDK
- **JSON Processing**: Jackson

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS + Custom Dark Mode UI Design System
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

---

## 🔑 Demo Access Credentials

The database automatically seeds demo accounts on backend startup:

| Role | Email | Password | Default Redirect |
| :--- | :--- | :--- | :--- |
| **Member** | `user@hp.com` | `password` | `/member/dashboard` |
| **Trainer** | `trainer@hp.com` | `password` | `/trainer/dashboard` |
| **Admin** | `admin@hp.com` | `password` | `/admin/dashboard` |

---

## ⚙️ Installation & Local Setup Guide

### 1. Prerequisites
- **Java 17 or higher**
- **Node.js (v18+) & npm**
- **PostgreSQL 17** (Database name: `healthpoint`)
- **Maven** (or Maven Wrapper)

---

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Update database credentials in `src/main/resources/application.yaml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/healthpoint
       username: postgres
       password: postgres
   
   razorpay:
     key:
       id: YOUR_RAZORPAY_TEST_KEY_ID
       secret: YOUR_RAZORPAY_TEST_KEY_SECRET
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *(Backend starts at `http://localhost:8085`)*

---

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Create or update `.env` file:
   ```env
   VITE_RAZORPAY_KEY_ID=YOUR_RAZORPAY_TEST_KEY_ID
   ```
3. Install dependencies and start the Vite dev server:
   ```bash
   npm install
   npm run dev
   ```
   *(Frontend starts at `http://localhost:5173`)*

---

## 📡 Key API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token + user details |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile |
| `POST` | `/api/payments/create-order` | Create a new Razorpay payment order |
| `POST` | `/api/payments/verify` | Verify Razorpay HMAC signature & activate subscription |
| `POST` | `/api/goals/setup` | Generate person-specific workout & diet plan |
| `GET` | `/api/goals/my-plan` | Retrieve member's active AI fitness plan |

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
