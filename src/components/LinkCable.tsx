import { translateTree } from "../i18n/tree";
import { useId } from "react";
import { ArrowUpRight } from "lucide-react";
import { socialLinks } from "../data/social";
export default function LinkCable({ modal = false }: { modal?: boolean }) {
  const titleId = useId();
  return translateTree(
    <section
      className="link-cable"
      id={modal ? undefined : "link-cable"}
      aria-labelledby={titleId}
    >
      <header>
        <small>EXTERNAL CONNECTIONS / 05</small>
        <h2 id={titleId}>LINK CABLE</h2>
        <p>find me somewhere else online</p>
      </header>
      <ul>
        {socialLinks.map((link, i) =>
          translateTree(
            <li key={link.name}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <span className="connection-number">0{i + 1}</span>
                <span>
                  <strong>{link.name}</strong>
                  <small>{link.handle}</small>
                </span>
                <ArrowUpRight size={17} />
              </a>
            </li>,
          ),
        )}
      </ul>
    </section>,
  );
}
