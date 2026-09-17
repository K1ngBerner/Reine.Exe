# REINE.EXE

Site pessoal em React + TypeScript + Vite. Oito áreas, estética de save de portátil, conteúdo em português e armazenamento exclusivamente local para progresso.

## Executar

Node.js 22.12+ (ou 24 LTS) e npm:

```sh
npm install
npm run dev
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
  pages/Areas.tsx         # sete áreas secundárias, carregadas sob demanda
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
| Faixa, título, autoria e streaming | `src/data/music.ts` |
| Regras das conquistas | `src/hooks/useSave.ts` |

As seis opiniões fornecidas estão preservadas integralmente, com pequenos ajustes tipográficos. Os dados do livro The Problem of the Green Capsule foram corrigidos conforme fornecido pelo usuário. Relatos pessoais não fornecidos permanecem vazios. O jogo e o livro atuais ficam vazios até serem informados.

## Imagens e animações

- Perfil original: `public/assets/profile/reine-profile.png`. Não foi redesenhado ou filtrado.
- Personagem: `public/assets/ui/idle.png`, `talking.png`, `blink.png`, `happy.png`.
- Logo: `public/assets/brand/2doods.jpg`.
- Jogos: `public/assets/games/`; a associação está em `src/pages/Areas.tsx`.
- Projetos Pokémon: `public/assets/pokemon/`; caminhos em `src/data/pokemon.ts`.
- Os hobbies usam linhas de menu, sem animação contínua no hover. Não há GIFs falsamente atribuídos a jogos. Novos GIFs podem ficar em `public/assets/ui/`; prefira vídeo WebM/MP4 com poster e o componente `MotionAsset` para idle/hover/selected e pausa fora da tela.
- As fichas da estante são tipográficas, não capas inventadas. As capas reais não são necessárias para o funcionamento.

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
3. O `base: './'` funciona em subdiretórios, incluindo GitHub Pages. Navegação com hash não exige rewrites no servidor.
4. No GitHub Pages, use um workflow com Node, `npm install`, `npm run build`, upload de `dist` e deploy-pages; habilite Pages por GitHub Actions nas configurações do repositório.
5. Em hosts com build automático: comando `npm run build`; saída `dist`. Não publique `node_modules` ou arquivos de credenciais.

`.openai/hosting.json` registra a hospedagem Sites vinculada a este projeto. A publicação inicial, quando concluída, é privada e não muda automaticamente a audiência.

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
