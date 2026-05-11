# Executive Flow — Full Stack Enterprise Productivity Platform

A complete full-stack web application built with **MongoDB Atlas (free M0)**, **Node.js/Express**, **JWT auth**, and a polished single-page frontend — fully working for both **User** and **Admin** roles.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server (works immediately with mock data)
npm start

# Open: http://localhost:3000
```

> **No MongoDB needed to run!** The app uses built-in mock data automatically.

---

## 🍃 Connect MongoDB Atlas Free Tier

1. Go to **https://cloud.mongodb.com** → Sign up free
2. Create a **M0 Free** cluster (any region)
3. Create a database user (username + password)
4. Go to **Network Access** → Add IP → **Allow from Anywhere** (`0.0.0.0/0`)
5. Click **Connect** → **Drivers** → Copy the connection string
6. Edit `.env`:
```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/executiveflow?retryWrites=true&w=majority
```
7. Seed with demo data:
```bash
npm run seed
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@executiveflow.io | admin123 |
| **User**  | alex@acme.com | user123 |

---

## 📁 Project Structure

```
executiveflow/
├── backend/
│   ├── server.js          # Express server
│   ├── db.js              # MongoDB Atlas connection
│   ├── routes.js          # 33 REST API endpoints
│   ├── auth.js            # JWT middleware + bcrypt
│   ├── mockDB.js          # In-memory fallback (no MongoDB needed)
│   ├── seed.js            # MongoDB Atlas seed script
│   └── models/
│       ├── User.js        # bcrypt, roles, JWT
│       ├── Task.js        # Kanban tasks
│       ├── Goal.js        # Goal tracking
│       ├── Integration.js # Third-party integrations
│       ├── ApiKey.js      # API key management
│       ├── AuditLog.js    # 90-day TTL audit trail
│       └── Notification.js
├── frontend/
│   └── public/
│       └── index.html     # Complete SPA (1200+ lines)
├── .env                   # Config — add MONGODB_URI here
├── .env.example           # Example config file
├── .gitignore
└── package.json
```

---

## 🌐 API Endpoints (33 total)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Server + DB status |
| POST | `/api/auth/login` | — | Login → JWT token |
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/logout` | User | Logout |
| GET | `/api/auth/me` | User | Current user |
| PUT | `/api/auth/password` | User | Change password |
| GET | `/api/users` | Admin | List all users |
| POST | `/api/users` | Admin | Invite user |
| PUT | `/api/users/:id` | Admin | Update user |
| DELETE | `/api/users/:id` | Admin | Deactivate user |
| GET/PUT | `/api/users/me` | User | Own profile |
| GET/POST | `/api/tasks` | User | List / create tasks |
| PUT/DELETE | `/api/tasks/:id` | User | Update / delete task |
| GET/POST | `/api/goals` | User | List / create goals |
| PUT/DELETE | `/api/goals/:id` | User | Update / delete goal |
| GET | `/api/integrations` | User | List integrations |
| PUT | `/api/integrations/:id/toggle` | User | Connect / disconnect |
| GET/POST | `/api/keys` | Admin | List / generate API keys |
| DELETE | `/api/keys/:id` | Admin | Revoke API key |
| GET | `/api/audit` | Admin | Search audit logs |
| GET | `/api/notifications` | User | Get notifications |
| PUT | `/api/notifications/:id/read` | User | Mark read |
| PUT | `/api/notifications/read-all` | User | Mark all read |
| GET | `/api/analytics/dashboard` | User | Dashboard metrics |
| GET | `/api/analytics/admin` | Admin | System metrics |
| GET | `/api/analytics/revenue` | Admin | Revenue data |

---

## ✨ Features

### 👤 User App
- **Dashboard** — metrics, Chart.js productivity graphs, AI recommendations
- **Kanban Board** — drag & drop tasks across 4 columns (Backlog → Done)
- **Analytics** — deep work charts, focus score, 6-month trends
- **Goals** — progress tracking with color coding, +10% increments
- **Team** — member cards, activity feed, task distribution chart
- **Integrations** — connect/disconnect Slack, GitHub, Jira, Notion, Figma
- **Profile** — edit info, change password, preferences toggles
- **Focus Timer** — 25-minute Pomodoro with live countdown
- **Command Palette** — ⌘K quick navigation
- **Notifications** — real-time panel with unread badges

### 🛡️ Admin App
- **System Overview** — live CPU animation, DB status, request volume chart
- **User Management** — full CRUD: invite, edit roles/plans, deactivate
- **Integrations** — manage org-wide connections
- **API Management** — generate keys, view usage, revoke access
- **Audit Logs** — searchable MongoDB trail, filter by status
- **Revenue & Growth** — MRR, ARR, churn, LTV, top accounts table

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas M0 (free) + Mongoose |
| Auth | JWT + bcrypt (10 rounds) |
| Frontend | Vanilla JS SPA + Chart.js 4 |
| Fallback | In-memory mock DB |
| Security | Helmet, CORS, Rate Limiting |

---

## 📤 Push to GitHub

```bash
cd executiveflow
git init
git add .
git commit -m "feat: Executive Flow full-stack app with MongoDB Atlas"
git branch -M main
git remote add origin https://github.com/Akshatj0707/executive-flow.git
git push -u origin main
```
