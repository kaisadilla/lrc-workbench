import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSongFile } from '../context/useSongFile';
import type { RootState } from '../state/store';
import styles from './Lyrics.module.scss';

export interface LyricsProps {
  
}

interface Line {
  content: string;
  timestamp: number;
}

function Lyrics (props: LyricsProps) {
  const file = useSelector((state: RootState) => state.file);
  const song = useSongFile();

  const [ lyrics, setLyrics ] = useState<Line[] | null>(null);

  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLyrics();
  }, [file.lyrics, file.timestamps]);

  const currentLine = useMemo(() => {
    if (!lyrics) return;

    let id = 0;

    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].timestamp <= song.time) id = i;
      else break;
    }

    console.log(id);

    return id;
  }, [lyrics, song.time]);

  useEffect(() => {
    activeLineRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [currentLine]);

  if (!song.fileUrl) return (
    <div className={styles.noLyrics}>
      (No song to play)
    </div>
  );

  if (!lyrics) return (
    <div className={styles.noLyrics}>
      Loading...
    </div>
  );

  return (
    <div className={styles.lyrics}>
      {lyrics.map((l, i) => <div
        key={i}
        ref={i === currentLine ? activeLineRef : null}
        className={styles.line}
        onClick={() => handleLyricsClick(l)}
        data-active={i === currentLine}
      >
        {l.content}
      </div>)}
    </div>
  );

  function handleLyricsClick (line: Line) {
    if (!song.audioRef.current) return;

    song.audioRef.current.currentTime = line.timestamp / 1000;
    song.setTime(line.timestamp);
  }
  
  function loadLyrics () {
    const lines: Line[] = [];

    for (let i = 0; i < file.timestamps.length && i < file.lyrics.length; i++) {
      lines.push({
        content: file.lyrics[i],
        timestamp: file.timestamps[i],
      });
    }
    
    setLyrics(lines);
  }
}

export default Lyrics;
