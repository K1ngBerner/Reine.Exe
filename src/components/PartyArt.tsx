import { translateTree } from "../i18n/tree";
import { party } from "../data/party";
import SafeImage from "./SafeImage";
export function PartyStrip() {
  return translateTree(
    <div className="party-strip">
      <SafeImage
        src={party.banner}
        width="8880"
        height="1168"
        alt="Party de Reine, ilustração panorâmica por ped_joaquim"
      />
      <span>PARTY STRIP / REINE</span>
    </div>,
  );
}
export default function PartyArt() {
  return translateTree(
    <figure className="party-art">
      <figcaption>
        <div>
          <small>PERSONAL COLLECTION / 01</small>
          <h2>MY PARTY</h2>
          <p>
            Obrigado por transformar alguns dos meus Pokémon favoritos nessa
            arte absurda.
          </p>
        </div>
        <a href={party.artistUrl} target="_blank" rel="noopener noreferrer">
          {party.credit}
        </a>
      </figcaption>
      <a
        className="party-original"
        href={party.artwork}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ver ilustração MY PARTY em tamanho original"
      >
        <SafeImage
          src={party.artwork}
          width="5688"
          height="3971"
          loading="lazy"
          alt="Reine com sua party de Pokémon, ilustração original de ped_joaquim"
        />
      </a>
    </figure>,
  );
}
