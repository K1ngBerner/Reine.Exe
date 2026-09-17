import { translateTree } from "./i18n/tree";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Map, Moon, Sun, Award, Clock3, ChevronRight } from "lucide-react";
import { navigation } from "./data/navigation";
import type { Area, Entry } from "./data/types";
import { achievements, useSave } from "./hooks/useSave";
import { credits } from "./data/credits";
import { t, useLocale } from "./i18n";
import LanguageToggle from "./components/LanguageToggle";
import HomePage from "./pages/Home";
import LinkCable from "./components/LinkCable";
import AreaMenu from "./components/AreaMenu";
import { profile } from "./data/about";
import Window from "./components/Window";
import EntryDetail from "./components/EntryDetail";
import Player from "./components/Player";
import DialogueBox from "./components/DialogueBox";
const Areas = lazy(() => import("./pages/Areas"));
function stored(key: string, fallback: string) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}
type Modal =
  | {
      type: "entry";
      entry: Entry;
      sport?: boolean;
    }
  | {
      type: "map" | "badges" | "save" | "credits" | "links";
    }
  | {
      type: "dialogue";
      lines: string[];
    };
export default function App() {
  const locale = useLocale();
  const [area, setArea] = useState<Area>(
    () => navigation.find((n) => n.id === location.hash.slice(1))?.id || "home",
  );
  const [started, setStarted] = useState(
    () => stored("reine-started", "") === "yes",
  );
  const [musicPrompt, setMusicPrompt] = useState(false);
  const [requestPlay, setRequestPlay] = useState(0);
  const [modal, setModal] = useState<Modal | null>(null);
  const [theme, setTheme] = useState(() => stored("reine-theme", "night"));
  const { save, discover, toast, elapsed } = useSave();
  const portraits = useRef(0);
  const [blink, setBlink] = useState(false);
  const item = navigation.find((n) => n.id === area)!;
  const dialogue = useCallback(
    (lines: string[]) => setModal({ type: "dialogue", lines }),
    [],
  );
  const navigate = useCallback((id: Area) => {
    setArea(id);
    location.hash = id;
    setModal(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  useEffect(() => {
    const update = () =>
      setArea(
        navigation.find((n) => n.id === location.hash.slice(1))?.id || "home",
      );
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    if (started) discover("areas", area);
    document.title = `${t(item.name)} · REINE.EXE`;
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [area, discover, started, item.name, locale]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("reine-theme", theme);
    } catch {
      /* in-memory preference */
    }
  }, [theme]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setBlink((b) => !b), 3200);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    let sequence = "";
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches("input,textarea")) return;
      sequence = (sequence + e.key.toLowerCase() + ",").slice(-100);
      if (
        sequence.endsWith(
          "arrowup,arrowup,arrowdown,arrowdown,arrowleft,arrowright,arrowleft,arrowright,b,a,",
        )
      ) {
        discover("eggs", "konami");
        dialogue([
          "SAVE SECRETO ENCONTRADO.",
          "Você trouxe controles de outro jogo. Funcionou mesmo assim.",
        ]);
        sequence = "";
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [discover, dialogue]);
  function start(skip = false) {
    setStarted(true);
    try {
      localStorage.setItem("reine-started", "yes");
    } catch {
      /* optional storage */
    }
    if (!skip) setMusicPrompt(true);
  }
  function open(entry: Entry, sport = false) {
    discover("opened", entry.id);
    setModal({ type: "entry", entry, sport });
  }
  function portrait() {
    portraits.current++;
    if (portraits.current === 5) {
      discover("eggs", "portrait");
      dialogue([
        "Cinco cliques no Trainer Card.",
        "Ainda não evoluí. Talvez falte uma pedra.",
      ]);
    } else if (portraits.current === 1)
      dialogue([
        `REINE · LV.${profile.level}. Classe: Content Creator / Game Designer.`,
        "Especialidade: Games + Media + Web. Tipo favorito? Essa ficha ainda está em atualização.",
      ]);
  }
  return translateTree(
    <>
      <a className="skip-link" href="#content">
        Pular para o conteúdo
      </a>
      {!started ? (
        <div className="start-screen">
          <div className="start-top">
            PERSONAL SAVE SYSTEM <LanguageToggle />
          </div>
          <div className="start-center">
            <small>UM CANTO PESSOAL DA INTERNET</small>
            <h1>
              REINE<span>.EXE</span>
            </h1>
            <p>Games, histórias e interesses demais.</p>
            <button className="start-button" onClick={() => start()}>
              ▶ PRESS START
            </button>
            <button className="skip-intro" onClick={() => start(true)}>
              SKIP INTRO / ENTRAR SEM SOM
            </button>
          </div>
          <div className="start-bottom">
            <span>SAVE FILE 001 / REINE</span>
            <span>NENHUMA CONTA. SÓ CURIOSIDADE.</span>
          </div>
        </div>
      ) : (
        <div className="shell">
          <aside className="sidebar">
            <a className="brand" href="#home" onClick={() => navigate("home")}>
              R<span>▰</span>
              <small>REINE.EXE</small>
            </a>
            <div className="side-label">PERSONAL SAVE / 001</div>
            <nav aria-label="Áreas do site">
              {navigation.map(({ id, name, icon: Icon }, i) =>
                translateTree(
                  <button
                    key={id}
                    aria-current={area === id ? "page" : undefined}
                    className={area === id ? "active" : ""}
                    onClick={() => navigate(id)}
                  >
                    <Icon size={19} />
                    <span>{name}</span>
                    <small>0{i + 1}</small>
                  </button>,
                ),
              )}
            </nav>
            <button
              className="map-button"
              onClick={() => setModal({ type: "map" })}
            >
              <Map size={18} /> WORLD MAP
            </button>
            <div className="sidebar-tools">
              <button onClick={() => setModal({ type: "links" })}>
                ↔ LINK CABLE
              </button>
              <button onClick={() => setModal({ type: "badges" })}>
                <Award size={17} /> BADGES <span>{save.badges.length}/7</span>
              </button>
              <button onClick={() => setModal({ type: "save" })}>
                <Clock3 size={17} /> SAVE FILE
              </button>
            </div>
            <div className="sidebar-bottom">
              <span className="online-dot" /> TODOS OS SISTEMAS OK
              <small>feito de interesses demais.</small>
            </div>
          </aside>
          <div className="workspace">
            <header className="topbar">
              <span>
                REINE’S PERSONAL SPACE <b>/</b> {item.place}
              </span>
              <div>
                <LanguageToggle />
                <button
                  className="mobile-map"
                  aria-label="Abrir mapa"
                  onClick={() => setModal({ type: "map" })}
                >
                  <Map size={17} />
                </button>
                <button
                  className="save-top"
                  onClick={() => setModal({ type: "save" })}
                >
                  <span className="online-dot" /> SAVE LOCAL
                </button>
                <button
                  aria-label={t(theme === "day" ? "theme.night" : "theme.day")}
                  title={theme === "day" ? "DAY MODE" : "DARK MODE"}
                  onClick={() => setTheme(theme === "day" ? "night" : "day")}
                >
                  {theme === "day" ? <Moon size={17} /> : <Sun size={17} />}
                </button>
              </div>
            </header>
            <main id="content" tabIndex={-1}>
              <div className="page-label">
                <span>
                  0{navigation.indexOf(item) + 1} / {item.place}
                </span>
                <span>SAVE 001 · BRASIL</span>
              </div>
              <div className="area-transition" key={area}>
                {area === "home" ? (
                  <HomePage
                    navigate={navigate}
                    badges={save.badges.length}
                    onPortrait={portrait}
                  />
                ) : (
                  <Suspense
                    fallback={<p className="loading">CARREGANDO ÁREA...</p>}
                  >
                    <Areas area={area} open={open} dialogue={dialogue} />
                  </Suspense>
                )}
              </div>
              <div className="npc-line">
                <button
                  onClick={() =>
                    dialogue([
                      "Ouvi dizer que o dono deste site gosta de coisas demais ao mesmo tempo.",
                      "Não pergunte quantas horas existem nesse save de Persona.",
                      "Psst. O Trainer Card gosta de atenção. E alguns códigos antigos ainda funcionam.",
                    ])
                  }
                >
                  <img
                    src={`assets/ui/${blink ? "blink" : "idle"}.png`}
                    width="75"
                    height="84"
                    alt="Dood, personagem guia"
                  />
                  <span>
                    <small>DOOD TEM ALGO A DIZER</small>Um minuto de conversa?{" "}
                    <ChevronRight size={15} />
                  </span>
                </button>
                <button
                  className="hidden-star"
                  aria-label="Examinar pequena estrela"
                  title="Tem alguma coisa aqui..."
                  onClick={() => {
                    discover("eggs", "star");
                    dialogue([
                      "Uma anotação sobre a party: a ilustração é de @ped_joaquim.",
                      "Na área Pokémon, MY PARTY abre a arte original em tamanho completo. O crédito também leva ao perfil do artista.",
                    ]);
                  }}
                >
                  ✦
                </button>
              </div>
            </main>
            <footer>
              <button onClick={() => setModal({ type: "credits" })}>
                CRÉDITOS & FONTES
              </button>
              <span>SEM CHECKPOINT OBRIGATÓRIO.</span>
              <span>© REINE · SAVE 001</span>
            </footer>
          </div>
        </div>
      )}
      <Player requestPlay={requestPlay} />
      {musicPrompt && (
        <Window title="ENABLE SOUND?" onClose={() => setMusicPrompt(false)}>
          <div className="music-question">
            <h2>ENABLE SOUND?</h2>
            <p>
              Inception · Cyberpunk Darksynth. Começa baixinho e você controla
              pelo player.
            </p>
            <button
              className="primary"
              onClick={() => {
                setRequestPlay((n) => n + 1);
                setMusicPrompt(false);
              }}
            >
              {"▸ YES"}
            </button>
            <button
              className="text-button"
              onClick={() => setMusicPrompt(false)}
            >
              NO
            </button>
          </div>
        </Window>
      )}
      {modal && (
        <Window
          key={modal.type === "entry" ? modal.entry.id : modal.type}
          title={
            modal.type === "entry"
              ? modal.entry.name.toUpperCase()
              : modal.type === "dialogue"
                ? "DIALOGUE.EXE"
                : `${modal.type.toUpperCase()}.EXE`
          }
          onClose={() => setModal(null)}
        >
          {modal.type === "entry" ? (
            <EntryDetail entry={modal.entry} sport={modal.sport} />
          ) : modal.type === "links" ? (
            <LinkCable modal />
          ) : modal.type === "dialogue" ? (
            <DialogueBox lines={modal.lines} onClose={() => setModal(null)} />
          ) : modal.type === "map" ? (
            <>
              <div className="modal-heading">
                <small>WORLD MAP</small>
                <h2>Qual é a próxima parada?</h2>
                <p>Todas as rotas estão abertas.</p>
              </div>
              <AreaMenu navigate={navigate} visited={save.areas} />
              <button
                className="text-button"
                onClick={() => setModal({ type: "badges" })}
              >
                Ver badges encontrados →
              </button>
            </>
          ) : modal.type === "badges" ? (
            <>
              <div className="modal-heading">
                <small>ACHIEVEMENTS / {save.badges.length} DE 7</small>
                <h2>Pequenas recompensas.</h2>
                <p>A curiosidade também fica salva.</p>
              </div>
              <div className="badge-grid">
                {achievements.map((a) =>
                  translateTree(
                    <div
                      key={a.id}
                      className={save.badges.includes(a.id) ? "earned" : ""}
                    >
                      <Award />
                      <div>
                        <h3>{save.badges.includes(a.id) ? a.name : "???"}</h3>
                        {save.badges.includes(a.id) && <p>{a.hint}</p>}
                        <small>
                          {save.badges.includes(a.id)
                            ? "DESBLOQUEADO"
                            : "A DESCOBRIR"}
                        </small>
                      </div>
                    </div>,
                  ),
                )}
              </div>
              <p className="footnote">
                Segredos encontrados: {save.eggs.length}/3
              </p>
            </>
          ) : modal.type === "save" ? (
            <>
              <div className="modal-heading">
                <small>SAVE FILE 001</small>
                <h2>Reine / visitante curioso</h2>
              </div>
              <dl className="save-data">
                <dt>STATUS</dt>
                <dd>ONLINE</dd>
                <dt>PLAYTIME / SESSÃO</dt>
                <dd>
                  {Math.floor(elapsed / 60)}m {elapsed % 60}s
                </dd>
                <dt>PRIMEIRA VISITA</dt>
                <dd>
                  {new Date(save.firstVisit).toLocaleDateString(
                    locale === "pt" ? "pt-BR" : "en-US",
                  )}
                </dd>
                <dt>VISITAS</dt>
                <dd>{save.visits}</dd>
                <dt>ÁREAS VISITADAS</dt>
                <dd>{save.areas.length}/8</dd>
                <dt>BADGES</dt>
                <dd>{save.badges.length}/7</dd>
                <dt>SEGREDOS</dt>
                <dd>{save.eggs.length}/3</dd>
              </dl>
              <p className="footnote">
                O progresso fica neste navegador. Nenhuma informação do save é
                enviada para um servidor.
              </p>
              <button
                className="primary"
                onClick={() => setModal({ type: "badges" })}
              >
                VER BADGES
              </button>
            </>
          ) : (
            <>
              <div className="modal-heading">
                <h2>Créditos & fontes</h2>
                <p>
                  Imagens reais, memórias pessoais e gente que cria coisas boas.
                </p>
              </div>
              <div className="credits-list">
                {credits.map((c) =>
                  translateTree(
                    <div key={c.asset}>
                      <h3>{c.asset}</h3>
                      <p>{c.credit}</p>
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Fonte original ↗
                        </a>
                      )}
                    </div>,
                  ),
                )}
              </div>
              <p className="footnote">
                Direitos das obras pertencem aos respectivos titulares.
                Atribuição não equivale a uma licença de redistribuição.
              </p>
            </>
          )}
        </Window>
      )}
      {toast && (
        <div className="achievement-toast" role="status">
          <Award />
          <div>
            <small>ACHIEVEMENT UNLOCKED</small>
            <strong>{toast}</strong>
          </div>
        </div>
      )}
    </>,
  );
}
