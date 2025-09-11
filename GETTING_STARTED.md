# 🚀 Getting Started - MERN Gamified Learning Platform

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

## Quick Start (5 minutes)

### 1. Clone and Setup
```bash
# Navigate to project directory
cd /f/WebDevDesktop/SIH

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cd ../backend
copy .env.example .env
```

Edit `.env` file with your settings:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/rural-education-platform

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 3. Start MongoDB
```bash
# Windows (if MongoDB is installed as service)
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 4. Start the Application
```bash
# Terminal 1: Start Backend Server
cd backend
npm run dev

# Terminal 2: Start Frontend Development Server
cd frontend
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs (if implemented)

---

## Detailed Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create `.env` file in `backend/` directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/rural-education-platform
   MONGODB_TEST_URI=mongodb://localhost:27017/rural-education-platform-test
   
   # Authentication
   JWT_SECRET=your-jwt-secret-key-minimum-32-characters-long
   JWT_EXPIRES_IN=7d
   BCRYPT_ROUNDS=12
   
   # File Upload
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # CORS
   CORS_ORIGIN=http://localhost:5173
   CORS_CREDENTIALS=true
   
   # Logging
   LOG_LEVEL=info
   LOG_FILE=./logs/app.log
   ```

3. **Start Backend**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   
   # Build TypeScript
   npm run build
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables** (Optional)
   Create `.env` file in `frontend/` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_APP_NAME=Rural Education Platform
   VITE_ENABLE_PWA=true
   ```

3. **Start Frontend**
   ```bash
   # Development mode
   npm run dev
   
   # Build for production
   npm run build
   
   # Preview production build
   npm run preview
   ```

---

## Database Setup

### MongoDB Local Installation

1. **Windows**
   ```bash
   # Download and install MongoDB Community Server
   # Start as Windows Service or manually:
   mongod --dbpath "C:\data\db"
   ```

2. **macOS**
   ```bash
   # Using Homebrew
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

3. **Linux (Ubuntu)**
   ```bash
   # Install MongoDB
   sudo apt update
   sudo apt install -y mongodb
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   ```

### MongoDB Atlas (Cloud) Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rural-education-platform
   ```

### Initial Data Seeding

```bash
# Run database seeder (if implemented)
cd backend
npm run seed

# Or manually create initial data through API endpoints
```

---

## Development Workflow

### 1. Start Development Servers
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev

# Terminal 3: MongoDB (if not running as service)
mongod
```

### 2. Access Development Tools
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB Compass**: mongodb://localhost:27017 (GUI for database)

### 3. Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

---

## Production Deployment

### Build for Production
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://your-domain.com
```

### Deploy Options
1. **Netlify/Vercel** (Frontend)
2. **Railway/Render** (Backend)
3. **MongoDB Atlas** (Database)
4. **Docker** (Full stack)

---

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   npx kill-port 5000
   
   # Kill process on port 5173
   npx kill-port 5173
   ```

2. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   mongo --eval "db.adminCommand('ismaster')"
   
   # Restart MongoDB service
   sudo systemctl restart mongod
   ```

3. **Dependencies Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **CORS Issues**
   - Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
   - Check that both servers are running on correct ports

### Performance Issues
- Enable hardware acceleration in browser
- Close unnecessary browser tabs
- Use Chrome DevTools to monitor performance
- Check network tab for slow requests

---

## Next Steps

1. **Explore the Application**
   - Create student and teacher accounts
   - Try the sample math puzzle game
   - Test offline functionality
   - Switch between languages

2. **Development**
   - Add new games in `frontend/src/games/`
   - Create new API endpoints in `backend/src/routes/`
   - Add new UI components in `frontend/src/components/`

3. **Customization**
   - Update branding in `frontend/public/manifest.json`
   - Modify color scheme in `frontend/tailwind.config.js`
   - Add new subjects/grades in database

4. **Testing**
   - Test on different devices and screen sizes
   - Verify offline functionality
   - Check performance on low-end devices

---

## Support & Documentation

- **API Documentation**: `/docs/api-endpoints.md`
- **Performance Guide**: `/docs/performance-optimization.md`
- **Architecture Overview**: `/README.md`
- **Library Recommendations**: `/docs/recommended-libraries.md`

Happy coding! 🎓✨
