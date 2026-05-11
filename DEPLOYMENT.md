# Complete Deployment Guide

## STEP 1 — MongoDB Atlas (Free Database)

### 1.1 Create Free Account
1. Go to **https://cloud.mongodb.com**
2. Click **"Try Free"** → Sign up with Google or email
3. Choose **"Build a Database"**
4. Select **M0 FREE** tier → pick any cloud/region → click **Create**

### 1.2 Create Database User
1. Left sidebar → **Database Access** → **Add New Database User**
2. Auth method: **Password**
3. Username: `efadmin`
4. Password: click **"Autogenerate Secure Password"** → **Copy** it somewhere safe
5. Under "Database User Privileges" select **Atlas Admin**
6. Click **Add User**

### 1.3 Allow Network Access
1. Left sidebar → **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** → this adds `0.0.0.0/0`
3. Click **Confirm**

### 1.4 Get Connection String
1. Left sidebar → **Database** → click **Connect**
2. Choose **"Drivers"**
3. Driver: **Node.js** | Version: **5.5 or later**
4. Copy the connection string — looks like:
   ```
   mongodb+srv://efadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the password you saved
6. Add database name before `?`:
   ```
   mongodb+srv://efadmin:YOURPASSWORD@cluster0.xxxxx.mongodb.net/executiveflow?retryWrites=true&w=majority
   ```
7. **Save this full URI** — you need it in Step 2

---

## STEP 2 — Deploy on Render (Free Hosting)

### 2.1 Create Render Account
1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended — links your repos automatically)

### 2.2 Create Web Service
1. Dashboard → **New +** → **Web Service**
2. Connect your GitHub account if not already
3. Find **Productivity-dashboard** repo → click **Connect**
4. Fill in settings:
   - **Name**: `executive-flow`
   - **Region**: Oregon (US West) or closest to you
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`
   - **Plan**: **Free**

### 2.3 Add Environment Variables
Under **Environment** section, click **Add Environment Variable** for each:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://efadmin:YOURPASSWORD@cluster0.xxxxx.mongodb.net/executiveflow?retryWrites=true&w=majority` |
| `JWT_SECRET` | `any-long-random-string-at-least-32-chars-change-this` |
| `JWT_EXPIRES` | `7d` |
| `PORT` | `3000` |

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Watch the logs — build takes 2-3 minutes
3. Once you see **"Your service is live"** → copy the URL like `https://executive-flow.onrender.com`

---

## STEP 3 — Seed MongoDB with Demo Data

After deployment, run seed locally:

```bash
# Clone your repo
git clone https://github.com/Akshatj0707/Productivity-dashboard.git
cd Productivity-dashboard

# Install dependencies
npm install

# Create .env file
echo 'MONGODB_URI=mongodb+srv://efadmin:YOURPASSWORD@cluster0.xxxxx.mongodb.net/executiveflow?retryWrites=true&w=majority' > .env

# Run seed script
npm run seed
```

You should see:
```
Connected to MongoDB Atlas
Users seeded: 5
Tasks seeded: 10
Goals seeded: 5
Integrations seeded: 6
API Keys seeded: 3
Audit Logs seeded: 7
Notifications seeded: 6
Seed complete!
```

---

## STEP 4 — Test Your Live App

Open your Render URL (e.g. `https://executive-flow.onrender.com`)

### Demo Login Credentials:
| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@executiveflow.io | admin123 |
| **User** | alex@acme.com | user123 |

### Test the API:
```bash
# Health check
curl https://executive-flow.onrender.com/api/health

# Should return:
# {"status":"ok","database":"MongoDB Atlas Connected","version":"2.0.0",...}
```

---

## Troubleshooting

### App not starting on Render
- Check logs in Render dashboard → **Logs** tab
- Make sure `MONGODB_URI` is set correctly
- Make sure there are no spaces in env variable values

### MongoDB connection fails
- Check **Network Access** in Atlas — must have `0.0.0.0/0`
- Check username/password are correct in the URI
- Make sure password special characters are URL-encoded

### 503 Service Unavailable (Render free tier)
- Free tier spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- This is normal on free tier

---

## Re-deploy After Changes

```bash
# Make changes locally, then:
git add .
git commit -m "update: description of changes"
git push origin main
# Render auto-deploys within 2-3 minutes
```
