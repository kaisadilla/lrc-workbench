import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { fileReducer } from "./fileSlice";

const rootReducer = combineReducers({
  file: fileReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
