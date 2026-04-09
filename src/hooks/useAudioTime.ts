import { useEffect } from "react";

export default function useAudioTime (
  ref: React.RefObject<HTMLAudioElement | null>,
  callback: (audio: HTMLAudioElement) => void,
) {
  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    let raf: number;

    function tick () {
      callback(audio!);
      raf = requestAnimationFrame(tick);
    }

    function onPlay () {
      raf = requestAnimationFrame(tick);
    }

    function onPause () {
      cancelAnimationFrame(raf);
    }

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      cancelAnimationFrame(raf);
    };
  }, []);
}
