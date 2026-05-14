import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, saveAuth, clearAuth, getStoredUser, getStoredToken, type User, type LoginData, type RegisterData } from '../../api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: getStoredUser(),
  token: getStoredToken(),
  isLoading: false,
  isAuthenticated: !!getStoredToken() && !!getStoredUser(),
  error: null,
};

// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginData, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);

      if (response.success && response.data) {
        saveAuth(response.data);
        return response.data;
      }

      // Success is false - return the error message from API
      return rejectWithValue(response.message || 'Invalid email or password');
    } catch (err: unknown) {
      // Network or server error
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        return rejectWithValue(axiosErr.response?.data?.message || 'Connection failed. Please try again.');
      }
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

// Register thunk
export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);

      if (response.success && response.data) {
        saveAuth(response.data);
        return response.data;
      }

      return rejectWithValue(response.message || 'Registration failed');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        return rejectWithValue(axiosErr.response?.data?.message || 'Registration failed');
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout errors
    } finally {
      clearAuth();
    }
    return null;
  }
);

// Fetch current user
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.me();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch user');
    } catch (err) {
      return rejectWithValue('Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Fetch current user
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;