import { memo, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSongFile } from '../context/useSongFile';
import useScrollOffset from '../hooks/useScrollOffset';
import MathExt from '../MathExt';
import type { RootState } from '../state/store';
import type { Vec2 } from '../types';
import styles from './LyricsTimeline.module.scss';
import TimelineCursor from './TimelineCursor';
import TimelineEntries from './TimelineEntries';
import TimelineRuler from './TimelineRuler';

export const TimelineMetrics = {
  paddingY: 64,
  rulerWidth: 100,
};

export interface LyricsTimelineProps {

}

const LyricsTimeline = memo(function LyricsTimeline ({
  
}: LyricsTimelineProps) {
  const file = useSelector((state: RootState) => state.file);
  const dispatch = useDispatch();

  const songCtx = useSongFile();

  const elRef = useRef<HTMLDivElement>(null);
  const scrollableBoxRef = useRef<HTMLDivElement>(null);
  const scrollRatioRef = useRef(0);

  const [ zoom, setZoom ] = useState(1);
  const [ mousePos, setMousePos ] = useState<Vec2 | null>(null);

  const relScrollOffset = useScrollOffset(scrollableBoxRef);
  const scrollOffset = relScrollOffset - TimelineMetrics.paddingY;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [setZoom]);

  useEffect(() => {
    // TODO: Account of the position of the mouse.

    const el = scrollableBoxRef.current;
    if (!el) return;

    el.scrollTop = scrollRatioRef.current * el.scrollHeight;
  }, [zoom]);

  const msPerPx = 45 * Math.pow(1.5, -zoom);
  const tlHeight = file.length / msPerPx;

  const songCursorYAbs = (songCtx.time / msPerPx);
  const songCursorY = songCursorYAbs - scrollOffset;

  useEffect(() => {
    if (songCtx.isPlaying && scrollableBoxRef.current) {
      const rect = scrollableBoxRef.current.getBoundingClientRect();
      const yMaxView = rect.bottom + scrollOffset;

      if (songCursorYAbs < scrollOffset || songCursorYAbs > yMaxView) {
        scrollableBoxRef.current.scrollTop = songCursorYAbs - (rect.bottom / 2);
      }
    }
  }, [songCursorYAbs, songCtx.isPlaying]);

  return (
    <div
      ref={elRef}
      className={styles.element}
      style={{
        "--ruler-width": `${TimelineMetrics.rulerWidth}px`,
      } as CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <TimelineRuler
        className={styles.ruler}
        totalMs={file.length}
        msPerPx={msPerPx}
        scrollOffset={scrollOffset}
      />

      <div
        ref={scrollableBoxRef}
        className={styles.scrollableBox}
          style={{
            "--padding-y": `${TimelineMetrics.paddingY}px`,
          } as CSSProperties}
      >
        <div
          className={styles.itemContainer}
          style={{
            "--timeline-height": `${tlHeight}px`,
          } as CSSProperties}
        >
          <TimelineEntries
            msPerPx={msPerPx}
          />
        </div>
      </div>

      {mousePos !== null && <TimelineCursor
        style={{ zIndex: 10_010 }}
        y={mousePos.y}
        scrollOffset={scrollOffset}
        msPerPx={msPerPx}
      />}

      {songCtx.fileUrl && <TimelineCursor
        style={{
          '--color': "yellow",
          zIndex: 10_000,
        } as CSSProperties}
        y={songCursorY}
        scrollOffset={scrollOffset}
        msPerPx={msPerPx}
      />}
    </div>
  );

  function handleWheel (evt: WheelEvent) {
    if (!evt.ctrlKey) return;

    evt.preventDefault();
    setZoom(prev => MathExt.clamp(prev + (evt.deltaY > 0 ? -1 : 1), -10, 10));

    const box = scrollableBoxRef.current;
    if (!box) return;

    scrollRatioRef.current = box.scrollTop / box.scrollHeight;
  }

  function handleMouseMove (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setMousePos({
      x: evt.clientX - evt.currentTarget.getBoundingClientRect().left,
      y: evt.clientY - evt.currentTarget.getBoundingClientRect().top,
    });
  }

  function handleMouseLeave (
    evt: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    setMousePos(null);
  }
});

export default LyricsTimeline;
