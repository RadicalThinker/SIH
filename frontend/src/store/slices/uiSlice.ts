import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  isOnline: boolean;
  language: 'en' | 'hi' | 'or';
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: Date;
  read: boolean;
}

const initialState: UIState = {
  isLoading: false,
  error: null,
  success: null,
  isOnline: navigator.onLine,
  language: 'en',
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'hi' | 'or'>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      };
      state.notifications.unshift(notification);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccess,
  clearMessages,
  setOnlineStatus,
  setLanguage,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearAllNotifications,
} = uiSlice.actions;

export { uiSlice };
export default uiSlice.reducer;
