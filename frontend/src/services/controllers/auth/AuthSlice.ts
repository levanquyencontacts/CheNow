import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, AuthUser } from "@/services/types/apiType";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearSession: () => initialState,
    setSession: (_state, action: PayloadAction<AuthResponse>) => ({
      accessToken: action.payload.accessToken,
      user: action.payload.user,
    }),
  },
});

export const { clearSession, setSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
