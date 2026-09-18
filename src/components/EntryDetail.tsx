import { translateTree } from "../i18n/tree";
import SafeImage from "./SafeImage";
import { t } from "../i18n";
import { useState } from "react";
import type { Entry, SportTeam } from "../data/types";
import TeamIdentity from "./TeamIdentity";

function CopyParagraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((paragraph, index) => (
        <p key={`${paragraph.slice(0, 20)}-${index}`}>{t(paragraph)}</p>
      ))}
    </>
  );
}

function TeamMark({ team }: { team: SportTeam }) {
  return <TeamIdentity team={team} />;
}

function SportHud({ entry }: { entry: Entry }) {
  const meta = entry.sportMeta;
  if (!meta) return null;
  const teamList = meta.teams ?? [];
  const label = meta.variant === "baseball" ? "LINEUP" : meta.variant === "f1" ? "TIMING TOWER" : meta.variant === "basketball" ? "SCORE PANEL" : "MATCHDAY";
  return (
    <aside className={`sport-hud sport-hud-${meta.variant}`} aria-label="Sport details">
      <div className="sport-hud-header">
        <span>{t(label)}</span>
        <span>{t("PERSONAL DATA")}</span>
      </div>
      {teamList.length > 0 && (
        <section className="sport-data-block">
          <small>{t(meta.variant === "baseball" ? "TEAMS / THE LINEUP" : meta.variant === "f1" ? "TEAM" : meta.variant === "basketball" ? "TEAM" : "TEAMS")}</small>
          <ul className="team-list">
            {teamList.map((item) => (
              <li key={item.name}>
                <TeamMark team={item} />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {meta.otherConnection && (
        <section className="sport-data-block">
          <small>{t("OTHER CONNECTION")}</small>
          <p>{meta.otherConnection}</p>
        </section>
      )}
      {meta.favorites && (
        <section className="sport-data-block">
          <small>{t("FAVORITE DRIVERS")}</small>
          <ul className="plain-data-list">
            {meta.favorites.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      )}
      {meta.players && (
        <section className="sport-data-block player-watchlist">
          <small>{t("PLAYERS I WILL ABSOLUTELY STOP WHAT I'M DOING TO WATCH")}</small>
          <ul className="plain-data-list">
            {meta.players.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      )}
      {meta.leagues && (
        <section className="sport-data-block">
          <small>{t("LEAGUES I WATCH")}</small>
          <ul className="plain-data-list">
            {meta.leagues.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      )}
      {meta.seenIrl && (
        <section className="sport-data-block">
          <small>{t("SEEN IRL")}</small>
          <ul className="plain-data-list">
            {meta.seenIrl.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      )}
      {meta.sideAccount && (
        <section className="sport-data-block sport-side-account">
          <small>{t("SPORTS SIDE ACCOUNT")}</small>
          <a href={meta.sideAccount.url} target="_blank" rel="noopener noreferrer">
            {meta.sideAccount.handle} ↗
          </a>
        </section>
      )}
    </aside>
  );
}
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
        <SafeImage
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
          <div className="sport-detail-layout">
            <div className="sport-copy">
              <div
                className="tabs sport-tabs"
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
                  HOW IT WORKS
                </button>
                <button
                  role="tab"
                  aria-selected={tab}
                  tabIndex={tab ? 0 : -1}
                  id="sport-personal-tab"
                  aria-controls="sport-panel"
                  onClick={() => setTab(true)}
                >
                  WHY I&apos;M HERE
                </button>
              </div>
              <div
                role="tabpanel"
                id="sport-panel"
                aria-labelledby={tab ? "sport-personal-tab" : "sport-rules-tab"}
                className="prose sport-copy-panel"
              >
                <small className="sport-panel-kicker">{tab ? "WHY I'M HERE / PERSONAL LOG" : "HOW IT WORKS / QUICK RULES"}</small>
                <CopyParagraphs text={tab ? entry.personal || "—" : entry.context} />
              </div>
            </div>
            <SportHud entry={entry} />
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
