import { translateTree } from "../i18n/tree";
import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/about";
import { current } from "../data/current";
import { t, useLocale } from "../i18n";
import { navigation } from "../data/navigation";
import type { Area } from "../data/types";
import LinkCable from "../components/LinkCable";
export default function HomePage({
  navigate,
  badges,
  onPortrait,
}: {
  navigate: (area: Area) => void;
  badges: number;
  onPortrait: () => void;
}) {
  const locale = useLocale();
  return translateTree(
    <div className="save-home">
      <header className="save-heading">
        <small>PERSONAL SAVE / 001</small>
        <span>CONTINUE?</span>
      </header>
      <section className="save-composition">
        <div className="trainer">
          <div className="window-label">
            <span>PLAYER_IMAGE</span>
            <span>001</span>
          </div>
          <button
            className="portrait-wrap"
            onClick={onPortrait}
            aria-label="Examinar Trainer Card"
          >
            <img
              src="assets/profile/reine-profile.png"
              alt="Reine em pixel art cercado por seus Pokémon"
              width="1254"
              height="1254"
            />
          </button>
          <div className="trainer-footer">
            <small>CONTENT CREATOR / GAME DESIGNER</small>
            <span>{badges} BADGES</span>
          </div>
        </div>
        <div className="save-info">
          <div className="save-name">
            <h1>{profile.name}</h1>
            <span>LV.{profile.level}</span>
          </div>
          <dl className="save-status">
            <dt>STATUS</dt>
            <dd>
              <span className="online-dot" />
              {profile.status.toUpperCase()}
            </dd>
          </dl>
          <div className="current-ledger">
            <div>
              <small>{t("home.playing")}</small>
              <p>{current.currentlyPlaying[locale]}</p>
            </div>
            <div>
              <small>{t("home.reading")}</small>
              <p>
                {current.currentlyReading.title[locale]}
                <span className="reading-series">
                  {current.currentlyReading.series[locale]}
                </span>
              </p>
            </div>
            <div>
              <small>{t("home.sideQuest")}</small>
              <p>{current.currentSideQuest[locale]}</p>
            </div>
          </div>
          <div className="save-actions">
            <button onClick={() => navigate("about")}>
              {t("home.playerHouse")} <ArrowUpRight size={16} />
            </button>
            <a
              href="#link-cable"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("link-cable")?.scrollIntoView({
                  behavior: matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "instant"
                    : "smooth",
                });
                document
                  .querySelector<HTMLElement>("#link-cable a")
                  ?.focus({ preventScroll: true });
              }}
            >
              LINK CABLE ↓
            </a>
          </div>
        </div>
      </section>
      <div className="home-lower">
        <section className="save-notes">
          <div className="route-index">
            <h2>Outras áreas</h2>
            {navigation.slice(2).map(({ id, name, place }, i) =>
              translateTree(
                <button key={id} onClick={() => navigate(id)}>
                  <small>0{i + 2}</small>
                  <span>{place}</span>
                  <strong>{name}</strong>
                  <ArrowUpRight size={15} />
                </button>,
              ),
            )}
          </div>
        </section>
        <LinkCable />
      </div>
    </div>,
  );
}
