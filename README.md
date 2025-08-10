## Requirements

### Functional Requirements
- [ ] User can create Kanban boards
- [ ] User can add columns (e.g., To Do, In Progress, Done)
- [ ] User can create tasks and move them between columns

### Technical Requirements
- [ ] Frontend: React **^19.1.0**
- [ ] Backend: Node.js (Express) **v22.17.0**
- [ ] Database: PostgreSQL hosted on Azure SQL
- [ ] Optional: Simple login system

### Deployment & Configuration
- [ ] All configs set via environment variables (for K8s compatibility)
- [ ] App packaged into containers (either single or separate frontend/backend services)
- [ ] Deployment tested on multiple Kubernetes clusters

---

# 🗄️ Backend Database Setup with Prisma + PostgreSQL (Docker)
 
This guide explains how to set up and manage your PostgreSQL database using **Prisma ORM** with a migration-based workflow. PostgreSQL runs in Docker, and Prisma is used for schema management.
 
---
 
## 📦 Project Structure
 
```text
backend/
├── docker-compose.yml         # PostgreSQL configuration
├── prisma/
│   ├── schema.prisma          # Database models
│   └── migrations/            # Migration history
├── .env                       # DATABASE_URL
├── package.json
└── ...
```
 
---

## Running the App Locally

### Start Backend

## 🚀 Quick Start
> **Note:** The `DATABASE_URL` is configured in the `.env` file in the `backend/` directory.  
> Make sure to set this variable to match your PostgreSQL connection string before running migrations or starting the app.
 
 
### 1. Start PostgreSQL with Docker
 
```bash
# In the backend folder
docker-compose up -d
```
 
### 2. Prisma Setup & Migrations
 
#### a. Development
 
- Create a new migration and apply it to your local database:
* Delete the existing migrations folder if you want to start fresh.
 
```bash
npx prisma migrate dev --name <migration-name>
```
 
- This will:
  - Create a new migration file in `prisma/migrations/`
  - Apply it to your local database
  - Automatically regenerate the Prisma Client
 
#### b. Production / CI/CD
 
- To safely apply existing migrations in production (without creating new migrations):
 
```bash
npx prisma migrate deploy
```
 
- This will:
  - Apply all pending migration files in `prisma/migrations/`
  - Keep the production database schema in sync
 
✅ This is the correct way to update the schema in CI/CD pipelines or staging/production environments.
 
---
 
### 3. Run the Backend Application

```bash
npm install
npm run dev
```
 
---
 
## 🛠️ Database Operations
 
### Stop the Database
 
```bash
docker-compose down
```


### Start Frontend

> **Note:** The `VITE_API_BASE_URL` variable is configured in the `.env` file in the `frontend/` directory.  
> Make sure to set this variable to your backend API URL so that the frontend can correctly communicate with the backend.

```bash
# Make sure you have Node.js v22.17.0 installed
# You can use nvm to switch:
nvm install 22.17.0
nvm use 22.17.0

# Go to frontend project
cd frontend

# Install dependencies
npm install

# Start the frontend app
npm run dev
```
---