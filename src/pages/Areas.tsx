import { translateTree } from "../i18n/tree";
import { useState } from "react";
import {
  ArrowUpRight,
  Gamepad2,
  BookOpen,
  Flag,
  Radio,
  Trophy,
  Disc3,
} from "lucide-react";
import type { Area, Entry } from "../data/types";
import { about, profile } from "../data/about";
import { games } from "../data/games";
import { books } from "../data/books";
import { pokemon, handhelds } from "../data/pokemon";
import { sports } from "../data/sports";
import { hobbies } from "../data/hobbies";
import { channel, videos } from "../data/2doods";
import { links } from "../data/links";
import PartyArt, { PartyStrip } from "../components/PartyArt";
import MotionAsset from "../components/MotionAsset";
const gameImages = [
  "persona-royal.jpg",
  "pokemon-white-screen.jpg",
  "conker-screenshot.jpg",
];
export default function Areas({
  area,
  open,
  dialogue,
}: {
  area: Area;
  open: (entry: Entry, sport?: boolean) => void;
  dialogue: (lines: string[]) => void;
}) {
  const [category, setCategory] = useState("ALL");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const heading = (tag: string, title: string, description: string) =>
    translateTree(
      <header className="area-heading">
        <small className="eyebrow">{tag}</small>
        <h1>
          {title}
          <span>_</span>
        </h1>
        <p>{description}</p>
      </header>,
    );
  if (area === "about")
    return translateTree(
      <>
        {heading(
          "02 / PLAYER HOUSE",
          "O player por trás do save.",
          "Interesses demais para uma única classe.",
        )}
        <div className="about-layout">
          <div className="prose">
            {about.paragraphs.map((p) => translateTree(<p key={p}>{p}</p>))}
            <div className="tags">
              {about.interests.map((i) =>
                translateTree(<span key={i}>{i}</span>),
              )}
            </div>
          </div>
          <div className="player-sheet">
            <small>PLAYER DATA</small>
            <h2>REINE</h2>
            <dl>
              <dt>LEVEL</dt>
              <dd>{profile.level}</dd>
              <dt>CLASS</dt>
              <dd>Content Creator / Game Designer</dd>
              <dt>SPECIALTY</dt>
              <dd>Games + Media + Web</dd>
              <dt>FAVORITE TYPE</dt>
              <dd>???</dd>
              <dt>PROBABLY TALKING ABOUT</dt>
              <dd>games, football ou algum projeto aleatório</dd>
            </dl>
          </div>
        </div>
        <div className="section-heading lower">
          <h2>O inventário de interesses</h2>
          <small>ABRA UMA CONVERSA</small>
        </div>
        <div className="hobby-grid">
          {hobbies.map((h, i) => {
            const Icon = [Gamepad2, Disc3, Trophy, BookOpen, Radio][i];
            return translateTree(
              <button
                key={h.id}
                onClick={() =>
                  dialogue(
                    [
                      `${h.name}: ${h.what}`,
                      h.why ? `Por que eu gosto: ${h.why}` : "",
                      h.start ? `Como comecei: ${h.start}` : "",
                      `Para explorar: ${h.recommend}`,
                    ].filter(Boolean),
                  )
                }
              >
                <Icon className="hobby-icon" />
                <strong>{h.name}</strong>
                <span>EXPLORAR ↗</span>
              </button>,
            );
          })}
        </div>
      </>,
    );
  if (area === "games")
    return translateTree(
      <>
        {heading(
          "03 / ARCADE DISTRICT",
          "Meu hall of fame.",
          "Três jogos. Três jeitos diferentes de ficar na memória.",
        )}
        <div className="game-grid">
          {games.map((game, i) =>
            translateTree(
              <button
                className={`game-card game-${i}`}
                key={game.id}
                onClick={() =>
                  open({ ...game, image: `assets/games/${gameImages[i]}` })
                }
              >
                <div className="game-image">
                  <MotionAsset
                    poster={`assets/games/${gameImages[i]}`}
                    clip={game.clip}
                    alt={game.name}
                  />
                  <span>0{i + 1}</span>
                </div>
                <div className="game-info">
                  <small>
                    {game.platform} / {game.year}
                  </small>
                  <h2>{game.name}</h2>
                  <p>{game.subtitle}</p>
                  <div>
                    <span>ABRIR MEMÓRIA ↗</span>
                    <strong>
                      {game.score}
                      <small>METASCORE</small>
                    </strong>
                  </div>
                </div>
              </button>,
            ),
          )}
        </div>
        <div className="quote-strip">
          “Um jogo pode ser completamente idiota e extremamente inteligente ao
          mesmo tempo.”<small>REINE, SOBRE CONKER</small>
        </div>
      </>,
    );
  if (area === "pokemon")
    return translateTree(
      <>
        <PartyStrip />
        {heading(
          "04 / ROUTE ???",
          "Sempre existe outra região.",
          "Pokémon não termina quando os créditos sobem.",
        )}
        <div className="pokemon-intro">
          <div className="prose">
            <p>
              Gosto dos jogos oficiais, mas também do que acontece quando a
              comunidade resolve continuar a conversa: ROM Hacks, fan games,
              mods e formas alternativas de jogar.
            </p>
            <p>
              Emulação e preservação também entram aqui. Me interessa poder
              revisitar jogos antigos e descobrir o que outras pessoas conseguem
              construir sobre eles.
            </p>
          </div>
          <div className="route-marker">
            <Disc3 size={38} />
            <strong>
              ROUTE
              <br />
              01
            </strong>
            <small>COMMUNITY CONNECTION</small>
          </div>
        </div>
        <PartyArt />
        <div className="tabs category-tabs" aria-label="Categorias Pokémon">
          {[
            ["ALL", "COLEÇÃO"],
            ["OFFICIAL", "OFFICIAL GAMES"],
            ["ROM", "ROM HACKS"],
            ["FAN", "FAN GAMES"],
            ["HANDHELDS", "HANDHELDS"],
            ["HISTORY", "MY HISTORY"],
          ].map(([id, name]) =>
            translateTree(
              <button
                key={id}
                aria-pressed={category === id}
                onClick={() => setCategory(id)}
              >
                {name}
              </button>,
            ),
          )}
        </div>
        {["ALL", "ROM", "FAN"].includes(category) && (
          <>
            <div className="section-heading lower">
              <h2>Fan project hall of fame</h2>
              <small>PROJECT DATA / 003</small>
            </div>
            <div className="project-list">
              {pokemon
                .filter(
                  (p) =>
                    category === "ALL" ||
                    (category === "FAN" ? p.id === "gym" : p.id !== "gym"),
                )
                .map((p, i) =>
                  translateTree(
                    <button
                      key={p.id}
                      onClick={() => open(p)}
                      className="project-card"
                    >
                      <span className="project-number">0{i + 1}</span>
                      <img
                        src={p.image}
                        alt={`Screenshot de ${p.name}`}
                        width="240"
                        height="160"
                        loading="lazy"
                      />
                      <div>
                        <small>{p.genre}</small>
                        <h2>{p.name}</h2>
                        <p>{p.subtitle}</p>
                        <span>
                          {p.creator} · {p.platform}
                        </span>
                      </div>
                      <ArrowUpRight />
                    </button>,
                  ),
                )}
            </div>
          </>
        )}
        {category === "OFFICIAL" && (
          <div className="feature-note">
            <h2>Unova fica em casa.</h2>
            <p>
              Pokémon White representa o auge da série para mim. Uma Pokédex
              nova, sprites animados e uma história que tenta fazer perguntas
              diferentes.
            </p>
            <button
              className="primary"
              onClick={() =>
                open({
                  ...games[1],
                  image: "assets/games/pokemon-white-screen.jpg",
                })
              }
            >
              ABRIR POKÉMON WHITE ↗
            </button>
          </div>
        )}
        {category === "HISTORY" && (
          <div className="feature-note">
            <h2>Dos jogos oficiais à comunidade.</h2>
            <p>
              Unova continua sendo minha Pokédex favorita. Hoje, ROM Hacks e fan
              games estão entre meus maiores interesses: novas histórias, outras
              regras e maneiras de voltar a uma série que já conheço tão bem.
            </p>
          </div>
        )}
        {["ALL", "HANDHELDS"].includes(category) && (
          <>
            <div className="section-heading lower">
              <h2>Handheld mode</h2>
              <small>UMA BIBLIOTECA NO BOLSO</small>
            </div>
            <div className="handhelds">
              {handhelds.map((h) =>
                translateTree(
                  <button
                    key={h.name}
                    onClick={() =>
                      dialogue([
                        h.text || h.name,
                        "O que me interessa é preservar e experimentar jogos antigos em formatos portáteis.",
                      ])
                    }
                  >
                    <Gamepad2 size={34} />
                    <div>
                      <h3>{h.name}</h3>
                      <p>Retro / emulação / portabilidade</p>
                    </div>
                    <ArrowUpRight size={18} />
                  </button>,
                ),
              )}
            </div>
          </>
        )}
        <p className="footnote">
          As fichas levam às páginas dos criadores. Este save não hospeda ROMs.
        </p>
      </>,
    );
  if (area === "sports")
    return translateTree(
      <>
        {heading(
          "05 / STADIUM",
          "Fora dos consoles.",
          "Quatro esportes. Sempre alguma coisa acontecendo.",
        )}
        <div className="sports-grid">
          {sports.map((s, i) =>
            translateTree(
              <button
                key={s.id}
                className={`sport-card sport-${s.sportMeta?.variant ?? i}`}
                onClick={() => open(s, true)}
              >
                <div className="scoreboard">
                  <span>
                    {s.sportMeta?.variant === "football"
                      ? "MATCHDAY / 90 MIN / 11 × 11"
                      : s.sportMeta?.variant === "basketball"
                        ? "SCORE PANEL / 5 × 5 / POSSESSION"
                        : s.sportMeta?.variant === "baseball"
                          ? "LINEUP / 9 INNINGS / 3 OUTS"
                          : "TIMING TOWER / GRID / PIT WALL"}
                  </span>
                </div>
                <div className="sport-symbol">
                  {i === 3 ? (
                    <Flag size={56} />
                  ) : i === 0 ? (
                    <Disc3 size={56} />
                  ) : i === 1 ? (
                    <Trophy size={56} />
                  ) : (
                    <span>Ⅸ</span>
                  )}
                </div>
                <small>{s.subtitle}</small>
                <h2>{s.name}</h2>
                <div className="sport-card-identity">
                  {(s.sportMeta?.teams ?? []).slice(0, 2).map((item) => (
                    <span key={item.name}>
                      <span className="team-mark team-mark-small" aria-hidden="true">
                        {item.logo ? <img src={item.logo} alt="" width="24" height="24" /> : item.fallback}
                      </span>
                      {item.name}
                    </span>
                  ))}
                </div>
                {s.sportMeta?.sideAccount && (
                  <span className="sport-side-label">{s.sportMeta.sideAccount.handle}</span>
                )}
                <span className="sport-open">REGRAS & MINHA RELAÇÃO ↗</span>
              </button>,
            ),
          )}
        </div>
        <p className="footnote">
          Os placares são decorativos. Nenhum resultado ao vivo por aqui.
        </p>
      </>,
    );
  if (area === "books")
    return translateTree(
      <>
        {heading(
          "06 / LIBRARY",
          "Histórias que ficaram.",
          "Fantasia, mangás, mitologia, culturas e um bom mistério.",
        )}
        <div className="bookshelf">
          {books.map((book, i) =>
            translateTree(
              <button
                key={book.id}
                className={`book book-${i} ${selectedBook === book.id ? "selected" : ""}`}
                aria-pressed={selectedBook === book.id}
                onClick={() => {
                  setSelectedBook(book.id);
                  open(book);
                }}
              >
                <span className="book-label">MEMÓRIA / 0{i + 1}</span>
                <span className="book-cover-wrap">
                  <img
                    className="book-cover"
                    src={book.cover}
                    alt={`Imagem de ${book.name}`}
                    width={book.coverWidth}
                    height={book.coverHeight}
                    loading="lazy"
                  />
                </span>
                <span className="book-copy">
                  <h2>{book.name}</h2>
                  {book.germanTitle && <em className="book-german">{book.germanTitle}</em>}
                  <span>{book.creator} · {book.year}</span>
                </span>
                <span className="book-open">ABRIR FICHA ↗</span>
              </button>,
            ),
          )}
        </div>
        <p className="footnote">
          Capas fornecidas por Reine. Selecione um livro para abrir a ficha e as notas de leitura.
        </p>
        <div className="quote-strip">
          Às vezes a memória ao redor do livro é tão importante quanto o que
          está escrito nele.<small>NOTAS DE LEITURA</small>
        </div>
      </>,
    );
  if (area === "2doods")
    return translateTree(
      <>
        {heading(
          "07 / BROADCAST STATION",
          "2DOODS.EXE",
          "A conversa continua depois do game over.",
        )}
        <div className="broadcast">
          <div className="broadcast-screen">
            <span className="on-air">● ON AIR</span>
            <img
              src="assets/brand/2doods.jpg"
              alt="Logo 2Doods"
              width="240"
              height="240"
            />
            <span className="channel-number">CH. 02</span>
          </div>
          <div className="broadcast-copy">
            <small>TRANSMITINDO / GAMES & IDEIAS</small>
            <h2>
              Dois controles.
              <br />
              Assunto de sobra.
            </h2>
            <p>{channel.description}</p>
            <a
              className="primary"
              href={links.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              OPEN 2DOODS <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <div className="tags channel-tags">
          {channel.topics.map((t) => translateTree(<span key={t}>{t}</span>))}
        </div>
        {videos.length > 0 ? (
          <div className="video-grid">
            {videos.map((v) =>
              translateTree(
                <article key={v.id}>
                  <iframe
                    loading="lazy"
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}`}
                    title={v.title}
                    allowFullScreen
                  />
                  <h3>{v.title}</h3>
                </article>,
              ),
            )}
          </div>
        ) : (
          <div className="feature-note">
            <Radio />
            <h2>A programação está no canal.</h2>
            <p>
              Análises, listas, curiosidades e conversas sobre a cultura dos
              games.
            </p>
            <a href={links.youtube} target="_blank" rel="noopener noreferrer">
              Ver vídeos da 2Doods ↗
            </a>
          </div>
        )}
      </>,
    );
  return translateTree(
    <>
      {heading(
        "08 / BUSINESS DISTRICT",
        "Ok, as coisas sérias.",
        "Você encontrou a saída para o meu lado profissional.",
      )}
      <div className="work-panel">
        <span>WORK.EXE / EXTERNAL LINK</span>
        <h2>
          O portfólio
          <br />
          fica logo ali.
        </h2>
        <p>
          Por aqui ficam os interesses, as histórias e os saves. No portfólio,
          os projetos e o trabalho por trás deles.
        </p>
        <a
          className="primary"
          href={links.portfolio}
          target="_blank"
          rel="noopener noreferrer"
        >
          OPEN PROFESSIONAL PORTFOLIO <ArrowUpRight size={18} />
        </a>
        <small>Abre em uma nova aba. Seu save continua aqui.</small>
      </div>
    </>,
  );
}
