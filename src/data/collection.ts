import type { Locale } from "../i18n";

type Copy = Record<Locale, string>;
export type CollectionId = "consoles" | "figures" | "tcg" | "books" | "manga";
interface Compartment {
  id: CollectionId;
  title: Copy;
  note: Copy;
  text: Copy;
  stats: { label: Copy; value: Copy }[];
  groups?: { label: Copy; items: Copy[] }[];
}
const same = (text: string): Copy => ({ pt: text, en: text });

// Personal inventory only. Shelf silhouettes are decorative, not item counts.
export const collection: Compartment[] = [
  {
    id: "consoles",
    title: same("CONSOLES"),
    note: { pt: "ter, jogar, preservar", en: "owned, played, preserved" },
    text: {
      pt: "Tenho uma relação especial com consoles da Nintendo e aos poucos fui transformando isso numa coleção. Atualmente tenho Switch, Nintendo DS, Nintendo 3DS, Nintendo DSi, Wii e Nintendo 64. Parte da graça pra mim não está só em ter o hardware, mas em jogar nele, mexer, preservar e entender as diferenças entre gerações. Gosto muito da sensação de pegar um console antigo e continuar encontrando motivo pra usar aquela máquina décadas depois.",
      en: "I have a soft spot for Nintendo consoles, and little by little that turned into a collection. Right now I have a Switch, Nintendo DS, Nintendo 3DS, Nintendo DSi, Wii and Nintendo 64. For me, part of the fun isn't just owning the hardware. It's playing on it, tinkering, preserving it and figuring out the differences between generations. I love picking up an old console and still finding reasons to use that machine decades later.",
    },
    stats: [{ label: { pt: "HARDWARE", en: "HARDWARE" }, value: { pt: "feito para jogar", en: "made to be played" } }],
    groups: [{ label: { pt: "NO ACERVO", en: "ON THE SHELF" }, items: ["Nintendo Switch", "Nintendo DS", "Nintendo 3DS", "Nintendo DSi", "Nintendo Wii", "Nintendo 64"].map(same) }],
  },
  {
    id: "figures",
    title: same("ACTION FIGURES"),
    note: { pt: "disciplina de estante: inexistente", en: "shelf discipline: nonexistent" },
    text: {
      pt: "Action figures são provavelmente a parte mais caótica da coleção. A maior concentração é Persona e One Piece, mas no meio já foram aparecendo Sailor Moon, Death Note, Naruto, Vocaloid, My Hero Academia e várias outras coisas. Não existe exatamente uma regra rígida. Se eu gosto do personagem e acho a figure maneira, existe um risco considerável dela acabar numa estante.",
      en: "Action figures are probably the most chaotic part of the collection. Persona and One Piece take up most of the space, but Sailor Moon, Death Note, Naruto, Vocaloid, My Hero Academia and plenty of other things have found their way in. There's no strict rule, really. If I like the character and think the figure looks cool, there's a pretty good chance it'll end up on a shelf.",
    },
    stats: [],
    groups: [
      { label: { pt: "PRATELEIRAS PRINCIPAIS", en: "MAIN SHELVES" }, items: ["Persona", "One Piece"].map(same) },
      { label: { pt: "TAMBÉM POR AQUI", en: "ALSO SPOTTED" }, items: ["Sailor Moon", "Death Note", "Naruto", "Vocaloid", "BNHA", "+ ???"].map(same) },
    ],
  },
  {
    id: "tcg",
    title: same("POKÉMON TCG"),
    note: { pt: "meu xodó de papelão", en: "still my favorite cardboard addiction" },
    text: {
      pt: "Pokémon TCG é provavelmente o maior xodó da coleção. Coleciono cartas desde os 10 anos, então é uma das poucas coisas daqui que realmente atravessou várias fases da minha vida. Tenho alguns hits e cartas que gosto bastante, mas a relação com a coleção vai muito além de valor ou raridade. Tem carta ali que simplesmente ficou comigo por anos, e isso acaba valendo mais do que qualquer tabela de preço.",
      en: "Pokémon TCG is probably the collection closest to my heart. I've been collecting cards since I was 10, so it's one of the few things here that's actually been with me through different stages of my life. I have a few hits and cards I really like, but my connection to the collection goes way beyond value or rarity. Some cards have simply stayed with me for years, and that ends up meaning more than any price guide.",
    },
    stats: [
      { label: { pt: "COLECIONANDO DESDE", en: "COLLECTING SINCE" }, value: { pt: "os 10 anos", en: "age 10" } },
      { label: { pt: "STATUS DE FAVORITO", en: "FAVORITE STATUS" }, value: { pt: "favorito absoluto", en: "absolute favorite" } },
    ],
  },
  {
    id: "books",
    title: { pt: "LIVROS", en: "BOOKS" },
    note: { pt: "um histórico físico de interesses", en: "a physical history of interests" },
    text: {
      pt: "Além de gostar de ler, eu também gosto muito de ter livros fisicamente. Hoje são mais de 200 títulos, indo de fantasia e ficção até mitologia, cultura, folclore e livros técnicos. A estante acabou virando quase um histórico físico das coisas que eu fui me interessando ao longo dos anos.",
      en: "Besides enjoying reading, I also really like owning physical books. These days there are more than 200 titles, from fantasy and fiction to mythology, culture, folklore and technical books. The shelf has turned into a kind of physical history of the things I've become interested in over the years.",
    },
    stats: [{ label: { pt: "BIBLIOTECA", en: "LIBRARY" }, value: { pt: "200+ livros", en: "200+ books" } }],
    groups: [{ label: { pt: "ENTRE AS LOMBADAS", en: "BETWEEN THE SPINES" }, items: [
      { pt: "Fantasia", en: "Fantasy" }, { pt: "Mitologia", en: "Mythology" },
      { pt: "Cultura", en: "Culture" }, { pt: "Folclore", en: "Folklore" },
      { pt: "Técnicos", en: "Technical" }, { pt: "+ o que mais me interessou", en: "+ whatever I found interesting" },
    ] }],
  },
  {
    id: "manga",
    title: { pt: "MANGÁS", en: "MANGA" },
    note: { pt: "É minha coisa boa.", en: "It's my happy thing." },
    text: {
      pt: "A coleção de mangás já chegou naquele ponto em que eu honestamente nem sei como resumir. É uma coleção enorme, construída ao longo de anos e espalhada por séries completamente diferentes. Provavelmente é a parte da coleção que melhor representa o meu problema em gostar demais de coisa ao mesmo tempo. É minha coisa boa.",
      en: "The manga collection has reached the point where I honestly don't even know how to sum it up. It's a huge collection, built over years and spread across completely different series. It's probably the part that best captures my problem with liking way too many things at once. It's my happy thing.",
    },
    stats: [
      { label: { pt: "TAMANHO", en: "SIZE" }, value: { pt: "nem pergunta", en: "don't ask" } },
      { label: same("STATUS"), value: { pt: "é minha coisa boa", en: "it's my happy thing" } },
    ],
  },
];

export const collectionUI = {
  pt: {
    location: "07 / ACERVO", title: "COLLECTION ROOM", intro: "aparentemente hobby digital não era o suficiente",
    cabinet: "ACERVO PESSOAL", prompt: "Puxe uma prateleira. Tem história aí.", open: "PUXAR", close: "GUARDAR",
    reading: "NA MESA", label: "ANOTAÇÕES DO DONO", index: "COMPARTIMENTOS", empty: "Escolha uma prateleira para abrir as anotações.",
    footnote: "Objetos ilustrativos. As histórias e o caos são reais.", booksLink: "Ir para as leituras favoritas →",
  },
  en: {
    location: "07 / STORAGE", title: "COLLECTION ROOM", intro: "apparently digital hobbies weren't enough",
    cabinet: "PERSONAL ARCHIVE", prompt: "Pull out a shelf. There's a story in there.", open: "PULL", close: "PUT BACK",
    reading: "ON THE DESK", label: "OWNER'S NOTES", index: "COMPARTMENTS", empty: "Pick a shelf to open the notes.",
    footnote: "Illustrative objects. Real stories, real chaos.", booksLink: "Go to favorite reads →",
  },
};
