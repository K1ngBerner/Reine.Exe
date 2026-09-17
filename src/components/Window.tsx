import { translateTree } from "../i18n/tree";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import LanguageToggle from "./LanguageToggle";
import { Minus, X, Maximize2 } from "lucide-react";
export default function Window({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const drag = useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);
  useEffect(() => {
    const el = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    el?.showModal();
    return () => {
      el?.close();
      previous?.focus();
    };
  }, []);
  return translateTree(
    <dialog
      ref={ref}
      className={`detail-window ${minimized ? "minimized" : ""}`}
      style={{ transform: `translate(${position.x}px,${position.y}px)` }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-label={title}
      onClick={(e) => {
        if (e.target === ref.current) {
          const r = ref.current.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <header
        className="window-title"
        onPointerDown={(e) => {
          if (
            window.innerWidth < 761 ||
            (e.target as HTMLElement).closest("button")
          )
            return;
          drag.current = {
            x: e.clientX,
            y: e.clientY,
            ox: position.x,
            oy: position.y,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const r = ref.current!.getBoundingClientRect();
          const maxX = Math.max(0, (window.innerWidth - r.width) / 2 - 8);
          const maxY = Math.max(0, (window.innerHeight - r.height) / 2 - 8);
          setPosition({
            x: Math.max(-maxX, Math.min(maxX, d.ox + e.clientX - d.x)),
            y: Math.max(-maxY, Math.min(maxY, d.oy + e.clientY - d.y)),
          });
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <span>{title}</span>
        <div>
          <LanguageToggle />
          <button
            aria-label={minimized ? "Restaurar janela" : "Minimizar janela"}
            onClick={() => setMinimized((v) => !v)}
          >
            {minimized ? <Maximize2 size={17} /> : <Minus size={17} />}
          </button>
          <button aria-label="Fechar janela" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </header>
      {minimized ? (
        <button className="restore-window" onClick={() => setMinimized(false)}>
          Janela minimizada · restaurar
        </button>
      ) : (
        <div className="window-body">{children}</div>
      )}
    </dialog>,
  );
}
