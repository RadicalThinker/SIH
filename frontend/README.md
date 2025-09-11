# Rural Education Platform - Frontend

A modern, gamified learning platform built with React, TypeScript, and Tailwind CSS for rural education in STEM subjects (grades 6-12).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend server running on port 5000

### Installation
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── layout/       # Layout components
│   │   ├── games/        # Game-related components
│   │   └── gamification/ # Achievement and progress components
│   ├── pages/            # Page components
│   │   ├── auth/         # Login pages
│   │   ├── student/      # Student dashboard pages
│   │   └── teacher/      # Teacher dashboard pages
│   ├── store/            # Redux store configuration
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── i18n/             # Internationalization
│   └── db/               # Offline database (Dexie)
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🛣️ Frontend Routes & Navigation

### Public Routes
| Route | Component | Description | Access |
|-------|-----------|-------------|---------|
| `/` | `Home` | Landing page with login options | Public |
| `/student/login` | `StudentLogin` | Student authentication page | Public |
| `/teacher/login` | `TeacherLogin` | Teacher authentication page | Public |

### Student Routes (Protected)
| Route | Component | Description | Features |
|-------|-----------|-------------|----------|
| `/student` | `StudentDashboard` | Main student dashboard (index) | Points, Level, Streak |
| `/student/dashboard` | `StudentDashboard` | Main student dashboard | Points, Level, Streak |
| `/student/lessons` | `Lessons` | Available lessons by subject | Math, Science, CS |
| `/student/games` | `Games` | Educational games and puzzles | Math Puzzle, Science Quiz |
| `/student/progress` | `Progress` | Learning progress tracking | Charts, Statistics |
| `/student/game/:gameId` | `GameLoader` | Individual game interface | Real-time scoring |

### Teacher Routes (Protected)
| Route | Component | Description | Features |
|-------|-----------|-------------|----------|
| `/teacher/dashboard` | `TeacherDashboard` | Main teacher dashboard | Class overview, Quick stats |
| `/teacher/classes/:classId/roster` | `ClassRoster` | Student roster management | Student list, Performance |
| `/teacher/classes/:classId/analytics` | `Analytics` | Class performance analytics | Charts, Reports |

### Error Routes
| Route | Component | Description | Behavior |
|-------|-----------|-------------|----------|
| `*` | `NotFound` | 404 error page | User-friendly error display |

## 🧭 Navigation Flow

### Student Journey
```
Login (/student/login) → Dashboard (/student or /student/dashboard)
    ├── Lessons (/student/lessons) → Game (/student/games/:gameId)
    ├── Games (/student/games) → Game (/student/games/:gameId)
    └── Progress (/student/progress)
```

### Teacher Journey
```
Login (/teacher/login) → Dashboard (/teacher/dashboard)
    ├── Class Roster (/teacher/classes/:classId/roster)
    └── Analytics (/teacher/classes/:classId/analytics)
```

## 🔐 Route Protection

### Authentication Guards
- **Public Routes**: Accessible without login
- **Student Routes**: Require student authentication
- **Teacher Routes**: Require teacher authentication
- **Role-based Access**: Automatic redirection based on user type

### Route Components
```typescript
// Protected route wrapper
<ProtectedRoute userType="student">
  <StudentDashboard />
</ProtectedRoute>

// Automatic redirection for unauthorized access
if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}
```

## 🧩 Key Components

### UI Components (`src/components/ui/`)
- **LoadingSpinner**: Reusable loading indicator with size variants
- **Button**: Styled button component with variants
- **Input**: Form input components
- **Modal**: Dialog/modal components

### Authentication Components (`src/components/auth/`)
- **ProtectedRoute**: Route protection wrapper
- **AuthGuard**: Authentication state management

### Layout Components (`src/components/layout/`)
- **Layout**: Main application layout with header and navigation
- **Sidebar**: Navigation sidebar for different user types
- **Header**: Application header with user info

### Game Components (`src/components/games/`)
- **GameLoader**: Game loading and initialization
- **GameContainer**: Game wrapper component
- **ScoreDisplay**: Real-time scoring display

### Gamification Components (`src/components/gamification/`)
- **AchievementCard**: Achievement display cards
- **LevelProgress**: Level progression indicators
- **StreakCounter**: Daily streak tracking
- **ProgressRing**: Circular progress indicators

## 🎮 Games

### Available Games
1. **Math Puzzle** (`src/games/math-puzzle/`)
   - Interactive math problem solving
   - Multiple difficulty levels
   - Real-time feedback

2. **Science Quiz** (Planned)
   - Multiple choice science questions
   - Topic-based categorization
   - Timed challenges

3. **Code Challenge** (Planned)
   - Basic programming exercises
   - Visual programming interface
   - Step-by-step guidance

## 🔧 State Management

### Redux Store Structure
```typescript
{
  user: {
    isAuthenticated: boolean,
    user: User | null,
    role: 'student' | 'teacher' | 'admin'
  },
  gamification: {
    points: number,
    level: number,
    achievements: Achievement[],
    streak: number
  },
  games: {
    currentGame: Game | null,
    gameState: GameState,
    scores: Score[]
  }
}
```

### Key Actions
- `LOGIN` / `LOGOUT`: User authentication
- `ADD_POINTS`: Update user points
- `LEVEL_UP`: Level progression
- `START_GAME` / `END_GAME`: Game lifecycle
- `UPDATE_PROGRESS`: Learning progress tracking

## 🌐 Internationalization (i18n)

### Supported Languages
- English (`en`)
- Hindi (`hi`)
- Odia (`or`)

### Usage
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <h1>{t('welcome')}</h1>;
```

## 📱 Progressive Web App (PWA)

### Features
- Offline functionality
- Installable on mobile devices
- Push notifications (planned)
- Background sync

### Service Worker
- Caches static assets
- Handles offline requests
- Background data synchronization

## 🎨 Styling

### Tailwind CSS Configuration
- Custom color palette (primary, secondary, accent)
- Responsive design utilities
- Dark mode support (planned)
- Custom component classes

### Key Design System Colors
```css
.primary: #3B82F6 (Blue)
.secondary: #10B981 (Green)
.accent: #F59E0B (Amber)
.success: #10B981
.warning: #F59E0B
.error: #EF4444
```

## 🔌 Frontend-Backend Communication

### State Management Integration
The frontend communicates with the backend through Redux actions and API calls:

```typescript
// Example: Student login flow
dispatch(loginStudent({ pin, classId }))
  .then(() => navigate('/student/dashboard'))
  .catch((error) => showErrorToast(error.message));
```

### Data Flow
1. **User Actions** → Redux Actions → API Calls
2. **API Responses** → Redux State Updates → UI Re-renders
3. **Offline Queue** → Background Sync → Server Updates

### Real-time Features
- Live game scoring updates
- Progress synchronization
- Achievement notifications
- Offline data queuing

## 📊 Offline Support

### IndexedDB with Dexie
- Local game progress storage
- Offline lesson access
- Queued API requests for sync

### Background Sync
- Automatic data synchronization
- Conflict resolution
- Network status detection

## 🧪 Testing

### Test Structure
```
src/
├── __tests__/          # Unit tests
├── __mocks__/          # Mock data and functions
└── test-utils/         # Testing utilities
```

### Running Tests
```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Visual test runner
```

## 🚀 Deployment

### Build Process
```bash
npm run build         # Production build
npm run preview       # Preview production build
```

### Environment Variables
```env
VITE_API_URL=https://api.your-domain.com
VITE_APP_ENV=production
VITE_PWA_ENABLED=true
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] PWA manifest updated
- [ ] Service worker tested
- [ ] Offline functionality verified
- [ ] Performance optimized

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Ensure all tests pass
4. Create pull request with description
5. Code review and merge

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration
- Prettier code formatting
- Component naming conventions
- State management patterns

## 📈 Performance

### Optimization Features
- Code splitting with React.lazy()
- Image optimization
- Bundle analysis
- Caching strategies
- Progressive loading

### Performance Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors**: Clear node_modules and reinstall
2. **API Connection**: Check backend server status
3. **PWA Issues**: Clear browser cache and service worker
4. **Offline Sync**: Check IndexedDB storage

### Debug Commands
```bash
npm run dev -- --debug    # Debug mode
npm run build --analyze   # Bundle analysis
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Vite Guide](https://vitejs.dev/guide)

---

**Built with ❤️ for rural education**</content>
<parameter name="filePath">c:/f/WebDevDesktop/SIH/frontend/README.md
