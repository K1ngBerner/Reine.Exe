import { translateTree } from "../i18n/tree";
import { t } from "../i18n";
import { useEffect, useState } from "react";
export default function DialogueBox({
  lines,
  onClose,
}: {
  lines: string[];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [typing, setTyping] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [count, setCount] = useState(0);
  const text = t(lines[index]);
  useEffect(() => {
    setCount(0);
    if (!typing) return;
    const t = setInterval(
      () => setCount((n) => Math.min(text.length, n + 2)),
      20,
    );
    return () => clearInterval(t);
  }, [text, typing]);
  return translateTree(
    <div className="dialogue">
      <img
        src={`assets/ui/${typing && count < text.length ? "talking" : "happy"}.png`}
        alt="Dood, o guia deste save"
        width="160"
        height="180"
      />
      <div>
        <small>DOOD / GUIA DE ROTAS</small>
        <p aria-live="polite">{typing ? text.slice(0, count) : text}</p>
        <label>
          <input
            type="checkbox"
            checked={typing}
            onChange={(e) => setTyping(e.target.checked)}
          />{" "}
          Efeito de digitação
        </label>
        <div className="dialogue-actions">
          <button disabled={index === 0} onClick={() => setIndex(index - 1)}>
            BACK
          </button>
          {index < lines.length - 1 ? (
            <button onClick={() => setIndex(index + 1)}>NEXT →</button>
          ) : (
            <button onClick={onClose}>CLOSE ×</button>
          )}
        </div>
      </div>
    </div>,
  );
}
