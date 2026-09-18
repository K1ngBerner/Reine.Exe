import { translateTree } from "../i18n/tree";
import { navigation } from "../data/navigation";
import type { Area } from "../data/types";
export default function AreaMenu({
  navigate,
  visited,
}: {
  navigate: (area: Area) => void;
  visited: string[];
}) {
  return translateTree(
    <nav
      className="area-menu"
      aria-label="World map"
      onKeyDown={(e) => {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
        e.preventDefault();
        const buttons = Array.from(e.currentTarget.querySelectorAll("button"));
        const index = buttons.indexOf(
          document.activeElement as HTMLButtonElement,
        );
        const next =
          e.key === "Home"
            ? 0
            : e.key === "End"
              ? buttons.length - 1
              : (index + (e.key === "ArrowDown" ? 1 : -1) + buttons.length) %
                buttons.length;
        buttons[next].focus();
      }}
    >
      <button className="area-home" onClick={() => navigate("home")}>
        <span className="selection-cursor" aria-hidden="true">
          ▸
        </span>
        <small>01</small>
        <strong>SAVE SCREEN</strong>
        <span>HOME</span>
      </button>
      {navigation.slice(1).map(({ id, name, place }, i) =>
        translateTree(
          <button key={id} onClick={() => navigate(id)}>
            <span className="selection-cursor" aria-hidden="true">
              ▸
            </span>
            <small>0{i + 2}</small>
            <strong>{place}</strong>
            <span>{id === "work" ? "PORTFOLIO" : name}</span>
            <i
              aria-label={
                visited.includes(id) ? "Área visitada" : "Área não visitada"
              }
            >
              {visited.includes(id) ? "•" : ""}
            </i>
          </button>,
        ),
      )}
    </nav>,
  );
}
