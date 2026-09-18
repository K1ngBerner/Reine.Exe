import SafeImage from "./SafeImage";
import type { SportTeam } from "../data/types";

export default function TeamIdentity({
  team,
  className = "",
}: {
  team: SportTeam;
  className?: string;
}) {
  const markClass = [
    "team-mark",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={markClass} data-team={team.fallback.toLowerCase()} aria-hidden="true">
        <SafeImage
          src={team.logo}
          alt=""
          width="30"
          height="30"
          fallback={<span className="team-mark-fallback">{team.fallback}</span>}
        />
    </span>
  );
}
