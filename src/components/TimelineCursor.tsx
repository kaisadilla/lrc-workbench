import type { CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import Fmt from '../Fmt';
import type { RootState } from '../state/store';
import type { DivProps } from '../types';
import { $cl } from '../util';
import styles from './TimelineCursor.module.scss';

export interface TimelineCursorProps extends DivProps {
  y: number;
  /**
   * The offset of the scroll, in pixels, of the timeline.
   */
  scrollOffset: number;
  /**
   * The amount of time, in seconds, that will be fit in one px.
   */
  msPerPx: number;
}

function TimelineCursor ({
  y,
  scrollOffset,
  msPerPx,
  className,
  style,
  ...divProps
}: TimelineCursorProps) {
  const file = useSelector((state: RootState) => state.file);

  const yAbs = scrollOffset + y;
  const time = yAbs * msPerPx;

  if (yAbs < 0) return null;

  let nextIndex = file.timestamps.findIndex(ts => ts > time);
  if (nextIndex === -1) nextIndex = file.timestamps.length;

  return (
    <div
      className={$cl(styles.cursor, className)}
      style={{
        "--top": `${y}px`,
        ...style,
      } as CSSProperties}
      {...divProps}
    >
      <div className={styles.line} />
      <div className={styles.time}>
        {Fmt.timestamp(time / 1000, 3)}
      </div>

      {nextIndex !== -1 && <div className={styles.next}>
        Next: "{file.lyrics[nextIndex]}"
      </div>}
    </div>
  );
}

export default TimelineCursor;
