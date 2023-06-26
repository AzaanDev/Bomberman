import AuthSlice, { AuthState } from "./reducers/AuthSlice";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

export interface RootState {
  Auth: AuthState;
}

const rootReducer = combineReducers({
  Auth: AuthSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
