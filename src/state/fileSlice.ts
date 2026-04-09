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

    addTimestamp (state, action: PayloadAction<number>) {
      const timestamp = action.payload;

      state.timestamps.push(timestamp);
      sortTimestamps(state.timestamps);
    },

    deleteTimestamp (state, action: PayloadAction<number>) {
      const index = action.payload;

      state.timestamps.splice(index, 1);
    },

    moveTimestamp (state, action: PayloadAction<{
      index: number,
      timestamp: number,
    }>) {
      const { index, timestamp } = action.payload;

      if (index >= state.timestamps.length) {
        console.error("Timestamp is out of bounds.");
        return;
      }

      state.timestamps[index] = timestamp;
      sortTimestamps(state.timestamps);
    }
  },
});

function sortTimestamps (timestamps: number[]) {
  timestamps.sort((a, b) => a - b);
}

export const fileReducer = fileSlice.reducer;
export const fileActions = fileSlice.actions;
