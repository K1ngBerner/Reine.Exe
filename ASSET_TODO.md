# Pendências de conteúdo e mídia

Nenhuma imagem quebrada é usada como placeholder.

- **Esportes**: relatos pessoais fornecidos já integrados em `src/data/sports.ts`; o site não afirma times, pilotos, viagens ou experiências não fornecidas.
- **2Doods**: escolher IDs de vídeos reais em `src/data/2doods.ts`. O canal já está vinculado.
- **Atividades atuais**: escolher jogo/livro/programa exatos em `src/data/about.ts`; jogo e livro atuais estão vazios e aparecem como um traço.
- **MP3**: completar autoria, fonte e termos de uso do arquivo enviado em `src/data/music.ts` e `credits.ts`. O nome “Copyright Safe” foi fornecido no arquivo, não é uma verificação independente de licença.
- **GIFs/clipes opcionais**: faltam clipes reais para estados animados dos três jogos e projetos. Screenshots/promotional art locais estão integrados. Não foram gerados vídeos falsos. `MotionAsset` aceita poster e clip; respeita reduced motion e pausa fora da viewport.
- **Capas de livros**: as três capas fornecidas por Reine já estão copiadas sem alteração em `public/assets/books/`.
- **Marcas esportivas**: falta um asset local confiável para Scuderia Ferrari; a interface usa a sigla `FER` até que uma fonte seja verificada.
- **Sons de UI**: nenhum arquivo fornecido; não há efeito sonoro automático.

Os assets de perfil, quatro expressões, logo, MP3, seis screenshots/promotional artworks e as duas artes originais MY PARTY estão instalados localmente.

- **Opiniões sobre fan projects e handhelds**: campos pessoais vazios em `src/data/pokemon.ts` aguardam texto do autor.
- **Faixa desejada**: I Really Want to Stay at Your House está disponível via link de streaming. Nenhum arquivo dessa música foi fornecido; o MP3 local continua sendo Inception.
