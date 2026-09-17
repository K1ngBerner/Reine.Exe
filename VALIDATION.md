# Verificação

- TypeScript estrito e build Vite de produção.
- ESLint: código da aplicação e configuração.
- Navegação pelas oito áreas em 1920×1080, 768×1024, 390×844 e 360×800 sem overflow horizontal.
- Treze fichas: 3 jogos, 3 projetos, 4 esportes, 3 livros.
- Sete conquistas desbloqueadas e preservadas após recarregar.
- Visitas contadas uma vez por carregamento, inclusive em React StrictMode.
- Dialog nativo recebe foco; Escape fecha; minimizar/restaurar e drag desktop exercitados.
- Áudio começa pausado e continua sem reiniciar ao mudar de área.
- Reduced motion desativa a transição entre áreas.
- Nenhum erro de JavaScript observado no navegador durante o percurso.
- Inspeção visual de Home desktop/mobile, mapa noturno e ficha de jogo.

As fontes externas foram consultadas durante a pesquisa (ASSET_SOURCES.md). Disponibilidade futura de páginas de terceiros e embeds não é garantida. Nenhuma URL de ROM comercial é usada.

Os screenshots e o script de QA desta sessão ficam em `qa-results/` (ignorado no Git; dependem do Playwright instalado no ambiente de criação).

## Segunda passada visual

- Build e lint aprovados após a revisão.
- Oito áreas em 1920, 768, 390 e 360 px sem overflow horizontal; nenhuma exceção JavaScript.
- YES inicia o arquivo local em 20%, mesmo com preferência anterior de 80%.
- Badges bloqueados mostram ??? e nenhuma condição de desbloqueio.
- As 13 fichas continuam abrindo; sete conquistas continuam alcançáveis.
- Migração de save anterior preserva primeira visita, contagem, livros abertos, badge Bookworm e segredos.
- Menu de áreas responde a setas e Enter, com foco dentro da janela.
- Cinco links sociais e crédito do artista têm destinos exatos, nova aba e rel seguro.
- Banner permanece ao trocar categorias Pokémon; MY PARTY mantém resolução original de 5688×3971.
- Novos arquivos de arte têm SHA-256 idêntico aos anexos. Nada foi recortado, filtrado ou recomprimido.
- Inspeção visual da Home, Pokémon, mapa e versões mobile noturna/diurna.
