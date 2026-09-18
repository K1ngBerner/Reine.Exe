import { useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { t, useLocale } from "../i18n";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "onError" | "srcSet"> & {
  fallback?: ReactNode;
};

/** The failed <img> is removed, not merely covered. A new src can load again. */
export default function SafeImage({ src, alt = "", className = "", fallback, width, height, style, ...props }: Props) {
  const locale = useLocale();
  const [failedSource, setFailedSource] = useState<string>();
  if (!src || failedSource === src) {
    return (
      <span
        className={`asset-fallback ${className}`}
        data-asset-fallback={src || "missing"}
        role={alt ? "img" : undefined}
        aria-label={alt ? t(alt) : undefined}
        aria-hidden={alt ? undefined : true}
        style={{ width: width ? Number(width) : undefined, maxWidth: "100%", aspectRatio: width && height ? `${width} / ${height}` : undefined, ...style }}
      >
        {fallback || <><span aria-hidden="true">▧</span><span>{locale === "pt" ? "ARQUIVO VISUAL" : "VISUAL ARCHIVE"}</span><strong>{t(alt)}</strong></>}
      </span>
    );
  }
  return <img {...props} src={src} alt={t(alt)} width={width} height={height} style={style} className={className || undefined} onError={() => setFailedSource(src)} />;
}
