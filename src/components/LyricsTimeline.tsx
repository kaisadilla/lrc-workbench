import { memo, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useSelector } from 'react-redux';
import useScrollOffset from '../hooks/useScrollOffset';
import MathExt from '../MathExt';
import type { RootState } from '../state/store';
import styles from './LyricsTimeline.module.scss';
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

  const elRef = useRef<HTMLDivElement>(null);
  const scrollableBoxRef = useRef<HTMLDivElement>(null);
  const scrollRatioRef = useRef(0);

  const [ zoom, setZoom ] = useState(1);

  const scrollOffset = useScrollOffset(scrollableBoxRef);

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

  return (
    <div
      ref={elRef}
      className={styles.element}
      style={{
        "--ruler-width": `${TimelineMetrics.rulerWidth}px`,
      } as CSSProperties}
    >
      <TimelineRuler
        className={styles.ruler}
        totalMs={file.length}
        msPerPx={msPerPx}
        scrollOffset={scrollOffset - TimelineMetrics.paddingY}
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
            data={[]}
          />
        </div>
      </div>
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
});

export default LyricsTimeline;
