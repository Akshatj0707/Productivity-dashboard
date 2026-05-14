# ⚡ Executive Flow — Enterprise Productivity Platform

<div align="center">

![Executive Flow Banner](https://img.shields.io/badge/Executive%20Flow-v2.0-0d9488?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20M0%20Free-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-FB015B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A complete full-stack enterprise productivity platform built with MongoDB Atlas, Node.js, Express, and JWT authentication — featuring separate dashboards for Users and Admins.**

[🌐 Frontend](https://executive-flow.onrender.com) · [⚙️ Backend API](https://executive-flow.onrender.com/api/health) · [📖 Deployment](#-deployment) · [📚 API Docs](#-api-endpoints)

</div>

---

## 🔗 Live Links

| | Link | Description |
|--|------|-------------|
| 🌐 | [**Frontend — Live App**](https://executive-flow.onrender.com) | Full SPA with User & Admin dashboards |
| ⚙️ | [**Backend — REST API**](https://executive-flow.onrender.com/api/health) | Node.js + Express API server |
| 🏥 | [**API Health Check**](https://executive-flow.onrender.com/api/health) | Server status + MongoDB connection |
| 📦 | [**GitHub Repository**](https://github.com/Akshatj0707/Productivity-dashboard) | Full source code |

> ⚠️ Hosted on Render free tier — first load after inactivity may take **30–60 seconds** to wake up.

---

## ✨ Features

### 👤 User Dashboard
| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Morning overview with live metrics, Chart.js productivity graphs, AI recommendations |
| 📋 **Kanban Board** | Drag & drop tasks across 4 columns — Backlog → In Progress → In Review → Done |
| 📈 **Analytics** | Deep work charts, focus score trends, 6-month productivity graphs |
| 🎯 **Goals** | Progress tracking with color-coded bars, +10% increments, streaks |
| 👥 **Team** | Member cards with online status, activity feed, task distribution chart |
| 🔗 **Integrations** | Connect/disconnect Slack, GitHub, Jira, Notion, Figma |
| 👤 **Profile** | Edit personal info, change password, notification preferences |
| ⏱️ **Focus Timer** | 25-minute Pomodoro with live countdown in top banner |
| ⌘K **Command Palette** | Instant keyboard navigation across all pages |
| 🔔 **Notifications** | Real-time notification panel with unread badge |

### 🛡️ Admin Console
| Feature | Description |
|---------|-------------|
| 🖥️ **System Overview** | Live CPU animation, DB connection status, 24h request volume chart |
| 👥 **User Management** | Full CRUD — invite users, edit roles/plans, deactivate accounts |
| 🔑 **API Management** | Generate production/staging keys, view usage, revoke access |
| 📝 **Audit Logs** | Searchable MongoDB activity trail with status filtering |
| 💰 **Revenue Dashboard** | MRR, ARR, churn rate, LTV metrics with 12-month chart |
| 🔗 **Integrations** | Manage org-wide tool connections |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 18+ | Server-side JavaScript |
| **Framework** | Express.js 4.18 | REST API & static serving |
| **Database** | MongoDB Atlas M0 (Free) | Cloud NoSQL database |
| **ODM** | Mongoose 8.x | MongoDB object modeling |
| **Auth** | JWT + bcrypt | Secure token authentication |
| **Frontend** | Vanilla JS SPA | Single-page application |
| **Charts** | Chart.js 4.4 | Data visualizations |
| **Security** | Helmet + CORS + Rate Limiting | Production hardening |
| **Fallback** | In-memory mock DB | Works without MongoDB |

---

## 🚀 Quick Start

### Run Locally (No MongoDB needed — uses mock data)

```bash
# Clone the repository
git clone https://github.com/Akshatj0707/Productivity-dashboard.git
cd Productivity-dashboard

# Install dependencies
npm install

# Start the server
npm start

# Open http://localhost:3000
```

### Run with MongoDB Atlas (Persistent data)

```bash
# 1. Clone and install
git clone https://github.com/Akshatj0707/Productivity-dashboard.git
cd Productivity-dashboard
npm install

# 2. Create .env file with your MongoDB URI
echo "MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.XXXXX.mongodb.net/executiveflow?retryWrites=true&w=majority" > .env

# 3. Seed demo data into MongoDB
npm run seed

# 4. Start the server
npm start
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@executiveflow.io | admin123 | Full admin console |
| **User** | alex@acme.com | user123 | User dashboard |
| **User** | maria@acme.com | user123 | User dashboard |
| **User** | james@acme.com | user123 | User dashboard |

---

## 📁 Project Structure

```
Productivity-dashboard/
├── backend/
│   ├── server.js              # Express server — entry point
│   ├── db.js                  # MongoDB Atlas connection with fallback
│   ├── routes.js              # All 33 REST API endpoints
│   ├── auth.js                # JWT middleware + bcrypt helpers
│   ├── mockDB.js              # In-memory fallback (no MongoDB needed)
│   ├── seed.js                # Seeds MongoDB with demo data
│   └── models/
│       ├── User.js            # User schema — roles, bcrypt, JWT
│       ├── Task.js            # Kanban task schema
│       ├── Goal.js            # Goal tracking with progress
│       ├── Integration.js     # Third-party integrations
│       ├── ApiKey.js          # API key management
│       ├── AuditLog.js        # Audit trail with 90-day TTL index
│       ├── Notification.js    # User notifications
│       └── index.js           # Model resolver (real vs mock)
├── frontend/
│   └── public/
│       └── index.html         # Complete SPA — 1200+ lines
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
├── render.yaml                # One-click Render deployment config
├── DEPLOYMENT.md              # Full deployment guide
├── package.json               # Dependencies + npm scripts
└── README.md                  # This file
```

---

## 🌐 API Endpoints

<details>
<summary><strong>Authentication (5 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Login → returns JWT token |
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/logout` | User | Logout + set status offline |
| GET | `/api/auth/me` | User | Get current user info |
| PUT | `/api/auth/password` | User | Change password |

</details>

<details>
<summary><strong>Users (6 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | Admin | List all active users |
| POST | `/api/users` | Admin | Invite / create user |
| PUT | `/api/users/:id` | Admin | Update user role/plan/status |
| DELETE | `/api/users/:id` | Admin | Deactivate user |
| GET | `/api/users/me` | User | Get own profile |
| PUT | `/api/users/me` | User | Update own profile |

</details>

<details>
<summary><strong>Tasks — Kanban (4 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | User | Get all tasks |
| POST | `/api/tasks` | User | Create task |
| PUT | `/api/tasks/:id` | User | Update task / move column |
| DELETE | `/api/tasks/:id` | User | Delete task |

</details>

<details>
<summary><strong>Goals (4 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/goals` | User | Get user's goals |
| POST | `/api/goals` | User | Create goal |
| PUT | `/api/goals/:id` | User | Update progress / details |
| DELETE | `/api/goals/:id` | User | Delete goal |

</details>

<details>
<summary><strong>Integrations, API Keys, Audit, Notifications, Analytics (14 endpoints)</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/integrations` | User | List integrations |
| PUT | `/api/integrations/:id/toggle` | User | Connect / disconnect |
| GET | `/api/keys` | Admin | List active API keys |
| POST | `/api/keys` | Admin | Generate new API key |
| DELETE | `/api/keys/:id` | Admin | Revoke API key |
| GET | `/api/audit` | Admin | Search audit logs |
| GET | `/api/notifications` | User | Get notifications |
| PUT | `/api/notifications/:id/read` | User | Mark as read |
| PUT | `/api/notifications/read-all` | User | Mark all as read |
| GET | `/api/analytics/dashboard` | User | User dashboard metrics |
| GET | `/api/analytics/admin` | Admin | System-wide metrics |
| GET | `/api/analytics/revenue` | Admin | Revenue & subscription data |
| GET | `/api/health` | — | Server + DB status check |

</details>

---

## 🗄️ Database Schema

```
MongoDB Atlas — executiveflow database
├── users          → name, email, password (bcrypt), role, plan, status, loginCount
├── tasks          → title, status, priority, tags, assignees, creatorId
├── goals          → userId, name, progress, target, dueDate, color
├── integrations   → name, icon, category, isConnected, connectedBy
├── apikeys        → userId, name, keyValue, environment, isActive
├── auditlogs      → userId, event, ipAddress, status [TTL: 90 days]
└── notifications  → userId, icon, title, subtitle, isRead
```

---

## 🚀 Deployment

### Deploy to Render (Free)

1. **Fork** this repository

2. **Create MongoDB Atlas M0 free cluster** at [cloud.mongodb.com](https://cloud.mongodb.com)
   - Create database user: username `efadmin`, save the password
   - Network Access → Allow from Anywhere (`0.0.0.0/0`)
   - Get connection string: `mongodb+srv://efadmin:PASSWORD@cluster0.XXXXX.mongodb.net/executiveflow?retryWrites=true&w=majority`

3. **Deploy on Render** at [render.com](https://render.com)
   - New → Web Service → Connect your GitHub repo
   - Build Command: `npm install`
   - Start Command: `node backend/server.js`
   - Add environment variables (see below)

4. **Environment Variables on Render:**

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your Atlas connection string |
   | `JWT_SECRET` | Any long random string |
   | `JWT_EXPIRES` | `7d` |
   | `PORT` | `3000` |

5. **Seed the database** (run locally after deploy):
   ```bash
   npm run seed
   ```

> 📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete step-by-step guide with screenshots descriptions.

---

## 🔐 Security

- **JWT** tokens with 7-day expiry stored in localStorage
- **bcrypt** password hashing with 10 salt rounds
- **Rate limiting** — 30 auth requests / 15 min, 600 API requests / 15 min
- **Helmet.js** — sets secure HTTP headers
- **CORS** — configurable allowed origins
- **MongoDB injection** prevention via Mongoose schema validation
- **Audit logging** — all admin actions logged with IP address
- **90-day TTL** on audit logs — automatic MongoDB cleanup

---

## 📊 Demo Data (after seeding)

| Collection | Count | Details |
|-----------|-------|---------|
| Users | 5 | 1 admin, 4 customers across Free/Starter/Pro |
| Tasks | 10 | Spread across all 4 Kanban columns |
| Goals | 5 | Various progress levels with different colors |
| Integrations | 6 | Slack + GitHub connected, 4 disconnected |
| API Keys | 3 | Production and staging environments |
| Audit Logs | 7 | Mix of success and error events |
| Notifications | 6 | Mix of read and unread |

---

## 🏗️ Architecture

```
Browser (SPA)
     │
     │  HTTP/REST + JWT
     ▼
Express.js Server
     │
     ├── /api/auth/*      → JWT login/register/logout
     ├── /api/users/*     → User CRUD (admin-protected)
     ├── /api/tasks/*     → Kanban tasks
     ├── /api/goals/*     → Goal tracking
     ├── /api/keys/*      → API key management
     ├── /api/audit       → Audit logs
     ├── /api/analytics/* → Dashboard metrics
     └── /api/health      → Server status
     │
     ▼
MongoDB Atlas M0
(with in-memory fallback if URI not set)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Akshat Jain**
- GitHub: [@Akshatj0707](https://github.com/Akshatj0707)
- Repository: [Productivity-dashboard](https://github.com/Akshatj0707/Productivity-dashboard)

---

<div align="center">

⭐ **Star this repo if you found it helpful!** ⭐

Built with ❤️ using MongoDB Atlas · Node.js · Express · JWT · Chart.js

</div>
