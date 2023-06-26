import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../Store";

export interface AuthState {
  id: string | null;
  name: string | null;
  token: string | null;
}

const AuthSlice = createSlice({
  name: "auth",
  initialState: { id: null, token: null, name: null } as AuthState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      const { id, name, token } = action.payload;
      state.id = id;
      state.name = name;
      state.token = token;
    },
    clearCredentials: (state) => {
      state.id = null;
      state.name = null;
      state.token = null;
    },
  },
});

export const selectId = (state: RootState) => state.Auth.id;
export const selectName = (state: RootState) => state.Auth.name;
export const selectToken = (state: RootState) => state.Auth.token;
export const { setCredentials, clearCredentials } = AuthSlice.actions;

export default AuthSlice.reducer;
