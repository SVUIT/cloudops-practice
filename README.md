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

## Running the App Locally

### Open Terminal 1 – Start Backend

```bash
# Go to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
node index.js

```
The backend runs at: http://localhost:5000



### Open Terminal 2 – Start Frontend

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