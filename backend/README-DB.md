# Backend Database Setup (Prisma + Docker PostgreSQL)

## Quick Start

### 1. Start PostgreSQL Database:
```bash
# Trong folder backend
docker-compose up -d

```

### 2. Setup Prisma (one-time):
```bash

# Generate Prisma client
npx prisma generate

npx prisma migrate dev --name init
```

### 3. Run Backend Application:
```bash
# Start development server
npm run dev
```

## Database Operations

### Stop Database:
```bash
docker-compose down
```

### Backup Database:
```bash
# Export data using pg_dump
docker exec backend-postgres pg_dump -U postgres cloudops_db > backup.sql

# Or backup entire volume
docker run --rm -v backend_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

