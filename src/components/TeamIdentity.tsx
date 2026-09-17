import { useState } from "react";
import type { SportTeam } from "../data/types";

export default function TeamIdentity({
  team,
  className = "",
}: {
  team: SportTeam;
  className?: string;
}) {
  const [imageAvailable, setImageAvailable] = useState(Boolean(team.logo));
  const markClass = [
    "team-mark",
    imageAvailable ? "" : "team-mark-fallback",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={markClass} aria-hidden="true">
      {team.logo && imageAvailable ? (
        <img
          src={team.logo}
          alt=""
          width="30"
          height="30"
          onError={() => setImageAvailable(false)}
        />
      ) : (
        <span>{team.fallback}</span>
      )}
    </span>
  );
}
