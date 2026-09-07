# HealthPoint Fitness — Production Deployment Guide 🚀

This document provides complete instructions for running, testing, containerizing, and deploying the **HealthPoint Fitness Ecosystem** to production environments.

---

## 🏗️ Architecture Overview

```text
                          ┌──────────────────────────┐
                          │   Client Web Browsers    │
                          └─────────────┬────────────┘
                                        │
                         HTTPS (Port 443 / Port 80)
                                        │
                                        ▼
             ┌──────────────────────────────────────────────────────┐
             │       Frontend: React 18 + Tailwind CSS + Vite       │
             │           (Served via Nginx / Vercel / Cloud)        │
             └──────────────────────────┬───────────────────────────┘
                                        │ /api/*
                                        ▼
             ┌──────────────────────────────────────────────────────┐
             │    Backend: Spring Boot 3.2.5 (Java 21) REST API     │
             │             (Port 8085 / Port 8080)                  │
             └───────────┬──────────────────┬───────────────────────┘
                         │                  │
                         ▼                  ▼
    ┌───────────────────────────┐     ┌─────────────────────────────┐
    │   PostgreSQL 15 Database  │     │      External Services:     │
    │     (Flyway Migrations)   │     │  • Razorpay Payment Gateway │
    └───────────────────────────┘     │  • OpenAI GPT-4o Mini API   │
                                      └─────────────────────────────┘
```

---

## ⚡ Option 1: Quick Local Development (Fast Start)

### Prerequisites

- **Java 21 JDK** (Eclipse Temurin / Oracle / OpenJDK)
- **Node.js 18+** & **NPM**
- **Maven 3.8+** (or use `./mvnw`)

### 1. Start the Backend

```bash
cd backend
mvn clean spring-boot:run
```

*The backend will boot up at `http://localhost:8085`. By default, it uses an in-memory H2 PostgreSQL-compatible database with automatic schema generation and seed data.*

- **API Base URL**: `http://localhost:8085/api`
- **Health Check**: `http://localhost:8085/api/public/health`
- **H2 Web Console**: `http://localhost:8085/h2-console` (JDBC URL: `jdbc:h2:mem:healthpointdb`, User: `sa`, Password: *blank*)

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

*The frontend Vite development server will start at `http://localhost:5173`.*

### 3. Default Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@hp.com` | `password123` |
| **Trainer** | `trainer@hp.com` | `password123` |
| **Member** | `user@hp.com` | `password123` |

---

## 🐳 Option 2: Production Containerization (Docker & Docker Compose)

Both backend and frontend contain multi-stage, production-ready `Dockerfile` configurations.

### 1. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update your keys in `.env` (Razorpay credentials, OpenAI API key, Postgres password).

### 2. Launch Full Stack with Docker Compose

```bash
docker-compose up --build -d
```

### 3. Verify Running Containers

```bash
docker-compose ps
```

- **Web Application**: `http://localhost` or `http://localhost:5173`
- **Backend API**: `http://localhost:8085/api`
- **PostgreSQL Database**: `localhost:5432`

### 4. Stop Containers

```bash
docker-compose down
```

---

## 🆓 Option 3: 100% FREE Deployment (Zero Cost / No Credit Card)

You can deploy the complete **HealthPoint Fitness Ecosystem** to the cloud completely **FREE** forever using the following generous free-tier architecture:

| Component | Free Platform | Free Tier Highlights |
| :--- | :--- | :--- |
| **Database** | [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com) | Free Serverless PostgreSQL, 0.5 GB storage, instant setup, no credit card required |
| **Backend API** | [Render.com](https://render.com) or [Koyeb](https://www.koyeb.com) | Free Web Service (750 hrs/month), automatic HTTPS/SSL, Git-connected CI/CD |
| **Frontend UI** | [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | 100% Free Edge CDN, custom domain support, unlimited static deployments |

---

### Step 1: Create Free PostgreSQL Database (Neon.tech)

1. Sign up at **[neon.tech](https://neon.tech)** (free, login with GitHub).
2. Click **"Create Project"**:
   - Project Name: `healthpoint-fitness`
   - Region: Select the nearest region (e.g. `US East (Ohio)` or `AWS Frankfurt` or `AWS Singapore`).
   - PostgreSQL Version: `15` or `16`.
3. Under **Dashboard -> Connection Details**, select **"Pooled Connection"** or standard connection string.
4. Copy the connection string. It looks like:

   ```text
   postgres://username:password@ep-cool-lake-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

5. Extract the Spring Boot JDBC parameters:
   - **JDBC URL**: `jdbc:postgresql://ep-cool-lake-123456.us-east-2.aws.neon.tech:5432/neondb?sslmode=require`
   - **Username**: `username` (from Neon)
   - **Password**: `password` (from Neon)

---

### Step 2: Deploy Spring Boot Backend on Render.com (100% Free)

1. Sign up / Log in to **[render.com](https://render.com)** (login with GitHub).
2. Click **"New +"** -> **"Web Service"**.
3. Select your GitHub repository: `mallikarjun086/healthpoint-fitness-gym-app`.
4. Configure service settings:
   - **Name**: `healthpoint-backend`
   - **Region**: Same region as your Neon database (e.g., `Ohio (US East)`).
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` (or `Java` with Build Command: `mvn clean package -DskipTests` and Start Command: `java -jar target/healthpoint-fitness-1.0.0.jar`)
   - **Instance Type**: **Free** (0.1 CPU, 512 MB RAM)
5. Scroll down to **"Environment Variables"** and click **"Add Environment Variable"**:
   - `PORT` = `8085`
   - `SPRING_DATASOURCE_URL` = `jdbc:postgresql://<your-neon-host>:5432/neondb?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME` = `<your-neon-username>`
   - `SPRING_DATASOURCE_PASSWORD` = `<your-neon-password>`
   - `SPRING_DATASOURCE_DRIVER` = `org.postgresql.Driver`
   - `FLYWAY_ENABLED` = `true`
   - `SPRING_JPA_HIBERNATE_DDL_AUTO` = `update`
   - `RAZORPAY_KEY_ID` = `rzp_test_TKysodv5MMn17D`
   - `RAZORPAY_KEY_SECRET` = `tlF339LhKoBgOGIysuMxWrDg`
   - `OPENAI_API_KEY` = `sk-placeholder`
   - `CORS_ALLOWED_ORIGINS` = `*` (or your frontend Vercel URL)
6. Click **"Create Web Service"**.
7. Wait ~2 minutes for Render to build and start.
8. Copy your backend URL: e.g., `https://healthpoint-backend.onrender.com`.
   - Test it by opening: `https://healthpoint-backend.onrender.com/api/public/health` -> should return `{"status":"UP"}`.

---

### Step 3: Deploy React Frontend on Vercel (100% Free)

1. Sign up / Log in to **[vercel.com](https://vercel.com)** (login with GitHub).
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository: `healthpoint-fitness-gym-app`.
4. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and choose `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **"Environment Variables"**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://healthpoint-backend.onrender.com/api` (the Render backend URL from Step 2)
6. Click **"Deploy"**.
7. Vercel builds the project in ~30 seconds and assigns a live production URL: e.g., `https://healthpoint-fitness.vercel.app`.

---

### Step 4: Verify Full Stack in Production

1. Open your Vercel URL (`https://healthpoint-fitness.vercel.app`).
2. Log in with demo accounts:
   - **Admin**: `admin@hp.com` / `password123`
   - **Trainer**: `trainer@hp.com` / `password123`
   - **Member**: `user@hp.com` / `password123`
3. Flyway migrations in Neon will automatically create all tables and seed data upon first startup.
4. Total monthly cost: **$0.00 / Month (100% Free Forever)**.

---

## ☁️ Option 4: Alternative Cloud Platform Deployments

---

### B. Deploy on Railway

1. Install Railway CLI: `npm i -g @railway/cli` or use [Railway Dashboard](https://railway.app).
2. Create New Project from GitHub repo.
3. Add **PostgreSQL** plugin.
4. For the **Backend Service**:
   - Set Root Directory to `/backend`.
   - Railway auto-detects Java 21 / Maven or Dockerfile.
   - Link `DATABASE_URL` variable to `SPRING_DATASOURCE_URL`.
5. For the **Frontend Service**:
   - Set Root Directory to `/frontend`.
   - Set `VITE_API_URL` to your backend's public domain.

---

### C. Deploy on AWS (Production Enterprise)

#### Architecture on AWS

- **Frontend**: Amazon S3 + CloudFront CDN (Global edge caching, HTTPS SSL via ACM)
- **Backend API**: AWS ECS Fargate (Containerized Spring Boot service behind Application Load Balancer)
- **Database**: AWS RDS PostgreSQL (Multi-AZ with automated backups)
- **Secrets**: AWS Secrets Manager / Parameter Store

#### Steps

1. **Database**: Create an Amazon RDS PostgreSQL instance (Postgres 15+).

2. **Backend**:
   - Build and push Docker image to Amazon ECR:

     ```bash
     aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account_id>.dkr.ecr.<region>.amazonaws.com
     docker build -t healthpoint-backend ./backend
     docker tag healthpoint-backend:latest <account_id>.dkr.ecr.<region>.amazonaws.com/healthpoint-backend:latest
     docker push <account_id>.dkr.ecr.<region>.amazonaws.com/healthpoint-backend:latest
     ```

   - Create an ECS Task Definition with CPU/Memory allocation and environment variables.
   - Attach Task to an ECS Fargate Service behind an ALB with Target Group health check path `/api/public/health`.

3. **Frontend**:
   - Build production bundle:

     ```bash
     cd frontend
     npm run build
     ```

   - Sync `dist/` directory to Amazon S3 bucket:

     ```bash
     aws s3 sync ./dist s3://healthpoint-frontend-bucket --delete
     ```

   - Point CloudFront distribution origin to S3 with custom error responses (`403`/`404` -> `/index.html` with HTTP 200) for SPA routing.

---

## 🔒 Production Security & Hardening Checklist

| Task | Description | Status |
| :--- | :--- | :---: |
| **HTTPS/SSL** | Ensure all traffic is encrypted via TLS 1.3 certificates. | Required |
| **Razorpay Webhooks** | Configure webhook endpoint `https://your-domain.com/api/payments/webhook` in Razorpay Dashboard. | Required |
| **CORS Origins** | Restrict `CORS_ALLOWED_ORIGINS` to exact production domain(s). | Required |
| **Database Passwords** | Never use default `postgres` password in production; use random 32-char alphanumeric secrets. | Required |
| **JWT Secrets** | Ensure strong JWT secret key is used in production. | Configured |
| **OpenAI Quota** | Configure spending limits and monitoring on OpenAI developer platform. | Recommended |
| **Backups** | Enable automated daily snapshots for PostgreSQL database. | Recommended |

---

## 🛠️ Troubleshooting & Logs

### View Container Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Health Check Verification

```bash
curl http://localhost:8085/api/public/health
```

Response:

```json
{
  "status": "UP",
  "service": "HealthPoint Fitness Core API",
  "timestamp": "2026-09-07T19:20:00.000",
  "version": "1.0.0"
}
```

### Flyway Migration Repair / Baseline

If database schema changes are introduced manually:

```bash
# In application.yaml or environment:
FLYWAY_BASELINE_ON_MIGRATE=true
FLYWAY_REPAIR=true
```
