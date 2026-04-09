import { createContext, useContext, useEffect, useState } from "react";
import type { StateSetter } from "../types";

interface SongFileValue {
  fileUrl: string | null;
  isPlaying: boolean;
  time: number;
  setFileUrl: StateSetter<string | null>;
  setPlaying: StateSetter<boolean>;
  setTime: StateSetter<number>;
}

const SongFileContext = createContext(undefined as SongFileValue | undefined);

export const SongFileProvider = ({ children }: any) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    }
  }, [fileUrl]);

  return (
    <SongFileContext.Provider value={{
      fileUrl,
      isPlaying,
      time,
      setFileUrl,
      setPlaying,
      setTime,
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
