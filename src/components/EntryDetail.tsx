import { translateTree } from "../i18n/tree";
import { useState } from "react";
import type { Entry } from "../data/types";
export default function EntryDetail({
  entry,
  sport = false,
}: {
  entry: Entry;
  sport?: boolean;
}) {
  const [tab, setTab] = useState(false);
  return translateTree(
    <article className="entry-detail">
      {entry.image && (
        <img
          className="detail-image"
          src={entry.image}
          alt={`Imagem de ${entry.name}`}
          width="700"
          height="380"
        />
      )}
      <small className="eyebrow">
        {sport ? "STADIUM / REGRAS DO JOGO" : "ARQUIVO DO SAVE"}
      </small>
      <h2>{entry.name}</h2>
      <p className="detail-subtitle">{entry.subtitle}</p>
      {sport ? (
        <>
          <div
            className="tabs"
            role="tablist"
            aria-label="Sobre o esporte"
            onKeyDown={(e) => {
              if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const next =
                  e.key === "Home" ? false : e.key === "End" ? true : !tab;
                setTab(next);
                const buttons =
                  e.currentTarget.querySelectorAll<HTMLButtonElement>("button");
                buttons[next ? 1 : 0].focus();
              }
            }}
          >
            <button
              role="tab"
              aria-selected={!tab}
              tabIndex={tab ? -1 : 0}
              id="sport-rules-tab"
              aria-controls="sport-panel"
              onClick={() => setTab(false)}
            >
              what the hell is this?
            </button>
            <button
              role="tab"
              aria-selected={tab}
              tabIndex={tab ? 0 : -1}
              id="sport-personal-tab"
              aria-controls="sport-panel"
              onClick={() => setTab(true)}
            >
              why I like it
            </button>
          </div>
          <div
            role="tabpanel"
            id="sport-panel"
            aria-labelledby={tab ? "sport-personal-tab" : "sport-rules-tab"}
            className="prose"
          >
            <p>{tab ? entry.personal || "—" : entry.context}</p>
          </div>
        </>
      ) : (
        <>
          <dl className="metadata">
            {[
              ["CRIADOR / AUTOR", entry.creator],
              ["ANO ORIGINAL", entry.year],
              ["BASE / PLATAFORMA", entry.platform],
              ["GÊNERO", entry.genre],
              ["STATUS", entry.status],
              ["SÉRIE", entry.series],
              ["TÍTULO BRITÂNICO", entry.originalTitle],
              ["TÍTULO NOS ESTADOS UNIDOS", entry.usTitle],
              ["TÍTULO ALEMÃO", entry.germanTitle],
            ]
              .filter(([, value]) => value)
              .map(([name, value]) =>
                translateTree(
                  <div key={name}>
                    <dt>{name}</dt>
                    <dd>{value}</dd>
                  </div>,
                ),
              )}
            {entry.score && (
              <div>
                <dt>METACRITIC · {entry.platform}</dt>
                <dd>
                  {entry.score}/100{" "}
                  <a
                    href={entry.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ver fonte ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>
          {entry.needsMetadata && (
            <p className="notice">
              Autor, edição e ano ainda não identificados. A memória, essa eu
              tenho.
            </p>
          )}
          <div className="prose">
            <h3>Contexto</h3>
            <p>{entry.context}</p>
            {entry.features && (
              <ul>
                {entry.features.map((f) => translateTree(<li key={f}>{f}</li>))}
              </ul>
            )}
            {entry.significance && (
              <>
                <h3>Por que importa</h3>
                <p>{entry.significance}</p>
              </>
            )}
            {(entry.personal || entry.memory) && (
              <div className="personal-note">
                <small>REINE’S NOTES / WHY I LOVE IT</small>
                <p>{entry.personal}</p>
                {entry.memory && <p>{entry.memory}</p>}
              </div>
            )}
          </div>
          {entry.source && !entry.score && (
            <a
              className="primary"
              href={entry.source}
              target="_blank"
              rel="noopener noreferrer"
            >
              VIEW PROJECT ↗
            </a>
          )}
        </>
      )}
    </article>,
  );
}
