import type { Entry } from "./types";
import assets from "./assets.json";
export const pokemon: Entry[] = [
  {
    id: "gym",
    name: "Pokémon This Gym of Mine",
    subtitle: "Dessa vez, o líder é você.",
    image: assets.gym,
    creator: "Omegas",
    platform: "Standalone · Pokémon Essentials",
    genre: "Fangame / gestão / RPG",
    status: "Projeto da comunidade",
    source: "https://eeveeexpo.com/threads/2306/",
    context:
      "Em Umbal City, você assume um ginásio, escolhe uma especialização de tipo, recebe desafiantes e participa do desenvolvimento da cidade.",
    features: [
      "Liderar um ginásio",
      "Especialização de tipo",
      "Desenvolvimento de Umbal City",
    ],
    significance:
      "Inverte o papel tradicional do jogador e explora o cotidiano de quem normalmente seria apenas uma parada na jornada.",
    personal: "",
  },
  {
    id: "elysium",
    name: "Pokémon Elysium",
    subtitle: "Uma estrutura antiga. Outra história.",
    image: assets.elysium,
    creator: "BlackKaiser",
    platform: "Pokémon FireRed 1.0 · GBA",
    genre: "ROM Hack / RPG narrativo",
    status: "Completo · 2.5.0 · julho de 2026",
    source:
      "https://www.pokecommunity.com/threads/pok%C3%A9mon-elysium-gba.502953/",
    context:
      "Uma campanha longa em Part A e Part B, com prólogo, quatro capítulos e epílogo. A história e a construção do mundo são o centro da experiência.",
    features: [
      "Diferentes regiões e sidequests",
      "Tipo Fairy e Physical/Special Split",
      "Movimentos posteriores e algumas Mega Evoluções",
      "Melhorias de qualidade de vida",
    ],
    significance:
      "Mostra até onde uma comunidade consegue levar uma estrutura antiga para contar outra história.",
    personal: "",
  },
  {
    id: "unbound",
    name: "Pokémon Unbound",
    subtitle: "Borrius merece sua própria viagem.",
    image: assets.unbound,
    creator: "Skeli e equipe",
    platform: "Pokémon FireRed · GBA",
    genre: "ROM Hack / RPG",
    status: "Campanha completa",
    source:
      "https://www.pokecommunity.com/threads/pok%C3%A9mon-unbound-completed.382178/",
    context:
      "A região de Borrius, sua história antiga e a organização Shadows dão forma a uma aventura com sistemas profundamente ampliados.",
    features: [
      "Complete FireRed Upgrade e mecânicas modernas",
      "Quatro dificuldades e sistema de missões",
      "Customização, eventos diários e dia/noite",
      "Minigames, puzzles, pós-jogo e trilha própria",
    ],
    significance:
      "Reorganiza a experiência sobre FireRed com uma engine de batalha muito modificada e diversas melhorias de qualidade de vida.",
    personal: "",
  },
];
export const handhelds = [
  {
    name: "AYN Thor",
    text: "",
  },
  {
    name: "R36S",
    text: "",
  },
];
