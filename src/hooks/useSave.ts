import { useCallback, useEffect, useRef, useState } from "react";
import { navigation } from "../data/navigation";
export interface Save {
  firstVisit: string;
  visits: number;
  areas: string[];
  opened: string[];
  eggs: string[];
  badges: string[];
}
export const achievements = [
  { id: "velvet", name: "Velvet Room", hint: "Visite Persona 5 Royal." },
  { id: "champion", name: "Champion", hint: "Abra os três jogos favoritos." },
  {
    id: "hacker",
    name: "ROM Hacker",
    hint: "Conheça os três projetos de fãs.",
  },
  { id: "sports", name: "Sports Nerd", hint: "Abra os quatro esportes." },
  { id: "books", name: "Bookworm", hint: "Abra os três livros." },
  { id: "dooder", name: "Dooder", hint: "Entre na 2Doods." },
  { id: "grass", name: "Touch Grass", hint: "Visite todas as áreas." },
];
function read(): Save {
  try {
    const raw = JSON.parse(localStorage.getItem("reine-save") || "null");
    if (
      raw &&
      typeof raw.firstVisit === "string" &&
      Number.isFinite(Date.parse(raw.firstVisit)) &&
      Number.isFinite(raw.visits) &&
      Array.isArray(raw.areas) &&
      Array.isArray(raw.opened) &&
      Array.isArray(raw.eggs) &&
      Array.isArray(raw.badges)
    )
      return {
        ...raw,
        opened: raw.opened.map((id: string) =>
          id === "death" ? "green-capsule" : id,
        ),
      };
  } catch {
    /* Storage unavailable: keep playing in memory. */
  }
  return {
    firstVisit: new Date().toISOString(),
    visits: 0,
    areas: [],
    opened: [],
    eggs: [],
    badges: [],
  };
}
export function useSave() {
  const counted = useRef(false);
  const [save, setSave] = useState<Save>(read);
  const [toast, setToast] = useState("");
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!counted.current) {
      counted.current = true;
      setSave((s) => ({ ...s, visits: s.visits + 1 }));
    }
    const t = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("reine-save", JSON.stringify(save));
    } catch {
      /* Private browsing can disable storage. */
    }
  }, [save]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  const discover = useCallback(
    (kind: "areas" | "opened" | "eggs", id: string) =>
      setSave((s) => {
        if (s[kind].includes(id)) return s;
        const next = { ...s, [kind]: [...s[kind], id] };
        const all = (ids: string[]) =>
          ids.every((x) => next.opened.includes(x));
        const earned = [
          next.opened.includes("persona") ? "velvet" : "",
          all(["persona", "white", "conker"]) ? "champion" : "",
          all(["gym", "elysium", "unbound"]) ? "hacker" : "",
          all(["football", "basketball", "baseball", "f1"]) ? "sports" : "",
          all(["labyrinth", "sign-four", "green-capsule"]) ? "books" : "",
          next.areas.includes("2doods") ? "dooder" : "",
          navigation.every(({ id }) => next.areas.includes(id)) ? "grass" : "",
        ].filter(Boolean);
        const added = earned.filter((x) => !s.badges.includes(x));
        if (added.length)
          setTimeout(
            () =>
              setToast(
                added
                  .map((id) => achievements.find((a) => a.id === id)!.name)
                  .join(" + "),
              ),
            0,
          );
        return { ...next, badges: [...new Set([...s.badges, ...earned])] };
      }),
    [],
  );
  return { save, discover, toast, elapsed };
}
