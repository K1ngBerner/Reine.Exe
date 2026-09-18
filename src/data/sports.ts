import type { Entry } from "./types";
import assets from "./assets.json";

const team = (name: string, fallback: string, logo?: string) => ({
  name,
  fallback,
  logo,
});

export const sports: Entry[] = [
  {
    id: "football",
    name: "Football",
    subtitle: "90 MIN · 11 × 11",
    context:
      "Duas equipes de onze tentam colocar a bola no gol adversário. Goleiro, defesa, meio-campo e ataque dividem responsabilidades; só o goleiro pode usar as mãos, dentro da própria área. São dois tempos de 45 minutos, mais acréscimos.\n\nNo impedimento, a posição é avaliada no momento do passe de um companheiro: estar mais perto da linha de gol que a bola e o penúltimo adversário, no campo rival, pode ser infração se o jogador participar ativamente. Faltas podem resultar em tiro livre, pênalti e cartões.",
    personal:
      "Futebol pra mim é quase uma coisa herdada. É o esporte favorito do meu pai e eu assisto desde antes de conseguir lembrar quando comecei, então acabou virando aquele clássico amor que passa de pai pra filho.\n\nCom o tempo a coisa saiu bastante da televisão também. Já fui a estádios no Brasil e em lugares como Espanha, Argentina e Alemanha, e é muito difícil não respeitar o tamanho que esse esporte consegue ter em culturas completamente diferentes.\n\nFlamengo e Bayern são os dois times que acabaram ficando comigo, então já passei tempo demais da minha vida vendo jogo dos dois a torto e a direito.\n\nMas no geral eu não sou muito seletivo não. Se existe uma liga disponível e uma bola rolando, existe uma chance considerável de eu acabar assistindo.\n\nTem que respeitar o tal do futebas.",
    sportMeta: {
      variant: "football",
      overview:
        "Vejo futebol desde antes de conseguir lembrar quando comecei. Flamengo, Bayern e praticamente qualquer campeonato que estiver passando.",
      teams: [
        team("CR Flamengo", "FLA", assets.flamengo),
        team("FC Bayern München", "FCB", assets.bayernMunich),
      ],
      seenIrl: ["Brazil", "Spain", "Argentina", "Germany"],
    },
  },
  {
    id: "basketball",
    name: "Basketball",
    subtitle: "QUADRA · 5 × 5",
    context:
      "Cinco de cada lado. A bola precisa entrar na cesta, mas chegar lá envolve passes, dribles e movimentação sem a bola. Uma cesta vale dois pontos ou três de fora do arco; lance livre vale um.\n\nA posse tem tempo limitado para a tentativa de arremesso. Não vale caminhar segurando a bola sem driblar. Contato ilegal pode ser falta, gerando reposição ou lances livres. Duração dos períodos e alguns detalhes variam entre ligas.",
    personal:
      "Meu gosto por basquete nasceu de um jeito meio absurdo: eu assisti Kuroko no Basket, gostei pra caralho e resolvi entrar numa escolinha.\n\nO negócio que começou por causa de anime simplesmente ficou, e hoje basquete é provavelmente meu esporte favorito de acompanhar, mesmo com o Chicago Bulls fazendo questão de testar essa relação todos os anos.\n\nTambém tive a oportunidade de ver NBA ao vivo, Wizards e Nets, e é uma experiência muito diferente de assistir pela televisão.\n\nJá acompanhei Mundial com o Flamengo e hoje assisto NBA, NBB e NCAA com bastante frequência.\n\nÉ engraçado pensar que um dos esportes que mais fazem parte da minha rotina começou basicamente porque eu vi cinco japoneses fazendo poderes sobrenaturais numa quadra.",
    sportMeta: {
      variant: "basketball",
      overview:
        "Começou com Kuroko no Basket, virou escolinha e acabou se tornando meu esporte favorito. O Bulls infelizmente veio junto.",
      teams: [team("Chicago Bulls", "CHI", assets.chicagoBulls)],
      otherConnection: "Flamengo Basketball",
      leagues: ["NBA", "NBB", "NCAA"],
      seenIrl: ["NBA", "Washington Wizards", "Brooklyn Nets"],
    },
  },
  {
    id: "baseball",
    name: "Baseball",
    subtitle: "9 INNINGS · 3 OUTS",
    context:
      "Duas equipes passam um bom tempo tentando convencer uma bola a não cair onde deveria. Na prática, alternam ataque e defesa durante nove entradas (innings), normalmente.\n\nO pitcher arremessa e o batter tenta rebater. O ataque marca uma run ao percorrer as três bases e voltar ao home plate. Três eliminações encerram a metade da entrada. Três strikes eliminam o rebatedor; quatro balls concedem a primeira base. Empates podem levar a entradas extras.",
    personal:
      "Baseball é o hobby que eu menos consigo explicar de onde veio.\n\nTorço para o Chicago Cubs desde 2014, mas não existe uma grande história de origem. Eu simplesmente vi um jogo, gostei e aparentemente decidi que aquilo faria parte da minha vida dali em diante.\n\nHoje é meu segundo esporte favorito, mas provavelmente é o que eu mais consumo.\n\nMLB é o óbvio, mas assisto também NPB no Japão, KBO na Coreia e cheguei naquele ponto completamente saudável em que separo espaço no calendário para acompanhar baseball colegial japonês.\n\nTalvez ajude o fato de o esporte praticamente nunca acabar: temporadas gigantes, jogos acontecendo o tempo inteiro e sempre alguma liga em algum canto do planeta.\n\nEu só aceitei que gosto muito dessa porra.",
    sportMeta: {
      variant: "baseball",
      overview:
        "Cubs desde 2014. Dodgers principalmente porque qualquer jogo com Ohtani ou Sasaki já consegue minha atenção.",
      teams: [
        team("Chicago Cubs", "CHC", assets.chicagoCubs),
        team("Los Angeles Dodgers", "LAD", assets.losAngelesDodgers),
        team("Doosan Bears", "DOO", assets.doosanBears),
        team("Yomiuri Giants", "YGI", assets.yomiuriGiants),
      ],
      leagues: ["MLB", "NPB", "KBO", "Japanese High School Baseball"],
      players: ["Shohei Ohtani", "Roki Sasaki"],
    },
  },
  {
    id: "f1",
    name: "Formula 1",
    subtitle: "GRID · PNEUS · ESTRATÉGIA",
    context:
      "Parece só acelerar. Até entrar a estratégia. Um fim de semana costuma ter treinos, classificação (quali) e corrida; alguns também têm sprint, com formato próprio. A classificação define a ordem de largada, sujeita a penalidades.\n\nNa corrida, vence quem completa primeiro a distância prevista. Pit stops trocam pneus e mudam estratégias. Compostos diferentes equilibram aderência e duração. Clima, tráfego, bandeiras e safety car podem virar uma corrida do avesso.",
    personal:
      "Meu interesse por Fórmula 1 começou completamente por acaso.\n\nEm 2015 eu acordei mais cedo do que esperava num domingo, tinha uma corrida acontecendo e resolvi assistir.\n\nContinuei acompanhando e, em algum momento, percebi que já estava esperando a corrida do fim de semana.\n\nDos quatro esportes, provavelmente é o que acompanho de forma mais consistente. A temporada é mais enxuta, existe conteúdo pra caralho em volta e gosto principalmente das pequenas histórias que vão surgindo durante o ano.\n\nÀs vezes a graça não está em quem ganhou: é acompanhar um cara que largou em 12º, terminou em 6º e sentir que aquilo foi praticamente uma vitória.\n\nTambém acho interessante o quanto a F1 é condicionada pelo regulamento e pelo conjunto inteiro da equipe. Piloto importa obviamente, mas carro, motor, estratégia, pneus e desenvolvimento conseguem limitar ou transformar completamente uma temporada.\n\nQuando você começa a entender essas internas, acompanhar fica muito mais divertido.\n\ne eu infelizmente torço pra Ferrari.\n\nNão virei gearhead por muito pouco, mas quem entra pelo lado dos carros provavelmente encontra mais uns quinze hobbies esperando logo depois.",
    sportMeta: {
      variant: "f1",
      overview:
        "A temporada é enxuta, as histórias são boas e eu sempre acabo esperando a corrida do fim de semana.",
      teams: [team("Scuderia Ferrari", "FER", assets.ferrari)],
      favorites: ["Max Verstappen", "Charles Leclerc"],
      sideAccount: { handle: "@PapoDeBagre", url: "https://x.com/PapoDeBagre" },
    },
  },
];
