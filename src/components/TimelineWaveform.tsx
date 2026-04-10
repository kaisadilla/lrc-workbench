import { memo, useEffect, useRef, useState } from 'react';
import { useSongFile } from '../context/useSongFile';
import useOnResize from '../hooks/useOnResize';
import { type Vec2 } from '../types';
import styles from './TimelineWaveform.module.scss';

const PADDING = 12;

export interface TimelineWaveformProps {
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

const TimelineWaveform = memo(function TimelineWaveform ({
  totalMs,
  msPerPx,
  scrollOffset,
}: TimelineWaveformProps) {
  console.log("redone");
  const songCtx = useSongFile();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [ canvasRect, setCanvasRect ] = useState<Vec2>({ x: 0, y: 0, });
  const [ sampleRate, setSampleRate ] = useState<number | null>(null);
  const [ audioData, setAudioData ]
    = useState<Float32Array<ArrayBuffer> | null>(null);

  useOnResize(canvasRef, evt => setCanvasRect({
    x: evt.contentRect.width,
    y: evt.contentRect.height,
  }));

  useEffect(() => {
    rebuildAudioData();
  }, [songCtx.fileUrl]);

  useEffect(() => {
    drawWaveform();
  }, [
    totalMs, msPerPx, scrollOffset, canvasRef, canvasRect, setCanvasRect
  ]);

  useEffect(() => {
    console.log("setCanvasRect");
  }, [setCanvasRect]);

  if (!songCtx.fileUrl) return null;

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
      />
    </div>
  );

  function drawWaveform () {
    console.log("waveform");
    if (!audioData) return;
    if (sampleRate === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasRect.x;
    canvas.height = canvasRect.y;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tlPixelHeight = totalMs / msPerPx;
    const start = Math.max(-scrollOffset, 0);
    const end = Math.min(tlPixelHeight - scrollOffset, canvasRect.y);

    ctx.clearRect(0, 0, canvasRect.x, canvasRect.y);
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary-l1')
      .trim();

    const maxWidth = canvasRect.x - (PADDING * 2);

    for (let y = start; y < end; y++) {
      const ms = (y + scrollOffset) * msPerPx;
      
      const index = Math.floor((ms / 1000) * sampleRate);
      const sample = Math.abs(audioData[index]);
      const barWidth = sample * maxWidth;
      const x = (maxWidth - barWidth) / 2;

      ctx.fillRect(x + PADDING, y, barWidth, 1);
    }
  }

  async function rebuildAudioData () {
    if (!songCtx.fileUrl) return;
    
    const resp = await fetch(songCtx.fileUrl);
    const buffer = await resp.arrayBuffer();
    const audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(buffer);

    const data = audioBuffer.getChannelData(0);
    setAudioData(data);
    setSampleRate(audioBuffer.sampleRate);
  }
});

export default TimelineWaveform;
