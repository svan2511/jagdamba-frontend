import { configureStore } from '@reduxjs/toolkit'
import authReducer, { login, logout, fetchCurrentUser, setUser, clearError, register } from './slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Re-export auth actions
export { login, logout, fetchCurrentUser, setUser, clearError, register }