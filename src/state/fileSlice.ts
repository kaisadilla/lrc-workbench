import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FileSlice {
  /**
   * The length of the song, in milliseconds.
   */
  length: number;
  lyrics: string[];
  timestamps: number[];
}

const initialState: FileSlice = {
  length: 60_000,
  lyrics: ["There's two lines", "Here's the second"],
  timestamps: [5200, 7750, 11030],
}

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    updateLength (state, action: PayloadAction<number>) {
      const ms = action.payload;

      state.length = ms;
    },

    updateLyrics (state, action: PayloadAction<string[]>) {
      const lyrics = action.payload;

      state.lyrics = lyrics;
    },
  },
});

export const fileReducer = fileSlice.reducer;
export const fileActions = fileSlice.actions;
