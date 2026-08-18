# Business Finance Portal (MERN)

A user-friendly and responsive MERN portal to manage:
- Expenses
- Customer income
- Investments
- Purchases
- Investors (partners, capital, ownership)
- Reports with PDF export

## Tech Stack
- MongoDB
- Express.js
- React (Vite)
- Node.js

## Project Structure
- `server`: REST API and MongoDB models
- `client`: React dashboard UI

## Setup

### 1) Server
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 2) Client
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## VPS Container Deployment (Docker)

### 1) Copy project to VPS
Use git clone or upload this folder to your VPS.

### 2) Install Docker + Docker Compose plugin
On Ubuntu:
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

### 3) Prepare production environment
```bash
cp server/.env.production.example server/.env.production
```
Then edit `server/.env.production`:
- set secure `JWT_SECRET`
- set admin email/password
- optionally replace `MONGODB_URI` with your external Mongo URI

### 4) Build and run containers
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 5) Check status/logs
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

### 6) Access app
- Frontend: `http://YOUR_VPS_IP/`
- API: `http://YOUR_VPS_IP/api/health`

## API Endpoints
- `GET /api/health`
- `GET /api/transactions`
- `GET /api/transactions?type=expense|income|investment|purchase`
- `GET /api/transactions/summary`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/investors`
- `GET /api/investors?status=active|inactive`
- `GET /api/investors/summary`
- `POST /api/investors`
- `PUT /api/investors/:id`
- `DELETE /api/investors/:id`
- `GET /api/reports`
- `GET /api/reports?from=2026-08-01&to=2026-08-31`

## Transaction Body
```json
{
  "type": "expense",
  "title": "Internet bill",
  "amount": 50,
  "date": "2026-08-18",
  "notes": "Monthly payment"
}
```

## Investor Body
```json
{
  "name": "Ali Khan",
  "email": "ali@example.com",
  "phone": "0300-0000000",
  "investedAmount": 25000,
  "ownershipPercent": 50,
  "joinDate": "2026-08-18",
  "status": "active",
  "notes": "Founding partner"
}
```
