# Rural Education Gamified Learning Platform

A Progressive Web App (PWA) built with the MERN stack for rural education in grades 6-12, focusing on STEM subjects.

## 🎯 Features

- **Progressive Web App**: Installable on browsers, works offline
- **Student Authentication**: Simple PIN-based login system
- **Teacher Dashboard**: Class roster, progress tracking, analytics
- **Multilingual Support**: English, Odia, Hindi
- **Offline Learning**: Service Worker + IndexedDB for offline content
- **Gamification**: Points, badges, streaks, levels
- **Lazy-loaded Games**: HTML5/PhaserJS mini-games with code splitting
- **Performance Optimized**: For low-cost Android devices and low-bandwidth

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS for responsive design
- **State Management**: Redux Toolkit + RTK Query
- **PWA**: Workbox for service worker management
- **Offline Storage**: Dexie.js (IndexedDB wrapper)
- **Internationalization**: react-i18next
- **Charts**: Chart.js with react-chartjs-2
- **Game Engine**: Phaser 3 (lazy-loaded)

### Backend (Node.js + Express)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt for PIN hashing
- **File Upload**: Multer for content uploads
- **Validation**: Joi for request validation
- **Logging**: Winston for application logs

### Database (MongoDB)
- **Collections**: users, classes, subjects, lessons, games, progress, achievements
- **Indexing**: Optimized for quick queries
- **Aggregation**: For analytics and progress tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd rural-education-platform
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Setup
```bash
# Backend (.env)
cp backend/.env.example backend/.env

# Frontend (.env)
cp frontend/.env.example frontend/.env
```

4. Start MongoDB service

5. Run the application
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

## 📱 Performance Optimizations

- **Code Splitting**: Dynamic imports for games and heavy components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack Bundle Analyzer
- **Caching Strategy**: Aggressive caching for static assets
- **Compression**: Gzip/Brotli compression
- **Lazy Loading**: Images and components loaded on demand

## 🌐 Offline Strategy

- **Critical Resources**: Cached immediately (app shell, core CSS/JS)
- **Content**: Cached on first access (lessons, quizzes)
- **Games**: Cached when accessed
- **Progress Sync**: Background sync when online

## 🎮 Game Integration

Games are dynamically imported to reduce initial bundle size:

```typescript
const GameComponent = lazy(() => import('./games/MathPuzzle'));
```

## 📊 Analytics & Progress Tracking

- Student progress visualization
- Class performance analytics
- Engagement metrics
- Learning path recommendations

## 🔧 Development

### Code Structure
```
├── frontend/          # React TypeScript frontend
├── backend/           # Node.js Express backend
├── shared/            # Shared types and utilities
└── docs/              # Documentation
```

### Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Build for Production
```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
