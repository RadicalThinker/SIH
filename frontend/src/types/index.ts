// User types
export interface User {
  id: string
  name: string
  email?: string
  pin?: string
  role: 'student' | 'teacher' | 'admin'
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Student extends User {
  role: 'student'
  grade: number
  classId: string
  pin: string
  stats: StudentStats
  preferences: StudentPreferences
}

export interface Teacher extends User {
  role: 'teacher'
  email: string
  classes: string[]
  subjects: string[]
}

export interface StudentStats {
  totalPoints: number
  level: number
  streak: number
  longestStreak?: number
  badgesEarned: number
  lessonsCompleted: number
  gamesPlayed: number
  totalTimeSpent: number // in minutes
}

export interface StudentPreferences {
  language: 'en' | 'hi' | 'or'
  theme: 'light' | 'dark' | 'auto'
  soundEnabled: boolean
  notificationsEnabled: boolean
}

// Content types
export interface Subject {
  id: string
  name: string
  description: string
  icon: string
  color: string
  grades: number[]
  totalLessons: number
}

export interface Lesson {
  id: string
  title: string
  description: string
  subjectId: string
  grade: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number // in minutes
  content: LessonContent
  games: string[]
  quiz: Quiz
  prerequisites: string[]
  learningObjectives: string[]
  tags: string[]
  isOfflineAvailable: boolean
  lastUpdated: Date
}

export interface LessonContent {
  text: string
  images: MediaFile[]
  videos: MediaFile[]
  interactive: InteractiveElement[]
  downloadSize: number // in bytes
}

export interface MediaFile {
  id: string
  url: string
  alt?: string
  caption?: string
  size: number
  format: string
}

export interface InteractiveElement {
  id: string
  type: 'simulation' | 'diagram' | 'calculator' | 'quiz'
  data: any
}

export interface Quiz {
  id: string
  questions: Question[]
  timeLimit?: number
  passingScore: number
}

export interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'drag-drop'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
}

// Game types
export interface Game {
  id: string
  title: string
  description: string
  type: 'puzzle' | 'simulation' | 'quiz' | 'adventure' | 'strategy'
  subject: string
  grade: number[]
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number
  assets: GameAssets
  leaderboard: boolean
  multiplayer: boolean
  isOfflineAvailable: boolean
  downloadSize: number
  version: string
}

export interface GameAssets {
  bundle: string
  images: string[]
  sounds: string[]
  data: string[]
}

export interface GameScore {
  id: string
  studentId: string
  gameId: string
  score: number
  timeSpent: number
  level: number
  metadata: GameMetadata
  timestamp: Date
  synced: boolean
}

export interface GameMetadata {
  correctAnswers?: number
  totalQuestions?: number
  hintsUsed?: number
  attemptsCount?: number
  [key: string]: any
}

// Progress tracking
export interface Progress {
  id: string
  studentId: string
  lessonId?: string
  gameId?: string
  type: 'lesson' | 'game' | 'quiz'
  status: 'not-started' | 'in-progress' | 'completed'
  score?: number
  timeSpent: number
  completedAt?: Date
  synced: boolean
  offline: boolean
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  criteria: AchievementCriteria
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
}

export interface AchievementCriteria {
  type: 'score' | 'streak' | 'completion' | 'time' | 'games'
  threshold: number
  subject?: string
  timeframe?: 'daily' | 'weekly' | 'monthly'
}

export interface Badge {
  id: string
  studentId: string
  achievementId: string
  earnedAt: Date
  synced: boolean
}

// Class and analytics
export interface Class {
  id: string
  name: string
  grade: number
  subject: string
  teacherId: string
  students: string[]
  createdAt: Date
}

export interface Analytics {
  engagement: number
  averageScore: number
  completionRate: number
  activeStudents: number
  totalStudents: number
  subjectPerformance: SubjectPerformance[]
  recentActivity: ActivityItem[]
}

export interface SubjectPerformance {
  subject: string
  averageScore: number
  completionRate: number
  timeSpent: number
}

export interface ActivityItem {
  id: string
  studentId: string
  studentName: string
  type: 'lesson' | 'game' | 'achievement'
  title: string
  score?: number
  timestamp: Date
}

// API types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Auth types
export interface AuthState {
  user: Student | Teacher | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  pin?: string
  className?: string
  email?: string
  password?: string
}

// Offline types
export interface OfflineData {
  lessons: Lesson[]
  games: Game[]
  progress: Progress[]
  lastSyncTimestamp: Date
}

export interface SyncData {
  progress: Progress[]
  achievements: Badge[]
  gameScores: GameScore[]
  lastSyncTimestamp: Date
}

// UI types
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface Modal {
  id: string
  type: string
  props: any
  isOpen: boolean
}

// Language types
export type Language = 'en' | 'hi' | 'or'

export interface LanguageOption {
  code: Language
  name: string
  nativeName: string
  flag: string
}

// Device and performance types
export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLowEnd: boolean
  connectionType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
  isOnline: boolean
}

export interface PerformanceMetrics {
  bundleSize: number
  loadTime: number
  memoryUsage: number
  batteryLevel?: number
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox'
  required: boolean
  validation?: any
  options?: { value: string; label: string }[]
}

// Chart types
export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
}

// Notification types
export interface Notification {
  id: string
  type: 'achievement' | 'reminder' | 'update' | 'social'
  title: string
  message: string
  icon?: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}
