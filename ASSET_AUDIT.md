# REINE.EXE — assets e Collection Room

Revisão de 17/09/2026. Escopo: imagens de todas as áreas, preservação de Sports/Books e nova Collection Room.

## 1. Causa comprovada

O deploy `https://reineexe.netlify.app` entrega o bundle `assets/index-D8pTKgke.js` e o módulo `assets/Areas-DD5aMCph.js`. Esse módulo referencia corretamente os nomes das três capas PNG e das oito logos SVG, mas **todos esses 11 endpoints retornam HTTP 404, com HTML de erro em vez de imagem**.

Os outros 16 endpoints do manifest respondem 200 e são idênticos aos arquivos locais (15 imagens e um MP3). Portanto, o defeito observado é ausência desses 11 arquivos nas URLs do artefato publicado. Não é causado por hotlink, extensão incorreta ou capitalização diferente das referências locais. Caminhos relativos das capas resolvem corretamente na raiz desse site com navegação por hash; não foram tratados como uma causa comprovada.

No início da tarefa, `git status --short` mostrava **todo o projeto como untracked**, incluindo `public/`; o repositório não tem commits nem remote configurado. Isso é um risco concreto de omissão no versionamento, corrigido pelo staging dos arquivos necessários. Sem o histórico/logs da publicação não é possível distinguir se o upload foi parcial, se veio de uma build anterior ou se a omissão ocorreu na origem Git. Não foi inventada uma causa de infraestrutura.

Reprodução somente leitura: `npm run assets:audit-deploy -- https://reineexe.netlify.app`. Relatório JSON: `qa-results/deployed-assets.json`.

## 2. Correções

- Fonte única de URLs locais: `src/data/assets.json`. Sem `/public/`, caminhos Windows ou hotlinks de imagem em React.
- `base: '/'` e `netlify.toml`: domínio raiz, Node 22, comando `npm run build`, publicação de **todo `dist`**.
- `scripts/check-assets.mjs`: nomes lowercase/kebab, existência, case exato até no Windows, arquivos não vazios, assinatura/extensão, SVG sem imagens externas/scripts, inclusão e conteúdo no índice Git. Recusa novas imagens fora do manifest e `<img>` fora de `SafeImage`.
- O build valida antes e depois do Vite; as cópias de produção devem ser byte a byte iguais aos originais.
- `.gitattributes` preserva bytes de mídia sem conversão CRLF/LF. O checker detectou a conversão automática no SVG do Doosan durante staging; ela foi eliminada sem alterar a arte.
- Todas as imagens passam por `SafeImage`. O elemento quebrado é removido; trocar o `src` permite tentar a nova imagem.
- Ferrari: substituído o antigo desenho de carro pelo SVG da equipe distribuído no site oficial da Formula 1. Origem completa em `ASSET_SOURCES.md`. A versão oficial monocromática recebe fundo neutro escuro pequeno para continuar legível nos dois temas, sem filtro de cor.

## 3. Caminhos finais de produção

Os arquivos físicos ficam em `public` + URL abaixo. O deploy recebe essas mesmas URLs a partir de `dist`.

| Grupo | URLs |
|---|---|
| Books | `/assets/books/battle-of-the-labyrinth.png`, `/assets/books/sign-of-four.png`, `/assets/books/green-capsule.png` |
| Football | `/assets/sports/teams/flamengo.svg`, `/assets/sports/teams/bayern-munich.svg` |
| Basketball | `/assets/sports/teams/chicago-bulls.svg` |
| Baseball | `/assets/sports/teams/chicago-cubs.svg`, `/assets/sports/teams/los-angeles-dodgers.svg`, `/assets/sports/teams/doosan-bears.svg`, `/assets/sports/teams/yomiuri-giants.svg` |
| Formula 1 | `/assets/sports/teams/ferrari.svg` |
| Home | `/assets/profile/reine-profile.png` |
| Guia | `/assets/ui/idle.png`, `/assets/ui/blink.png`, `/assets/ui/happy.png`, `/assets/ui/talking.png` |
| Party | `/assets/party/reineversario-banner.png`, `/assets/party/reineversario.png` |
| Pokémon | `/assets/pokemon/gym-screenshot.png`, `/assets/pokemon/elysium-promo.png`, `/assets/pokemon/unbound-world.png` |
| Games | `/assets/games/persona-royal.jpg`, `/assets/games/pokemon-white-screen.jpg`, `/assets/games/conker-screenshot.jpg` |
| 2Doods | `/assets/brand/2doods.jpg` |
| Outros | `/favicon.svg`, `/audio/background-track.mp3` |

Collection não depende de arquivos de imagem; Credits não contém `<img>` e mantém créditos visíveis.

## 4. Renomeações / preservação

**Nenhuma renomeação necessária:** todos os nomes físicos já estavam normalizados e as assinaturas correspondiam às extensões. Ferrari foi substituído no mesmo caminho, não renomeado. As capas originais foram preservadas, incluindo a pequena Green Capsule, sem IA, conversão ou upscale.

SHA-256, idêntico à cópia fornecida em H: e à versão final:

- Labyrinth: `9CC93D1E33F6341471E4883B92E2A6715AC63B770B37293D51506CD76E01F278`
- Sign of Four: `9E01892E9DB0E75298813D5FAEFE137EF3FFC56104C8DDBD67B638671F5E0F82`
- Green Capsule: `021CD0DD60B77134ADC1E473CC747C009EB61AEDA9C627122E6D8A5BF43E46F2`

## 5. Componentes e dados alterados

- Novo `SafeImage`; adaptados `TeamIdentity`, `MotionAsset`, `PartyArt`, `EntryDetail`, `DialogueBox`, Home, Areas e NPC do App.
- Sports mantém 2×2, detalhes/regras/relatos e frase da Ferrari. Acrescentado label PLAYERS, sem alterar times/pilotos.
- Books mantém sua composição editorial e capas originais; adicionado fallback de título/autor.
- `books`, `pokemon`, `party`, `sports`, `music` usam o manifest.
- `navigation`, `types`, Home, AreaMenu, App, `useSave` e catálogos PT/EN incluem a nona área e contagem dinâmica. Números da Home/mapa agora correspondem ao menu.
- Fontes/créditos e documentação atualizados; nenhuma alteração de conteúdo pessoal não solicitada.

## 6–7. Collection Room e edição

Nova página `src/pages/CollectionRoom.tsx`, estilos em `src/styles/collection.css`. Estante única com objetos distintos em HTML/CSS, cinco puxadores e ficha lateral; mobile usa gavetas em fluxo normal. Enter/Espaço alternam, Escape fecha a ficha e devolve foco; foco visível, regiões rotuladas, sem depender de hover e com reduced motion.

Acesso por menu, mapa, lista da Home ou `/#collection`. Edite **`src/data/collection.ts`**: textos PT/EN, grupos de itens, destaques e microcopy. Todos os relatos PT do pedido foram preservados; não há cartas, preços, consoles ou personagens inventados. Livros físicos são uma categoria diferente das leituras favoritas.

## 8. Fallbacks

- Times: FLA, FCB, CHI, CHC, LAD, DOO, YGI, FER.
- Livros: ficha editorial com título e autor.
- Artes, perfil, screenshots, marca e guia: painel visual rotulado, sem ícone quebrado.
- Vídeo opcional: poster protegido se o clipe falhar; nenhum clipe é obrigatório.
- Áudio mantém tratamento de falha existente.

**Nenhum fallback é necessário no carregamento normal da build validada.** Falhas foram provocadas isoladamente para testar a proteção, não para esconder assets ausentes.

## 9–10. Verificação

- `npm run build`: PASS, incluindo 27 arquivos antes/depois e validação Git.
- `npm run lint`: PASS, zero erros e avisos.
- `npm run test:assets`: PASS, arquivos vazios, extensão falsa, HTML, SVG externo/ativo, URL inválida, case e ausência.
- `npm run preview -- --port 4173 --strictPort`: build real servida em localhost.
- `npm run test:production`: PASS. 27 endpoints HTTP 200, MIME correto, bytes idênticos; 26 imagens decodificadas pelo Chromium.
- 80 combinações de área/modal × desktop/mobile × PT/EN × night/day, mais 5 larguras (320, 760, 820, 900, 1024): **85 verificações**. Navegação por Home/mapa/menu, teclado, texto e reduced motion testados.
- 7 cenários de falha intencional: Home, Sports, Books, Pokémon, Games, 2Doods e diálogo. Nenhum `<img>` quebrado permanece.
- Sem 404 de imagem ou erro de console na build saudável. Cancelamentos `ERR_ABORTED` do preload de áudio ao fechar/navegar são registrados separadamente (não são arquivos ausentes; o MP3 foi verificado integralmente).
- Inspeção visual dos screenshots de Collection, Sports, Books, Home e fallbacks; relatórios/imagens em `qa-results/`, fora do Git.

## 11. Pendências e publicação

**Nenhum asset obrigatório pendente no projeto/build.** Os 27 arquivos de mídia foram incluídos no índice do Git, junto do código necessário. Não foi feito commit, push nem deploy.

O Netlify continua entregando o artefato anterior até uma nova publicação. Para corrigir o site público, publicar a build completa `dist` desta revisão (ou fazer commit/push para o fluxo configurado), não apenas JS/CSS. A auditoria remota deve ser repetida após publicar. A validação local não é apresentada como uma atualização já feita no servidor.
