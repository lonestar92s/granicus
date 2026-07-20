import { useEffect, useState } from "react";

/** Desktop / tablet+ page size at min-width 640px; mobile below. */
export function usePageSize(mobile = 10, desktop = 20): number {
  const [size, setSize] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches
      ? desktop
      : mobile,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setSize(mq.matches ? desktop : mobile);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [mobile, desktop]);

  return size;
}
