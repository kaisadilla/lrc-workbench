import { Slider, Tooltip } from '@mantine/core';
import { ArrowClockwiseIcon, PauseIcon, PlayIcon } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { useSongFile } from '../context/useSongFile';
import Fmt from '../Fmt';
import useAudioTime from '../hooks/useAudioTime';
import styles from './MusicPlayer.module.scss';

export interface MusicPlayerProps {
}

function MusicPlayer ({
}: MusicPlayerProps) {
  const songCtx = useSongFile();
  const audioRef = songCtx.audioRef;

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.pause();
  }, [songCtx.fileUrl]);

  useAudioTime(
    audioRef,
    a => songCtx.setTime(Math.floor(a.currentTime * 1000))
  );

  return (
    <div id="music-player" className={styles.container}>
      <audio
        ref={audioRef}
        src={songCtx.fileUrl ?? undefined}
      />

      <div className={styles.track}>
        <Slider
          classNames={{
            root: styles.sliderRoot,
            track: styles.sliderTrack,
            thumb: styles.sliderThumb,
          }}
          step={0.001}
          min={0}
          max={audioRef.current?.duration ?? 0}
          value={audioRef.current?.currentTime ?? 0}
          onChange={handleChangeTime}
          label={null}
        />
        <div className={styles.time}>
          {Fmt.timestamp(songCtx.time / 1000, 0, 'm')}
          &nbsp;/ {Fmt.timestamp(audioRef.current?.duration ?? 0, 0, 'm')}
        </div>
      </div>

      <div className={styles.controls}>
        <Tooltip
          label={songCtx.isPlaying ? "Pause" : "Play"}
        >
          <button
            id="music-player-play-button"
            className={styles.playPauseButton}
            onClick={handlePlay}
          >
            {songCtx.isPlaying && <PauseIcon />}
            {songCtx.isPlaying === false && <PlayIcon />}
          </button>
        </Tooltip>
        <Tooltip
          label={"Restart"}
        >
          <button
            onClick={handleReset}
          >
            <ArrowClockwiseIcon />
          </button>
        </Tooltip>
      </div>
    </div>
  );

  function handleChangeTime (s: number) {
    if (!audioRef.current) return;

    audioRef.current.currentTime = s;
    songCtx.setTime(Math.floor(s * 1000));
  }

  function handlePlay () {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      songCtx.setPlaying(true);
    }
    else {
      audioRef.current.pause();
      songCtx.setPlaying(false);
    }
  }

  function handleReset () {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play();
  }
}

export default MusicPlayer;
