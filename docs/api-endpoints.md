# API Endpoints Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
- **Type**: JWT Token
- **Header**: `Authorization: Bearer <token>`
- **Student Login**: PIN-based authentication

---

## 🔐 Authentication Endpoints

### Student Login
```http
POST /auth/student/login
Content-Type: application/json

{
  "pin": "1234",
  "classId": "class_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "student_id",
    "name": "Student Name",
    "grade": 8,
    "classId": "class_id",
    "avatar": "avatar_url",
    "stats": {
      "totalPoints": 1250,
      "level": 5,
      "streak": 7
    }
  }
}
```

### Teacher Login
```http
POST /auth/teacher/login
Content-Type: application/json

{
  "email": "teacher@school.com",
  "password": "password123"
}
```

### Refresh Token
```http
POST /auth/refresh
Authorization: Bearer <refresh_token>
```

---

## 👨‍🎓 Student Endpoints

### Get Student Profile
```http
GET /students/profile
Authorization: Bearer <token>
```

### Update Student Progress
```http
PUT /students/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "lessonId": "lesson_id",
  "gameId": "game_id",
  "score": 85,
  "timeSpent": 300,
  "completed": true
}
```

### Get Student Dashboard
```http
GET /students/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "recentLessons": [...],
  "nextLessons": [...],
  "achievements": [...],
  "stats": {
    "totalPoints": 1250,
    "level": 5,
    "streak": 7,
    "badgesEarned": 12
  }
}
```

### Get Student Achievements
```http
GET /students/achievements
Authorization: Bearer <token>
```

---

## 👨‍🏫 Teacher Endpoints

### Get Teacher Dashboard
```http
GET /teachers/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "classes": [...],
  "totalStudents": 45,
  "activeStudents": 38,
  "recentActivity": [...],
  "analytics": {
    "engagement": 78,
    "averageScore": 82,
    "completionRate": 65
  }
}
```

### Get Class Roster
```http
GET /teachers/classes/:classId/students
Authorization: Bearer <token>
```

### Get Class Analytics
```http
GET /teachers/classes/:classId/analytics
Authorization: Bearer <token>
Query Parameters:
- period: daily|weekly|monthly
- subject: math|science|english
```

### Create Assignment
```http
POST /teachers/assignments
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Algebra Basics",
  "description": "Complete lessons 1-3",
  "classId": "class_id",
  "lessons": ["lesson1", "lesson2", "lesson3"],
  "dueDate": "2024-01-15",
  "points": 100
}
```

---

## 📚 Content Endpoints

### Get Subjects
```http
GET /content/subjects
Query Parameters:
- grade: 6|7|8|9|10|11|12
- language: en|hi|or
```

### Get Lessons by Subject
```http
GET /content/subjects/:subjectId/lessons
Query Parameters:
- grade: 6|7|8|9|10|11|12
- language: en|hi|or
```

### Get Lesson Content
```http
GET /content/lessons/:lessonId
Authorization: Bearer <token>
Query Parameters:
- language: en|hi|or
```

**Response:**
```json
{
  "id": "lesson_id",
  "title": "Introduction to Algebra",
  "description": "Learn basic algebraic concepts",
  "content": {
    "text": "...",
    "images": [...],
    "videos": [...],
    "interactive": [...]
  },
  "games": [...],
  "quiz": {...},
  "estimatedTime": 30,
  "difficulty": "beginner"
}
```

### Get Quiz Questions
```http
GET /content/lessons/:lessonId/quiz
Authorization: Bearer <token>
Query Parameters:
- language: en|hi|or
```

---

## 🎮 Game Endpoints

### Get Available Games
```http
GET /games
Query Parameters:
- subject: math|science|english
- grade: 6|7|8|9|10|11|12
- difficulty: easy|medium|hard
```

### Get Game Details
```http
GET /games/:gameId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "game_id",
  "title": "Math Puzzle Adventure",
  "description": "Solve puzzles to progress",
  "type": "puzzle",
  "subject": "math",
  "grade": [7, 8],
  "difficulty": "medium",
  "estimatedTime": 15,
  "assets": {
    "bundle": "/games/math-puzzle/bundle.js",
    "images": [...],
    "sounds": [...]
  },
  "leaderboard": true,
  "multiplayer": false
}
```

### Submit Game Score
```http
POST /games/:gameId/score
Authorization: Bearer <token>
Content-Type: application/json

{
  "score": 1250,
  "timeSpent": 180,
  "level": 5,
  "metadata": {
    "correctAnswers": 12,
    "totalQuestions": 15,
    "hintsUsed": 2
  }
}
```

### Get Game Leaderboard
```http
GET /games/:gameId/leaderboard
Authorization: Bearer <token>
Query Parameters:
- period: daily|weekly|monthly|all-time
- limit: 10 (default)
```

---

## 📊 Progress & Analytics Endpoints

### Get Student Progress
```http
GET /progress/student/:studentId
Authorization: Bearer <token>
Query Parameters:
- subject: math|science|english
- period: daily|weekly|monthly
```

### Get Class Progress
```http
GET /progress/class/:classId
Authorization: Bearer <token>
Query Parameters:
- subject: math|science|english
- period: daily|weekly|monthly
```

### Sync Offline Progress
```http
POST /progress/sync
Authorization: Bearer <token>
Content-Type: application/json

{
  "entries": [
    {
      "lessonId": "lesson_id",
      "gameId": "game_id",
      "score": 85,
      "timeSpent": 300,
      "timestamp": "2024-01-10T10:30:00Z",
      "offline": true
    }
  ]
}
```

---

## 🏆 Gamification Endpoints

### Get Achievements
```http
GET /gamification/achievements
Authorization: Bearer <token>
```

### Award Badge
```http
POST /gamification/badges
Authorization: Bearer <token>
Content-Type: application/json

{
  "badgeId": "first_lesson_complete",
  "studentId": "student_id"
}
```

### Get Leaderboard
```http
GET /gamification/leaderboard
Authorization: Bearer <token>
Query Parameters:
- scope: class|school|global
- period: daily|weekly|monthly|all-time
- limit: 20 (default)
```

### Update Streak
```http
PUT /gamification/streak
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "increment|reset"
}
```

---

## 📱 Offline & Sync Endpoints

### Get Offline Content
```http
GET /offline/content
Authorization: Bearer <token>
Query Parameters:
- grade: 6|7|8|9|10|11|12
- subjects: math,science,english
- language: en|hi|or
```

### Sync Data
```http
POST /sync
Authorization: Bearer <token>
Content-Type: application/json

{
  "progress": [...],
  "achievements": [...],
  "gameScores": [...],
  "lastSyncTimestamp": "2024-01-10T10:30:00Z"
}
```

---

## 🌐 Utility Endpoints

### Health Check
```http
GET /health
```

### Get App Configuration
```http
GET /config
Query Parameters:
- version: app_version
```

**Response:**
```json
{
  "supportedLanguages": ["en", "hi", "or"],
  "supportedGrades": [6, 7, 8, 9, 10, 11, 12],
  "subjects": [...],
  "features": {
    "offline": true,
    "games": true,
    "analytics": true
  },
  "limits": {
    "maxOfflineContent": "100MB",
    "maxFileSize": "10MB"
  }
}
```

### Upload Content (Admin)
```http
POST /admin/content/upload
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

{
  "file": <file>,
  "type": "lesson|game|image|video",
  "metadata": {...}
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "pin",
      "reason": "PIN must be 4 digits"
    }
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid input data
- `UNAUTHORIZED`: Invalid or missing token
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error
- `OFFLINE_MODE`: Feature not available offline
