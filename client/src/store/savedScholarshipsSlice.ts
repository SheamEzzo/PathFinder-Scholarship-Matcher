import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
interface SavedScholarshipsState {
  savedIds: number[];
}
const initialState: SavedScholarshipsState = { savedIds: [] };

const savedScholarshipsSlice = createSlice({
  name: "savedScholarships",
  initialState,
  reducers: {
    setSavedIds(state: SavedScholarshipsState, action: PayloadAction<number[]>) {
      state.savedIds = action.payload;
    },
    setScholarshipFavorite(
      state: SavedScholarshipsState,
      action: PayloadAction<{ id: number; saved: boolean }>,
    ) {
      const { id, saved } = action.payload;
      if (saved && !state.savedIds.includes(id)) state.savedIds.push(id);
      if (!saved)
        state.savedIds = state.savedIds.filter((savedId) => savedId !== id);
    },
  },
});
export function selectSavedCount(state: RootState) {
  return state.savedScholarships.savedIds.length;
}
export const { setSavedIds, setScholarshipFavorite } =
  savedScholarshipsSlice.actions;
export default savedScholarshipsSlice.reducer;