import { Student, Teacher, LoginCredentials, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async loginStudent(credentials: LoginCredentials) {
    return this.request<{ token: string; user: Student }>('/auth/student/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async loginTeacher(credentials: LoginCredentials) {
    return this.request<{ token: string; user: Teacher }>('/auth/teacher/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async verifyToken() {
    return this.request<{ user: Student | Teacher }>('/auth/verify');
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Student methods
  async getStudentProfile() {
    return this.request<Student>('/students/profile');
  }

  async updateStudentProgress(progressData: any) {
    return this.request('/students/progress', {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }

  async getStudentDashboard() {
    return this.request('/students/dashboard');
  }

  async getStudentAchievements() {
    return this.request('/students/achievements');
  }

  // Teacher methods
  async getTeacherDashboard() {
    return this.request('/teachers/dashboard');
  }

  async getClassRoster(classId: string) {
    return this.request(`/teachers/classes/${classId}/roster`);
  }

  async getClassAnalytics(classId: string) {
    return this.request(`/teachers/classes/${classId}/analytics`);
  }

  // Content methods
  async getLessons(grade?: number, subject?: string) {
    const params = new URLSearchParams();
    if (grade) params.append('grade', grade.toString());
    if (subject) params.append('subject', subject);
    
    return this.request(`/content/lessons?${params.toString()}`);
  }

  async getLesson(lessonId: string) {
    return this.request(`/content/lessons/${lessonId}`);
  }

  async getGames(grade?: number, subject?: string) {
    const params = new URLSearchParams();
    if (grade) params.append('grade', grade.toString());
    if (subject) params.append('subject', subject);
    
    return this.request(`/games?${params.toString()}`);
  }

  async getGame(gameId: string) {
    return this.request(`/games/${gameId}`);
  }

  // Progress methods
  async updateProgress(progressData: any) {
    return this.request('/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  async getProgress(studentId?: string) {
    const params = studentId ? `?studentId=${studentId}` : '';
    return this.request(`/progress${params}`);
  }

  // Gamification methods
  async getAchievements() {
    return this.request('/gamification/achievements');
  }

  async getLeaderboard(classId?: string) {
    const params = classId ? `?classId=${classId}` : '';
    return this.request(`/gamification/leaderboard${params}`);
  }

  // Sync methods
  async syncOfflineData(syncData: any) {
    return this.request('/sync', {
      method: 'POST',
      body: JSON.stringify(syncData),
    });
  }

  async getServerUpdates(lastSyncTimestamp: string) {
    return this.request(`/sync/updates?since=${lastSyncTimestamp}`);
  }
}

// Create and export a singleton instance
export const apiService = new ApiService(API_BASE_URL);
export default apiService;
