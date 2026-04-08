import { memo, useEffect, useRef, useState, type CSSProperties } from 'react';
import Fmt from '../Fmt';
import useOnResize from '../hooks/useOnResize';
import type { DivProps } from '../types';
import { $cl } from '../util';
import { TimelineMetrics } from './LyricsTimeline';
import styles from './TimelineRuler.module.scss';

/**
 * The valid sizes for a step, in ms.
 */
const STEP_SIZES = [
  10, // 0.01 s
  100, // 0.1 s
  1000, // 1 s
  5000, // 5 s
  10_000, // 10 s
  20_000, // 20 s
  60_000, // 1 m
  120_000, // 2 m
  300_000, // 5 m
  600_000, // 10 m
];

interface TimestampLabel {
  time: number;
  yPos: number;
}

export interface TimelineRulerProps extends DivProps {
  /**
   * The total duration of the timeline, in seconds.
   */
  totalMs: number;
  /**
   * The amount of time, in seconds, that will be fit in one px.
   */
  msPerPx: number;
  /**
   * The offset of the scroll, in pixels, of the timeline.
   */
  scrollOffset: number;
}

const TimelineRuler = memo(function TimelineRuler ({
  totalMs,
  msPerPx,
  scrollOffset,
  className,
  style,
  ...divProps
}: TimelineRulerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [ canvasHeight, setCanvasHeight ] = useState(0);
  const [ tsLabels, setTsLabels ] = useState<TimestampLabel[]>([]);

  useOnResize(canvasRef, e => setCanvasHeight(e.contentRect.height));

  const msPerStep = getStep(msPerPx);
  const pxPerStep = msPerStep / msPerPx;

  const tlPixelHeight = totalMs / msPerPx;

  useEffect(() => {
    drawTimeline();
    calcLabels();
  }, [
    totalMs, msPerPx, scrollOffset, canvasRef, canvasHeight, setTsLabels
  ]);

  return (
    <div
      className={$cl(styles.timelineContainer, className)}
      style={{
        "--width": `${TimelineMetrics.rulerWidth}px`,
        ...style,
      } as CSSProperties}
      {...divProps}
    >
      <canvas
        ref={canvasRef}
        width={17}
      />

      <div
        className={styles.timeline}
        style={{
          "--timeline-height": `${tlPixelHeight}px`,
        } as CSSProperties}
      >

        {tsLabels.map((ts, i) => <_Timestamp
          key={i}
          timestamp={ts.time}
          y={ts.yPos}
        />)}
      </div>
    </div>
  );

  function drawTimeline () {
    const canvas = canvasRef.current;
    if (!canvas) return;

    //canvas.height = tlHeight;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const start = Math.max(-scrollOffset, 0);
    const end = Math.min(tlPixelHeight - scrollOffset, canvasHeight);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(8.5, start);
    ctx.lineTo(8.5, end);
    ctx.stroke();

    const startTimeMs = scrollOffset * msPerPx;
    const endTimeMs = (scrollOffset + canvasHeight) * msPerPx;

    const bigStepMs = msPerStep;
    let smallStepMs = Math.ceil(bigStepMs / 10);

    //if (smallStepMs === 500) smallStepMs = 1000;

    for (let ms = 0; ms < totalMs; ms += smallStepMs) {
      if (ms < startTimeMs || ms > endTimeMs) continue;

      const y = Math.floor((ms / totalMs) * tlPixelHeight) + 0.5;
      const yRel = y - scrollOffset;
      const xOffset = ms % bigStepMs === 0 ? 0 : 5;

      ctx.beginPath();
      ctx.moveTo(0 + xOffset, yRel);
      ctx.lineTo(17 - xOffset, yRel);
      ctx.stroke();
    }
  }

  function calcLabels () {
    const startTime = scrollOffset * msPerPx;
    const endTime = Math.min(
      (scrollOffset + canvasHeight) * msPerPx,
      totalMs
    );

    const firstLabelTime = Math.ceil((startTime / msPerStep)) * msPerStep;

    const labels: TimestampLabel[] = [];

    for (let ms = firstLabelTime; ms <= endTime; ms += msPerStep) {
      const y = (ms / totalMs) * tlPixelHeight;
      const yRel = y - scrollOffset;
      labels.push({ time: ms, yPos: yRel, });
    }

    if (endTime === totalMs) {
      const y = tlPixelHeight - scrollOffset;
      labels.push({ time: totalMs, yPos: y, });
    }

    setTsLabels(labels);
  }
});

interface _TimestampProps {
  timestamp: number;
  y: number;
}

function _Timestamp ({
  timestamp,
  y,
}: _TimestampProps) {
  const ts = Fmt.timestamp(timestamp / 1000, 3);

  return (
    <div
      className={styles.timestamp}
      style={{
        "--timestamp-y": `${y}px`,
      } as CSSProperties}
    >
      {ts.slice(0, -3)}
      <span className={styles.ms}>{ts.slice(-3)}</span>
    </div>
  );
}

function getStep (msPerPx: number) {
  let step = STEP_SIZES.find(ms => ms / msPerPx >= 60) ?? null;

  if (step === null) {
    step = 3_600_000;
    while (step / msPerPx < 60) {
      step *= 10;
    }
  }

  return step;
}

export default TimelineRuler;
