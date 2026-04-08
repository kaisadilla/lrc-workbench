import { useEffect, useState, type RefObject } from "react";

export default function useScrollOffset<T extends Element> (
  ref: RefObject<T | null>,
) {
  const [ offset, setOffset ] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleScroll () {
      if (!el) return;

      setOffset(el.scrollTop);
    }

    el.addEventListener('scroll', handleScroll);

    return () => el.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return offset;
}
