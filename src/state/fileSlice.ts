import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Lrc } from 'lrc-kit';
import { TOOL_FULL_NAME, TOOL_VERSION } from "../Constants";
import Fmt from "../Fmt";
import Local from "../Local";

export interface FileSlice {
  /**
   * The length of the song, in milliseconds.
   */
  length: number;
  offset: number;
  title: string;
  artist: string;
  album: string;
  author: string;
  lyricist: string;
  by: string;
  lyrics: string[];
  timestamps: number[];
}

const initialState: FileSlice = Local.loadFile() ?? newFile();

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    restart (state, action: PayloadAction) {
      return newFile();
    },

    openFile (state, action: PayloadAction<string>) {
      const file = action.payload;

      return openFile(file);
    },

    updateLength (state, action: PayloadAction<number>) {
      const ms = action.payload;

      state.length = ms;
    },

    updateDataField (state, action: PayloadAction<{
      field: 'title' | 'artist' | 'album' | 'author' | 'lyricist' | 'by',
      value: string,
    }>) {
      const { field, value } = action.payload;

      state[field] = value;
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

function newFile () : FileSlice {
  return {
    length: 60_000,
    offset: 0,
    title: "",
    artist: "",
    album: "",
    author: "",
    lyricist: "",
    by: "",
    lyrics: [],
    timestamps: [],
  };
}

function openFile (content: string) : FileSlice {
  const lrc = Lrc.parse(content);

  const lengthStr = lrc.info.length ?? "01:00";
  const [minutes, seconds] = lengthStr.split(':').map(Number);

  const length = (minutes * 60 + seconds) * 1000;
  const offset = parseFloat(lrc.info.offset ?? "0") / 1000;

  const lyrics = lrc.lyrics.map(l => l.content);
  const timestamps = lrc.lyrics.map(l => Math.floor(l.timestamp * 1000));

  console.log(lrc);

  return {
    length,
    offset,
    title: lrc.info.ti ?? "",
    artist: lrc.info.ar ?? "",
    album: lrc.info.al ?? "",
    author: lrc.info.au ?? "",
    lyricist: lrc.info.r ?? "",
    by: lrc.info.by ?? "",
    lyrics,
    timestamps,
  }
}

export function generateLrcFile (file: FileSlice) : string {
  const lines: string[] = [];

  lines.push(`[length:${Fmt.timestamp(file.length / 1000, 0, 'm')}]`);

  if (file.offset !== 0) lines.push(`[offset:${file.offset}]`);
  if (file.title) lines.push(`[ti:${file.title}]`);
  if (file.artist) lines.push(`[ar:${file.artist}]`);
  if (file.album) lines.push(`[al:${file.album}]`);
  if (file.author) lines.push(`[au:${file.author}]`);
  if (file.lyricist) lines.push(`[lr:${file.lyricist}]`);
  if (file.by) lines.push(`[by:${file.by}]`);

  lines.push(`[re:${TOOL_FULL_NAME}]`);
  lines.push(`[ve:${TOOL_VERSION}]`);

  for (let i = 0; i < file.timestamps.length; i++) {
    if (i >= file.lyrics.length) break;

    const ts = file.timestamps[i];
    const line = file.lyrics[i];
    lines.push(`[${Fmt.timestamp(ts / 1000, 2, 'm')}]${line}`);
  }

  return lines.join("\n");
}

function sortTimestamps (timestamps: number[]) {
  timestamps.sort((a, b) => a - b);
}

export const fileReducer = fileSlice.reducer;
export const fileActions = fileSlice.actions;
