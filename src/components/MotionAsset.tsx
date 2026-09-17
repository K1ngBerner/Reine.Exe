import { translateTree } from "../i18n/tree";
import { useEffect, useRef, useState } from "react";
/** Optional replacement for heavy GIFs. No clip is fetched until interaction. */
export default function MotionAsset({
  poster,
  clip,
  alt,
  selected = false,
}: {
  poster: string;
  clip?: string;
  alt: string;
  selected?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const animate = !!clip && visible && !reduced && (hover || selected);
  useEffect(() => {
    if (animate) void video.current?.play().catch(() => {});
    else video.current?.pause();
  }, [animate]);
  return translateTree(
    <div
      ref={root}
      className="motion-asset"
      data-state={selected ? "selected" : hover ? "hover" : "idle"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      {clip ? (
        <video
          ref={video}
          src={animate ? clip : undefined}
          poster={poster}
          aria-label={alt}
          width="640"
          height="360"
          muted
          loop
          playsInline
          preload="none"
        />
      ) : (
        <img src={poster} alt={alt} width="640" height="360" loading="lazy" />
      )}
    </div>,
  );
}
