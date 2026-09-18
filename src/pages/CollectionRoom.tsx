import { useRef, useState, type CSSProperties } from "react";
import { ArrowDownRight, ArrowUpRight, Heart, X } from "lucide-react";
import { collection, collectionUI, type CollectionId } from "../data/collection";
import { useLocale } from "../i18n";

/** Abstract shelf objects, not photographs or claims about specific owned editions. */
function ShelfObjects({ id }: { id: CollectionId }) {
  return <span className={`shelf-objects objects-${id}`} aria-hidden="true">
    {id === "consoles" ? <>
      <span className="object-switch"><i /><b /><i /></span>
      <span className="object-handheld"><i /><i /></span>
      <span className="object-wii" /><span className="object-controller">✚ <i>••</i></span>
    </> : id === "figures" ? <>
      <span className="figure-box"><i /><b>P</b></span><span className="figure-box"><i /><b>OP</b></span><span className="figure-plinth"><i /></span>
    </> : id === "tcg" ? <>
      <span className="object-binder"><i /><span>{Array.from({ length: 6 }, (_, i) => <b key={i} />)}</span></span><Heart className="binder-heart" size={18} />
    </> : <>
      {Array.from({ length: id === "books" ? 8 : 12 }, (_, i) => <span className="object-spine" key={i}><i /></span>)}
      {id === "books" && <span className="book-stack"><i /><i /><i /></span>}
    </>}
  </span>;
}

export default function CollectionRoom() {
  const locale = useLocale();
  const copy = collectionUI[locale];
  const [selected, setSelected] = useState<CollectionId | null>("tcg");
  const triggers = useRef(new Map<CollectionId, HTMLButtonElement>());
  const close = (id: CollectionId) => {
    setSelected(null);
    triggers.current.get(id)?.focus({ preventScroll: true });
  };
  return <section className="collection-room">
    <header className="area-heading collection-heading">
      <small className="eyebrow">{copy.location}</small>
      <h1>{copy.title}<span>_</span></h1>
      <p>{copy.intro}</p>
    </header>
    <div className="cabinet-toolbar"><span>{copy.cabinet} / R—001</span><span>05 {copy.index}</span></div>
    <p className="cabinet-instruction"><ArrowDownRight size={17} />{copy.prompt}</p>
    <div className="collection-cabinet">
      {collection.map((item, i) => {
        const active = selected === item.id;
        return <section key={item.id} className={`collection-compartment compartment-${item.id}`} style={{ "--row": i + 1 } as CSSProperties}>
          <button
            ref={(el) => { if (el) triggers.current.set(item.id, el); else triggers.current.delete(item.id); }}
            className="shelf-trigger"
            id={`shelf-${item.id}`}
            aria-expanded={active}
            aria-controls={`drawer-${item.id}`}
            onClick={() => setSelected(active ? null : item.id)}
          >
            <span className="shelf-number">0{i + 1}</span>
            <ShelfObjects id={item.id} />
            <span className="shelf-caption"><strong>{item.title[locale]}</strong><span>{item.note[locale]}</span></span>
            <span className="shelf-handle">{active ? copy.close : copy.open} <ArrowUpRight size={14} /></span>
          </button>
          <div
            id={`drawer-${item.id}`}
            className="collection-drawer"
            hidden={!active}
            role="region"
            aria-labelledby={`drawer-title-${item.id}`}
            onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); close(item.id); } }}
          >
            <div className="drawer-index"><span>{copy.reading} / 0{i + 1}</span><button aria-label={`${copy.close}: ${item.title[locale]}`} onClick={() => close(item.id)}><X size={18} /></button></div>
            <div className="drawer-paper">
              <span className="drawer-tab">R / 0{i + 1}</span>
              <small>{copy.label}</small>
              <h2 id={`drawer-title-${item.id}`}>{item.title[locale]}</h2>
              <p className="drawer-story">{item.text[locale]}</p>
              {!!item.stats.length && <dl className="collection-stats">{item.stats.map((stat, index) => <div key={index}><dt>{stat.label[locale]}</dt><dd>{stat.value[locale]}</dd></div>)}</dl>}
              {item.groups?.map((group, index) => <div className="collection-group" key={index}><h3>{group.label[locale]}</h3><ul>{group.items.map((entry, index) => <li key={index}>{entry[locale]}</li>)}</ul></div>)}
              {item.id === "books" && <a className="collection-reading-link" href="#books">{copy.booksLink}</a>}
              <span className="drawer-signature">— Reine</span>
            </div>
          </div>
        </section>;
      })}
      {!selected && <div className="cabinet-empty"><span>R—001 / ∅</span><p>{copy.empty}</p></div>}
    </div>
    <p className="collection-footnote">{copy.footnote}</p>
  </section>;
}
