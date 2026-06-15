import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, AuthUser } from "@/services/types/apiType";

interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearSession: () => initialState,
    setSession: (_state, action: PayloadAction<AuthResponse>) => ({
      user: action.payload.user ?? null,
    }),
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
  },
});

export const { clearSession, setSession, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
