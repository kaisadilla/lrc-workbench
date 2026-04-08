import { useEffect, type RefObject } from "react";

export default function useOnResize<T extends Element> (
  ref: RefObject<T | null>,
  onResize: (e: ResizeObserverEntry) => void,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      onResize(entries[0]);
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, onResize]);
}
