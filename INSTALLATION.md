# 🚀 Mini ClickUp - Installation Guide

**Version:** 0.1.0  
**Last Updated:** 2026-03-17  
**Status:** Sprint 0 Complete - Ready for Testing  

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | v24.10.0+ | https://nodejs.org/ |
| **npm** | v11.6.1+ | Included with Node.js |
| **Git** | v2.46.2+ | https://git-scm.com/ |
| **MongoDB** | v8.x+ | See options below |

---

## 🗄️ MongoDB Setup (REQUIRED)

You have **TWO options** for MongoDB:

### Option A: MongoDB Local (Recommended for Development)

**Step 1: Download**
- Windows: https://www.mongodb.com/try/download/community
- Select: MongoDB Community Server → Windows → x64 → MSI

**Step 2: Install**
1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. Select "Install MongoDB as a Service"
4. Keep default settings (Data Directory: `C:\Program Files\MongoDB\Server\8.0\data`)

**Step 3: Verify Installation**
```bash
# Open PowerShell as Administrator
mongosh --version

# Should output something like: 2.x.x
```

**Step 4: Start MongoDB Service**
```bash
# If not already running
net start MongoDB
```

**Step 5: Update server/.env**
```env
MONGODB_URI=mongodb://localhost:27017/mini-clickup
```

---

### Option B: MongoDB Atlas (Cloud - Free Tier)

**Step 1: Create Account**
- Go to: https://www.mongodb.com/cloud/atlas
- Sign up for free account

**Step 2: Create Cluster**
1. Click "Build a Database"
2. Select "FREE" tier (M0 Sandbox)
3. Choose AWS → Your nearest region
4. Click "Create Cluster"

**Step 3: Configure Access**
1. **Database Access:** Create a database user
   - Username: `miniclickup`
   - Password: (generate a strong password, save it!)
   - Role: Read and write to any database

2. **Network Access:** Add your IP address
   - Click "Add Your Current IP Address"
   - Or use `0.0.0.0/0` for development (allows all IPs)

**Step 4: Get Connection String**
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `mini-clickup`

**Step 5: Update server/.env**
```env
MONGODB_URI=mongodb+srv://miniclickup:<password>@cluster0.xxxxx.mongodb.net/mini-clickup?retryWrites=true&w=majority
```

---

## 📦 Installation Steps

### Step 1: Clone Repository

```bash
cd C:\Users\norberto.lodela
git clone git@github.com:lodela/mini-clickup.git
cd mini-clickup
```

### Step 2: Install Root Dependencies

```bash
npm install
```

### Step 3: Install Client Dependencies

```bash
cd client
npm install
cd ..
```

### Step 4: Install Server Dependencies

```bash
cd server
npm install
cd ..
```

### Step 5: Configure Environment Variables

**Client (.env):**
```bash
cd client
copy .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Mini ClickUp
```

**Server (.env):**
```bash
cd server
copy .env.example .env
```

Edit `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mini-clickup
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANT:** Change `JWT_SECRET` to a random string for production!

---

## ▶️ Start Development

### Start Both Servers (Frontend + Backend)

```bash
npm run dev
```

This will start:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **Socket.IO:** http://localhost:5000/socket.io

### Start Separately (Optional)

**Frontend only:**
```bash
npm run dev:client
```

**Backend only:**
```bash
npm run dev:server
```

---

## ✅ Verify Installation

### 1. Check Frontend

Open browser: http://localhost:5173

You should see the **Login page** with:
- Email input
- Password input
- "Sign In" button
- "Sign up" link

### 2. Check Backend

Open browser: http://localhost:5000/api/health

You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-03-17T16:45:00.000Z"
}
```

### 3. Check MongoDB Connection

Look at the terminal where you ran `npm run dev`:

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
📡 Socket.IO ready
🌍 Environment: development
```

---

## 🧪 Test Authentication Flow

### 1. Register New Account

1. Click "Sign up" on login page
2. Fill in:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test1234!`
   - Confirm Password: `Test1234!`
3. Click "Create Account"

**Expected Result:**
- Redirects to Dashboard
- Shows welcome message with your name
- Socket.IO shows "Connected" status

### 2. Test Logout

1. Click the logout icon (door) in the sidebar
2. Should redirect to Login page

### 3. Test Login

1. Enter credentials: `test@example.com` / `Test1234!`
2. Click "Sign In"

**Expected Result:**
- Redirects to Dashboard
- User info shows in sidebar

---

## 🐛 Troubleshooting

### Error: MongoDB connection failed

**Solution:**
1. Verify MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Or check MongoDB Atlas connection
   ```

2. Check `server/.env` has correct `MONGODB_URI`

3. Restart server:
   ```bash
   npm run dev:server
   ```

---

### Error: Port 5000 already in use

**Solution:**
1. Find and kill process using port 5000:
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. Or change port in `server/.env`:
   ```env
   PORT=5001
   ```

---

### Error: VITE_API_URL not defined

**Solution:**
1. Ensure `client/.env` exists
2. Run `npm run dev:client` again
3. Clear browser cache

---

### Error: Cannot find module 'xxx'

**Solution:**
```bash
# Reinstall dependencies
cd client
rm -rf node_modules package-lock.json
npm install

cd ../server
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

After successful installation:

1. **Explore the Dashboard**
   - Check stats cards
   - View recent activity feed
   - Test responsive design

2. **Review Code Structure**
   - Frontend: `client/src/`
   - Backend: `server/src/`
   - Documentation: `Documentacion/`

3. **Start Development**
   - Check Sprint Plan: `Documentacion/11_Sprint_Plan.md`
   - Review GitHub Issues: https://github.com/lodela/mini-clickup/issues

---

## 🆘 Getting Help

- **Documentation:** `Documentacion/00_Indice_General.md`
- **GitHub Issues:** https://github.com/lodela/mini-clickup/issues
- **Repository:** https://github.com/lodela/mini-clickup

---

**Installation Guide Version:** 1.0.0  
**Last Updated:** 2026-03-17  
**Maintained by:** Milly AI - Master Orchestrator
