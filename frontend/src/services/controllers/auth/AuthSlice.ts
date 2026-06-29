import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WorkspaceCode } from "@/common/utils/workspace";
import type { AuthResponse, AuthUser } from "@/services/types/apiType";

interface AuthState {
  user: AuthUser | null;
  activeWorkspace: WorkspaceCode | null;
}

const initialState: AuthState = {
  user: null,
  activeWorkspace: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearSession: () => initialState,
    setSession: (_state, action: PayloadAction<AuthResponse>) => ({
      user: action.payload.user ?? null,
      activeWorkspace: null,
    }),
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    setActiveWorkspace: (state, action: PayloadAction<WorkspaceCode | null>) => {
      state.activeWorkspace = action.payload;
    },
  },
});

export const { clearSession, setActiveWorkspace, setSession, setUser } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
