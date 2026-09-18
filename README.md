# REINE.EXE

Site pessoal em React + TypeScript + Vite. Nove áreas, conteúdo PT/EN, temas dia/noite e armazenamento exclusivamente local para progresso.

## Executar

Node.js 22.12+ (ou 24 LTS) e npm:

```sh
npm install
npm run dev
# Após adicionar/trocar assets, inclua os arquivos no índice do Git:
git add public src/data/assets.json .gitattributes
npm run build
npm run lint
npm run preview
```

O ambiente de criação disponibilizou pnpm. O `pnpm-lock.yaml` fixa as versões utilizadas; para reproduzi-las exatamente, use `pnpm install --frozen-lockfile`, `pnpm run dev`, `pnpm run build` e `pnpm run lint`. O script de instalação do esbuild está explicitamente autorizado em `pnpm-workspace.yaml`.

## Estrutura

```text
src/
  App.tsx                 # shell, navegação, intro, mapa e coordenação
  pages/Home.tsx          # página inicial e Trainer Card
  pages/Areas.tsx         # áreas secundárias, carregadas sob demanda
  pages/CollectionRoom.tsx # estante interativa / gavetas mobile
  components/
    Window.tsx            # dialog nativo, foco, Escape, drag desktop
    EntryDetail.tsx       # fichas e abas dos esportes
    DialogueBox.tsx       # NPC, digitação opcional e navegação
    Player.tsx            # áudio persistente entre áreas
  hooks/useSave.ts         # localStorage, sessão e achievements
  data/                   # conteúdo editável e tipos
  styles/main.css         # identidade, dia/noite e responsividade
public/assets/            # imagens locais
public/audio/             # faixa fornecida pelo usuário
```

## Onde editar

| Conteúdo | Arquivo |
|---|---|
| Apresentação e atividades atuais | `src/data/about.ts` |
| Opiniões e dados dos três jogos | `src/data/games.ts` |
| Fan projects e handhelds | `src/data/pokemon.ts` |
| Livros, memórias e dados de The Problem of the Green Capsule | `src/data/books.ts` |
| Regras e relatos pessoais dos esportes | `src/data/sports.ts` |
| Conversas dos hobbies | `src/data/hobbies.ts` |
| Nome das áreas | `src/data/navigation.ts` |
| Canal e vídeos | `src/data/2doods.ts` |
| YouTube e portfólio | `src/data/links.ts` |
| Créditos e fontes | `src/data/credits.ts` |
| Collection: textos PT/EN, itens, grupos e destaques | `src/data/collection.ts` |
| Caminhos de todas as imagens e do áudio | `src/data/assets.json` |
| Atividades atuais | `src/data/current.ts` |
| Faixa, título, autoria e streaming | `src/data/music.ts` |
| Regras das conquistas | `src/hooks/useSave.ts` |

Os relatos pessoais fornecidos estão preservados. Relatos ainda não fornecidos permanecem vazios. As atividades atuais ficam em `src/data/current.ts`, com versões PT/EN.

## Imagens e animações

- Perfil original: `public/assets/profile/reine-profile.png`. Não foi redesenhado ou filtrado.
- Personagem: `public/assets/ui/idle.png`, `talking.png`, `blink.png`, `happy.png`.
- Logo: `public/assets/brand/2doods.jpg`.
- Jogos: `public/assets/games/`; a associação está em `src/pages/Areas.tsx`.
- Projetos Pokémon: `public/assets/pokemon/`.
- Os hobbies usam linhas de menu, sem animação contínua no hover. Não há GIFs falsamente atribuídos a jogos. Novos GIFs podem ficar em `public/assets/ui/`; prefira vídeo WebM/MP4 com poster e o componente `MotionAsset` para idle/hover/selected e pausa fora da tela.
- Livros: três capas originais em `public/assets/books/`, sem conversão ou upscale. Green Capsule é exibida pequena. O fallback editorial é apenas proteção contra falhas.

## Pipeline de assets

`src/data/assets.json` é a fonte única de URLs locais. `/assets/...` corresponde a `public/assets/...`; nunca use `/public/...`, caminhos do Windows ou hotlinks em componentes.

`npm run assets:check` verifica nomes normalizados, existência, capitalização exata (inclusive no Windows), assinatura/extensão, dependências externas em SVGs e inclusão no índice do Git. Imagens novas em `public` precisam entrar no manifest. O checker também impede `<img>` fora de `SafeImage` e caminhos soltos no código. Assets alterados precisam ser adicionados ao Git antes do build. `.gitattributes` impede alteração dos bytes originais por conversão CRLF/LF.

`npm run build` executa o checker antes do Vite e compara cada arquivo de `dist` byte a byte depois. Sem metadados Git (por exemplo ZIP), essa parte específica é avisada e pulada; todas as verificações físicas continuam obrigatórias. Incluir no índice não equivale a commit ou push.

Todos os componentes de imagem usam `SafeImage`: sigla para times, título/autor para livros e painel editorial para arte ausente. Ao falhar, o `<img>` é removido; outra URL pode carregar normalmente.

Manutenção das logos: `npm run assets:sports` (ou `pnpm assets:sports`). O script não roda no site nem durante o build; preserva arquivos válidos existentes. Edite `teams` em `scripts/fetch-sports-assets.mjs` e a origem em `ASSET_SOURCES.md`. Para renovar um único arquivo: `npm run assets:sports -- --force --only=ferrari`. Downloads têm timeout, checagem de HTTP/MIME/assinatura e gravação atômica; falhas não apagam a versão anterior nem criam arquivos vazios.

## Collection Room

Acesso: menu **COLEÇÃO / COLLECTION**, mapa, lista da Home ou `/#collection`. Cinco compartimentos compartilham a mesma estante: consoles, figures, TCG, livros físicos e mangás. No desktop a ficha abre ao lado; em telas pequenas abre logo abaixo da prateleira. Enter/Espaço abrem e fecham; Escape dentro da ficha fecha e devolve o foco ao puxador. Animações respeitam movimento reduzido.

Edite `collection` e `collectionUI` em `src/data/collection.ts`; cada texto tem `pt` e `en`. Não é necessário baixar imagens para esta área: os objetos são representações abstratas em CSS, não produtos ou cartas inventados. A coleção física de livros é distinta das três leituras favoritas.

## Testar a produção

```sh
npm run test:assets
npm run build
npm run lint
npx playwright install chromium
npm run preview -- --port 4173 --strictPort
# Em outro terminal:
npm run test:production
```

O teste abre o navegador headless contra o preview, verifica cada URL/MIME/byte/decodificação, todas as áreas e créditos em desktop/mobile × PT/EN × dia/noite, gavetas por teclado, larguras de 320–1024 px e falhas intencionais de imagens. Screenshots e relatório são salvos em `qa-results/` (ignorado pelo Git). Cancelamentos de preload de áudio durante navegação são registrados separadamente; 404, falhas reais e erros de console reprovam.

## Música

O MP3 fornecido está em `public/audio/background-track.mp3`. O título configurado é **Inception**, não a música de Rosa Walton. Nenhum áudio comercial foi baixado. O player inicia pausado, oferece volume (20% inicial), mute e progresso; não reinicia ao navegar. Falhas no arquivo desabilitam reprodução. Há link de busca no streaming para a faixa de Rosa Walton.

Para substituir, troque o arquivo e atualize `src/data/music.ts`. Para retirar áudio, defina `src` vazio e o player oferece o streaming. A escolha de volume fica no sessionStorage; novas visitas não começam tocando sozinhas.

## Vídeos

Preencha `videos` em `src/data/2doods.ts` com objetos `{ id: 'ID_REAL_DO_YOUTUBE', title: 'Título' }`. Não precisa de API key. O embed usa youtube-nocookie.com e carregamento lazy. A lista vazia aponta para o canal real.

## Save, acessibilidade e exploração

`reine-save` guarda primeira visita, visitas, áreas, fichas, sete badges e três segredos. `reine-started` pula a intro em retornos; `reine-theme` guarda o ambiente. Falhas de storage não impedem a navegação. Tudo permanece neste navegador, sem analytics ou backend.

As janelas usam dialog nativo (focus trap, Escape, retorno de foco); desktop permite arrastar e minimizar. No celular o arrasto e a minimização são removidos. Uma ficha de cada vez mantém a leitura acessível. Navegação por hash funciona em hospedagem estática. `prefers-reduced-motion` remove animações e desliga a digitação inicial. O mapa é opcional.

Segredos: código ↑ ↑ ↓ ↓ ← → ← → B A; cinco cliques no Trainer Card; estrela ao lado do NPC.

## Deploy

1. Execute `npm run build` e `npm run lint`.
2. Publique o conteúdo de `dist` em um host estático (GitHub Pages, Cloudflare Pages, Netlify etc.).
3. O projeto agora usa `base: '/'` e assets absolutos de raiz, para Netlify/domínio raiz. Não publique sob subdiretório sem adaptar a resolução central de URLs. Navegação por hash não precisa de rewrites.
4. `netlify.toml` define Node 22, comando `npm run build` e saída `dist`.
5. Confirme `git status`, faça commit/push dos assets e do código e publique a mesma revisão. Nunca publique `public` sozinho: a saída completa é `dist`. Não publique `node_modules` ou credenciais.

Esta revisão foi validada no preview da build, não publicada. A auditoria de `https://reineexe.netlify.app` confirmou que as três capas e as oito logos retornam 404 no deploy antigo. Veja `ASSET_AUDIT.md`. Depois de publicar, compare novamente com `npm run assets:audit-deploy -- https://reineexe.netlify.app`: o comando é somente leitura e reprova arquivos ausentes ou diferentes da versão local.

## Conteúdo que falta completar

Consulte `ASSET_TODO.md`. Fontes e créditos detalhados das imagens reais estão em `ASSET_SOURCES.md` e também dentro do site.

## Segunda passada visual

A direção atual está em `src/styles/midnight.css`. Ela substitui a paleta e as composições visuais, preservando os componentes funcionais existentes.

- Dados pessoais e LV.25: `src/data/about.ts` (`profile`).
- Links sociais LINK CABLE: `src/data/social.ts`.
- Artes originais: `public/assets/party/reineversario-banner.png` e `public/assets/party/reineversario.png`.
- Crédito e caminhos: `src/data/party.ts`; crédito visível renderizado por `src/components/PartyArt.tsx`, acima da obra.
- World map: `src/components/AreaMenu.tsx`, lista com cursor e navegação por setas.
- Badges não descobertos: nome ??? e descrição omitida; regras preservadas em `src/hooks/useSave.ts`. Saves antigos são migrados para o novo identificador do livro sem apagar progresso.
- Não foi baixada a faixa de Rosa Walton. O MP3 anterior (Inception) permanece corretamente identificado e o link de streaming continua disponível. YES na entrada redefine o volume para 20%.

Veja `VISUAL_REVISION.md` para a auditoria e `ASSET_TODO.md` para campos restantes.
