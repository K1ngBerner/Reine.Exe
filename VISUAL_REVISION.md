# Segunda passada: depois da meia-noite

## Paleta

| Cor | Uso |
|---|---|
| `#100020` | Ink, sidebar, molduras, intro e player |
| `#203060` | Deep navy de referência / tokens |
| `#202040` | Painéis selecionados e broadcast |
| `#706080` | Bordas, metadata e roxo secundário |
| `#103040` | Painéis de esporte e livros |
| `#902040` | Seleção, navegação e vinho/magenta |
| `#E8E8E8` | Texto e modo diurno |
| `#D05030` | Foco de teclado e pequeno destaque quente |

Tons derivados são usados apenas para contraste legível. Sem grandes gradientes, glow ou amarelo/azul dominante.

## Redesenhado

- `HomePage`: composição assimétrica de save; status e atividades em linhas; foto original preservada; acesso ao LINK CABLE.
- `LinkCable`: lista de cinco conexões, com nomes e handles fornecidos.
- `PartyArt` e `PartyStrip`: originais sem filtros, recorte ou recompressão; crédito visível acima da obra.
- `AreaMenu`: lista de áreas com seleção por foco/hover, teclas ↑/↓/Home/End e confirmação normal por Enter.
- Games, Sports e hobbies: layouts em listas, em vez de repetir grids de cards.
- Books: estante com alturas deliberadamente diferentes; livro corrigido com título alemão, autor e 1939 visíveis.
- Badges: bloqueados exibem ??? e não revelam condições; nomes e condições aparecem após desbloqueio.
- Intro, player, janelas, fonte de foco e favicon usam a nova identidade.

## Removido da composição

- Hero de apresentação com chamada grande e três cards de atividades.
- Grid de tiles do mapa e caminhos decorativos.
- Contêineres e sombras fortes repetidas; rotação decorativa do Trainer Card.
- Animação contínua dos ícones de hobbies e zoom de imagens dos jogos.
- Entrada incorreta do terceiro livro e placeholders de autoria/ano associados.
- Relatos esportivos e opiniões sobre projetos que não foram fornecidos: campos vazios no dataset.

Nenhum sistema de save, achievements, áudio, diálogo, navegação ou acessibilidade foi removido. A migração do identificador do livro mantém o progresso salvo.

## Artes e crédito

`public/assets/party/reineversario-banner.png` e `public/assets/party/reineversario.png` são cópias byte a byte dos arquivos recebidos. Os hashes SHA-256 foram comparados.

Crédito visível: **MY PARTY — Illustration by @ped_joaquim ♡**, em `PartyArt.tsx`, com link `https://x.com/ped_joaquim`, nova aba e `noopener noreferrer`. Dados centralizados em `src/data/party.ts` e crédito também registrado em `src/data/credits.ts`.

## Edição e pendências

Links: `src/data/social.ts`. Textos: `src/data/`. Tema: `src/styles/midnight.css`.

Permanecem vazios: jogo/livro atuais, relatos pessoais esportivos, comentários próprios sobre fan projects/handhelds e origem específica de alguns hobbies. Vídeos da 2Doods e clipes opcionais não foram fornecidos. A faixa local é Inception; Rosa Walton continua disponível pelo streaming. Nenhum áudio foi baixado.
