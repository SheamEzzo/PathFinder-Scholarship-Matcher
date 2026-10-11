import { configureStore } from "@reduxjs/toolkit";
import savedScholarshipsReducer from "./savedScholarshipsSlice";
const store = configureStore({
  reducer: { savedScholarships: savedScholarshipsReducer },
});
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export type { RootState, AppDispatch };
export default store;