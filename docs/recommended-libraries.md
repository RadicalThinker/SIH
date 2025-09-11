# Recommended Libraries & Dependencies

## 📱 Frontend Dependencies (React + TypeScript)

### Core Framework & Build Tools
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "vite": "^4.4.0",
  "@vitejs/plugin-react": "^4.0.0"
}
```

### Styling & UI
```json
{
  "tailwindcss": "^3.3.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0",
  "@headlessui/react": "^1.7.0",
  "@heroicons/react": "^2.0.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^1.14.0"
}
```

### State Management & API
```json
{
  "@reduxjs/toolkit": "^1.9.0",
  "react-redux": "^8.1.0",
  "@reduxjs/toolkit/query/react": "^1.9.0",
  "redux-persist": "^6.0.0"
}
```

### Offline Storage (IndexedDB)
```json
{
  "dexie": "^3.2.0",
  "dexie-react-hooks": "^1.1.0",
  "@types/dexie": "^3.2.0"
}
```
**Why Dexie.js?**
- Modern Promise-based IndexedDB wrapper
- React hooks integration
- Excellent TypeScript support
- Built-in sync capabilities
- Small bundle size (~20KB)

### Internationalization (i18n)
```json
{
  "react-i18next": "^13.0.0",
  "i18next": "^23.0.0",
  "i18next-browser-languagedetector": "^7.1.0",
  "i18next-http-backend": "^2.2.0"
}
```
**Features:**
- Automatic language detection
- Lazy loading of translations
- Pluralization support for Hindi/Odia
- Namespace organization

### Charts & Analytics
```json
{
  "chart.js": "^4.3.0",
  "react-chartjs-2": "^5.2.0",
  "chartjs-adapter-date-fns": "^3.0.0",
  "date-fns": "^2.30.0"
}
```
**Why Chart.js?**
- Lightweight and performant
- Responsive by default
- Great mobile support
- Extensive customization
- Tree-shakable

### PWA & Service Worker
```json
{
  "workbox-webpack-plugin": "^7.0.0",
  "workbox-window": "^7.0.0",
  "@types/workbox-webpack-plugin": "^5.1.0"
}
```

### Game Engine (Lazy Loaded)
```json
{
  "phaser": "^3.70.0",
  "@types/phaser": "^3.70.0"
}
```

### Routing & Navigation
```json
{
  "react-router-dom": "^6.14.0",
  "@types/react-router-dom": "^5.3.0"
}
```

### Form Handling & Validation
```json
{
  "react-hook-form": "^7.45.0",
  "zod": "^3.21.0",
  "@hookform/resolvers": "^3.1.0"
}
```

### Utilities
```json
{
  "lodash-es": "^4.17.0",
  "@types/lodash-es": "^4.17.0",
  "date-fns": "^2.30.0",
  "uuid": "^9.0.0",
  "@types/uuid": "^9.0.0"
}
```

---

## 🔧 Backend Dependencies (Node.js + Express)

### Core Framework
```json
{
  "express": "^4.18.0",
  "@types/express": "^4.17.0",
  "cors": "^2.8.0",
  "@types/cors": "^2.8.0",
  "helmet": "^7.0.0",
  "compression": "^1.7.0"
}
```

### Database & ODM
```json
{
  "mongoose": "^7.4.0",
  "@types/mongoose": "^5.11.0",
  "mongodb": "^5.7.0"
}
```

### Authentication & Security
```json
{
  "jsonwebtoken": "^9.0.0",
  "@types/jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.0",
  "@types/bcryptjs": "^2.4.0",
  "express-rate-limit": "^6.8.0",
  "express-validator": "^7.0.0"
}
```

### File Upload & Processing
```json
{
  "multer": "^1.4.0",
  "@types/multer": "^1.4.0",
  "sharp": "^0.32.0",
  "mime-types": "^2.1.0",
  "@types/mime-types": "^2.1.0"
}
```

### Validation & Logging
```json
{
  "joi": "^17.9.0",
  "winston": "^3.10.0",
  "morgan": "^1.10.0",
  "@types/morgan": "^1.9.0"
}
```

### Environment & Configuration
```json
{
  "dotenv": "^16.3.0",
  "config": "^3.3.0"
}
```

### Development Tools
```json
{
  "nodemon": "^3.0.0",
  "ts-node": "^10.9.0",
  "typescript": "^5.0.0",
  "@types/node": "^20.4.0"
}
```

---

## 🎮 Gamification Libraries

### Badge & Achievement System
```typescript
// Custom implementation using MongoDB aggregation
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: {
    type: 'score' | 'streak' | 'completion' | 'time';
    threshold: number;
    subject?: string;
  };
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
```

### Progress Tracking
```json
{
  "progress-tracker": "custom implementation",
  "level-calculator": "custom implementation"
}
```

### Leaderboard System
```typescript
// Redis for real-time leaderboards (optional)
{
  "redis": "^4.6.0",
  "@types/redis": "^4.0.0"
}
```

---

## 📊 Performance Monitoring

### Bundle Analysis
```json
{
  "webpack-bundle-analyzer": "^4.9.0",
  "source-map-explorer": "^2.1.0"
}
```

### Performance Monitoring
```json
{
  "web-vitals": "^3.3.0",
  "@sentry/react": "^7.60.0",
  "@sentry/node": "^7.60.0"
}
```

---

## 🌐 Offline Strategy Implementation

### Service Worker Strategy
```typescript
// Using Workbox strategies
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';

// Cache strategies:
// 1. App Shell: CacheFirst
// 2. API Data: NetworkFirst with fallback
// 3. Games: CacheFirst with update
// 4. Images: StaleWhileRevalidate
```

### IndexedDB Schema (Dexie.js)
```typescript
import Dexie, { Table } from 'dexie';

interface OfflineLesson {
  id: string;
  title: string;
  content: string;
  games: string[];
  lastUpdated: Date;
  language: 'en' | 'hi' | 'or';
}

interface OfflineProgress {
  id: string;
  studentId: string;
  lessonId: string;
  score: number;
  timeSpent: number;
  completed: boolean;
  synced: boolean;
  timestamp: Date;
}

class OfflineDB extends Dexie {
  lessons!: Table<OfflineLesson>;
  progress!: Table<OfflineProgress>;
  games!: Table<any>;
  
  constructor() {
    super('RuralEducationDB');
    this.version(1).stores({
      lessons: 'id, language, lastUpdated',
      progress: 'id, studentId, lessonId, synced, timestamp',
      games: 'id, subject, grade'
    });
  }
}
```

---

## 🚀 Performance Optimizations

### Code Splitting Strategy
```typescript
// Route-based splitting
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const GameLoader = lazy(() => import('./components/GameLoader'));

// Component-based splitting
const Chart = lazy(() => import('./components/Chart'));
const GameEngine = lazy(() => import('./games/GameEngine'));

// Dynamic imports for games
const loadGame = async (gameId: string) => {
  const { default: Game } = await import(`./games/${gameId}/index.js`);
  return Game;
};
```

### Image Optimization
```json
{
  "imagemin": "^8.0.0",
  "imagemin-webp": "^7.0.0",
  "imagemin-mozjpeg": "^10.0.0",
  "imagemin-pngquant": "^9.0.0"
}
```

### Bundle Optimization
```typescript
// Vite configuration for optimal bundling
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          games: ['phaser'],
          i18n: ['react-i18next', 'i18next']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

---

## 📱 Mobile Optimization

### Touch & Gesture Support
```json
{
  "react-use-gesture": "^9.1.0",
  "framer-motion": "^10.12.0"
}
```

### Responsive Design Utilities
```json
{
  "react-responsive": "^9.0.0",
  "@types/react-responsive": "^8.0.0"
}
```

### Virtual Scrolling (for large lists)
```json
{
  "react-window": "^1.8.0",
  "@types/react-window": "^1.8.0",
  "react-window-infinite-loader": "^1.0.0"
}
```

---

## 🔧 Development & Testing

### Testing Framework
```json
{
  "@testing-library/react": "^13.4.0",
  "@testing-library/jest-dom": "^5.16.0",
  "@testing-library/user-event": "^14.4.0",
  "vitest": "^0.34.0",
  "jsdom": "^22.1.0"
}
```

### Code Quality
```json
{
  "eslint": "^8.45.0",
  "@typescript-eslint/eslint-plugin": "^6.2.0",
  "prettier": "^3.0.0",
  "husky": "^8.0.0",
  "lint-staged": "^13.2.0"
}
```

### API Mocking (Development)
```json
{
  "msw": "^1.2.0",
  "@mswjs/data": "^0.16.0"
}
```

---

## 📦 Recommended Package Manager

**Use pnpm for better performance and disk space efficiency:**
```bash
npm install -g pnpm
pnpm install
```

**Benefits:**
- Faster installation
- Shared dependencies across projects
- Better monorepo support
- Strict dependency resolution

---

## 🌍 Deployment & Hosting

### Frontend Hosting
- **Netlify**: Excellent for PWAs, automatic deployments
- **Vercel**: Great performance, edge functions
- **Firebase Hosting**: Good offline support

### Backend Hosting
- **Railway**: Simple deployment, good for MVPs
- **Render**: Free tier, automatic SSL
- **DigitalOcean App Platform**: Scalable, cost-effective

### Database
- **MongoDB Atlas**: Managed MongoDB, free tier available
- **Railway MongoDB**: Integrated with hosting platform

### CDN & Assets
- **Cloudinary**: Image optimization and delivery
- **AWS S3 + CloudFront**: Cost-effective for large files
