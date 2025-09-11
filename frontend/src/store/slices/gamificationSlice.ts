import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StudentStats, Achievement, Badge } from "../../types";

interface GamificationState {
  stats: StudentStats | null;
  achievements: Achievement[];
  badges: Badge[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GamificationState = {
  stats: null,
  achievements: [],
  badges: [],
  isLoading: false,
  error: null,
};

const gamificationSlice = createSlice({
  name: "gamification",
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<StudentStats>) => {
      state.stats = action.payload;
    },
    addPoints: (state, action: PayloadAction<number>) => {
      if (state.stats) {
        state.stats.totalPoints += action.payload;
        // Recalculate level based on points
        state.stats.level = Math.floor(Math.sqrt(state.stats.totalPoints / 100)) + 1;
      }
    },
    updateStreak: (state, action: PayloadAction<number>) => {
      if (state.stats) {
        state.stats.streak = action.payload;
      }
    },
    incrementLessonsCompleted: (state) => {
      if (state.stats) {
        state.stats.lessonsCompleted += 1;
      }
    },
    incrementGamesPlayed: (state) => {
      if (state.stats) {
        state.stats.gamesPlayed += 1;
      }
    },
    addTimeSpent: (state, action: PayloadAction<number>) => {
      if (state.stats) {
        state.stats.totalTimeSpent += action.payload;
      }
    },
    setAchievements: (state, action: PayloadAction<Achievement[]>) => {
      state.achievements = action.payload;
    },
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      state.achievements.push(action.payload);
      if (state.stats) {
        state.stats.badgesEarned += 1;
      }
    },
    setBadges: (state, action: PayloadAction<Badge[]>) => {
      state.badges = action.payload;
    },
    addBadge: (state, action: PayloadAction<Badge>) => {
      state.badges.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetGamification: (state) => {
      state.stats = null;
      state.achievements = [];
      state.badges = [];
      state.error = null;
    },
  },
});

export const {
  setStats,
  addPoints,
  updateStreak,
  incrementLessonsCompleted,
  incrementGamesPlayed,
  addTimeSpent,
  setAchievements,
  addAchievement,
  setBadges,
  addBadge,
  setLoading,
  setError,
  clearError,
  resetGamification,
} = gamificationSlice.actions;

export { gamificationSlice };
export default gamificationSlice.reducer;
