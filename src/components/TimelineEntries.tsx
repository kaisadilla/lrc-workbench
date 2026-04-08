import type { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Fmt from '../Fmt';
import MathExt from '../MathExt';
import styles from './TimelineEntries.module.scss';

export interface TimelineEntryData {
  time: number;
  content: string;
}

export interface TimelineEntriesProps {
  msPerPx: number;
  data: TimelineEntryData[];
}

function TimelineEntries ({
  msPerPx,
  data,
}: TimelineEntriesProps) {
  const [y, setY] = useState(150);

  return (
    <div
      className={styles.entryFrame}
    >
      <div
        className={styles.entryContainer}
      >
        <TimelineEntry
          msPerPx={msPerPx}
          content="Then I said 'hi' because it was illegal not to :( This will, in fact, be an extremely extreme extremature which is not ever to be seen quite actually."
          y={y}
          onMove={setY}
        />
      </div>
    </div>
  );
}

interface TimelineEntryProps {
  msPerPx: number;
  content: string;
  y: number;
  onMove?: (yNew: number) => void;
}

function TimelineEntry ({
  msPerPx,
  content,
  y: nativeY,
  onMove,
}: TimelineEntryProps) {
  const [y, setY] = useState(nativeY);

  const elRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setY(nativeY);
  }, [nativeY]);

  useEffect(() => {
    const el = elRef.current;
    const handle = handleRef.current;
    if (!el || !handle) return;

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

        setY(yUpdate);
      },

      onDrop ({ location }) {
        preventUnhandled.stop();
        
        const yUpdate = getDragPos(location);

        onMove?.(yUpdate);
      }
    });
  }, [y]);

  const ms = y * msPerPx;

  const ts = Fmt.timestamp(ms / 1000, 3);

  return (
    <div
      ref={elRef}
      className={styles.entry}
      style={{
        "--top": `${y}px`,
      } as CSSProperties}
    >
      <div
        ref={handleRef}
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
        <div className={styles.content}>
          {content}
        </div>
      </div>
    </div>
  );

  function getDragPos (location: DragLocationHistory) {
    const rect = elRef.current!.parentElement!.getBoundingClientRect();

    return MathExt.clamp(
      location.current.input.clientY - rect.top,
      0,
      rect.height
    );
  }
}


export default TimelineEntries;
