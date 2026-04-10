import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { StateSetter } from "../types";

interface SongFileValue {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  fileUrl: string | null;
  isPlaying: boolean;
  time: number;
  highlightedLine: number | null;
  setFileUrl: StateSetter<string | null>;
  setPlaying: StateSetter<boolean>;
  setTime: StateSetter<number>;
  setHighlightedLine: StateSetter<number | null>;
}

const SongFileContext = createContext(undefined as SongFileValue | undefined);

export const SongFileProvider = ({ children }: any) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    }
  }, [fileUrl]);

  return (
    <SongFileContext.Provider value={{
      audioRef,
      fileUrl,
      isPlaying,
      time,
      highlightedLine,
      setFileUrl,
      setPlaying,
      setTime,
      setHighlightedLine,
    }}>
      {children}
    </SongFileContext.Provider>
  );
}

export function useSongFile () : SongFileValue {
  const ctx = useContext(SongFileContext);

  if (!ctx) {
    throw new Error("<SongFileProvider> not found.");
  }

  return ctx;
}
