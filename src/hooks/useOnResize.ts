import { useEffect, useRef, type RefObject } from "react";

export default function useOnResize<T extends Element> (
  ref: RefObject<T | null>,
  onResize: (e: ResizeObserverEntry) => void,
) {
  const callbackRef = useRef(onResize);
  callbackRef.current = onResize;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      callbackRef.current?.(entries[0]);
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [ref]);
}
