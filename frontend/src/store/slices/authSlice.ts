import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Student, Teacher, LoginCredentials } from "../../types";

interface AuthState {
  user: Student | Teacher | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks for API calls
export const loginStudent = createAsyncThunk(
  "auth/loginStudent",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const apiService = (await import("../../services/api")).default;
      const data = await apiService.loginStudent(credentials);
      if (data?.data?.token) {
        apiService.setToken(data.data.token);
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginTeacher = createAsyncThunk(
  "auth/loginTeacher",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const apiService = (await import("../../services/api")).default;
      const data = await apiService.loginTeacher(credentials);
      if (data?.data?.token) {
        apiService.setToken(data.data.token);
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;

      if (!token) {
        throw new Error("No token available");
      }

      const apiService = (await import("../../services/api")).default;
      const data = await apiService.verifyToken();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear token from localStorage and API service
      localStorage.removeItem('token');
      import("../../services/api").then(({ default: apiService }) => {
        apiService.setToken(null);
      });
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Student
      .addCase(loginStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
        state.error = null;
      })
      .addCase(loginStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Login Teacher
      .addCase(loginTeacher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
        state.error = null;
      })
      .addCase(loginTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Verify Token
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        if (action.payload) {
          state.user = action.payload.user;
        }
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setToken } = authSlice.actions;
export { authSlice };
export default authSlice.reducer;
