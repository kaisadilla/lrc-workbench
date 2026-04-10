import type { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import { Tooltip } from '@mantine/core';
import { ListIcon, PlayIcon, TrashIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSongFile } from '../context/useSongFile';
import Fmt from '../Fmt';
import MathExt from '../MathExt';
import { fileActions } from '../state/fileSlice';
import type { RootState } from '../state/store';
import styles from './TimelineEntries.module.scss';

export interface TimelineEntryData {
  time: number;
  content: string;
}

export interface TimelineEntriesProps {
  msPerPx: number;
}

function TimelineEntries ({
  msPerPx,
}: TimelineEntriesProps) {
  const file = useSelector((state: RootState) => state.file);
  const dispatch = useDispatch();

  const songCtx = useSongFile();

  const [ focus, setFocus ] = useState(0);

  return (
    <div
      className={styles.entryFrame}
    >
      <div
        className={styles.entryContainer}
        onMouseUp={handleMouseUp}
      >
        {file.timestamps.map((t, i) => <TimelineEntry
          key={i}
          msPerPx={msPerPx}
          timestamp={t}
          index={i}
          focused={focus === i}
          onMove={handleMoveEntry}
          onDelete={handleDeleteEntry}
          onHighlight={handleHighlightEntry}
          onFocus={setFocus}
        />)}
      </div>
    </div>
  );

  function handleMoveEntry (index: number, timestamp: number) {
    dispatch(fileActions.moveTimestamp({ index, timestamp: timestamp, }));
  }

  function handleDeleteEntry (index: number) {
    dispatch(fileActions.deleteTimestamp(index));
  }

  function handleHighlightEntry (index: number) {
    songCtx.setHighlightedLine(index);
  }

  function handleMouseUp (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (evt.target !== evt.currentTarget) return;
    if (!songCtx.audioRef.current) return;

    const yAbs = evt.clientY - evt.currentTarget.getBoundingClientRect().top;

    const time = yAbs * msPerPx;
    if (time >= file.length) return;
    
    songCtx.audioRef.current.currentTime = time / 1000;
    songCtx.setTime(time);
  }
}

interface TimelineEntryProps {
  msPerPx: number;
  timestamp: number;
  index: number;
  focused?: boolean;
  onMove?: (index: number, newTimestamp: number) => void;
  onHighlight?: (index: number) => void;
  onDelete?: (index: number) => void;
  onFocus?: (index: number) => void;
}

function TimelineEntry ({
  msPerPx,
  timestamp,
  index,
  focused,
  onMove,
  onHighlight,
  onDelete,
  onFocus,
}: TimelineEntryProps) {
  const lyrics = useSelector((state: RootState) => state.file.lyrics);
  const songCtx = useSongFile();

  const [yDrag, setYDrag] = useState<number | null>(null);

  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    return draggable({
      element: el,
      dragHandle: el,

      onGenerateDragPreview (args) {
        disableNativeDragPreview(args);
      },

      onDragStart (args) {
        preventUnhandled.start();
      },

      onDrag ({ location }) {
        const yUpdate = getDragPos(location);

        setYDrag(yUpdate);
      },

      onDrop ({ location }) {
        preventUnhandled.stop();
        
        const yUpdate = getDragPos(location);

        setYDrag(null);
        onMove?.(index, getTimestamp(yUpdate));
      }
    });
  }, [yDrag]);

  const y = yDrag ?? getY();
  const ms = y * msPerPx;
  const ts = Fmt.timestamp(ms / 1000, 3);
  const line = lyrics[index] ?? null;

  return (
    <div
      ref={elRef}
      className={styles.entry}
      style={{
        "--top": `${y}px`,
      } as CSSProperties}
      onMouseDown={handleMouseDown}
      data-focused={focused}
    >
      <div
        className={styles.handle}
      >
        
      </div>

      <div className={styles.bridge} />

      <div className={styles.body}>
        <div className={styles.timestampContainer}>
          <div className={styles.timestamp}>
            {ts.slice(0, -4)}
            <span className={styles.ms}>{ts.slice(-4)}</span>
          </div>
        </div>

        {songCtx.fileUrl && <Tooltip label="Play exactly from here">
          <button
            className={styles.playButton}
            draggable={false}
            onMouseUp={handlePlay}
          >
            <PlayIcon />
          </button>
        </Tooltip>}

        {line && <Tooltip label="Select line in lyrics input">
          <button
            className={styles.selectLineButton}
            draggable={false}
            onMouseUp={handleSelectLine}
          >
            <ListIcon />
          </button>
        </Tooltip>}

        <div
          className={styles.content}
          data-exists={line !== null}
        >
          {line ?? "You've run out of lines! This line will be discarded."}
        </div>

        <Tooltip label="Remove line">
          <button
            className={styles.deleteButton}
            draggable={false}
            onMouseUp={handleDelete}
          >
            <TrashIcon />
          </button>
        </Tooltip>
      </div>
    </div>
  );

  function handleMouseDown () {
    onFocus?.(index);
  }

  function handlePlay () {
    if (!songCtx.audioRef.current) return;

    songCtx.audioRef.current.currentTime = ms / 1000;
    songCtx.setTime(ms);
  }

  function handleSelectLine () {
    onHighlight?.(index);
  }

  function handleDelete () {
    onDelete?.(index);
  }

  function getDragPos (location: DragLocationHistory) {
    const rect = elRef.current!.parentElement!.getBoundingClientRect();

    return MathExt.clamp(
      location.current.input.clientY - rect.top,
      0,
      rect.height
    );
  }

  function getY () {
    return timestamp / msPerPx;
  }

  function getTimestamp (yPos: number) {
    return yPos * msPerPx;
  }
}


export default TimelineEntries;
