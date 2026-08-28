# Treinamento Secullum — Vegas Vigilância

Você recebeu 2 arquivos:

- **quiz_secullum_vegas.html** — o formulário/quiz responsivo (funciona no celular e no PC).
- **apps_script_codigo.gs** — o código que envia as respostas por e-mail e salva na planilha.

## Passo a passo (5 minutos)

1. Crie uma planilha nova no Google Sheets.
2. Nela, vá em **Extensões → Apps Script**, apague tudo e cole o conteúdo de `apps_script_codigo.gs`. Salve.
3. Clique em **Implantar → Nova implantação → App da Web**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   - Implante e **autorize**.
4. Copie a **URL** gerada (termina em `/exec`).
5. Abra o `quiz_secullum_vegas.html` num editor de texto e localize a linha:
   ```
   const APPS_SCRIPT_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";
   ```
   Cole a URL entre as aspas e salve.
6. Publique o HTML onde quiser (Google Sites, GitHub Pages, seu servidor, etc.) e compartilhe o link com os funcionários.

## Como funciona

- O funcionário digita **nome** e **e-mail**, responde as **21 questões**, vê certo/errado + explicação e recebe a **nota final**.
- Ao terminar, as respostas vão automaticamente para **gerencia.rh@vegasvigilancia.com.br** (e para a planilha).
- **Painel RH** (botão no canto inferior direito): senha **Vegas4747@** — mostra os resultados salvos no navegador e permite exportar CSV. O registro oficial e completo fica no e-mail e na planilha.

## Observações

- O e-mail sai da conta Google que criou o script (limite ~100/dia no Gmail comum).
- Para colocar em cópia outro e-mail, edite a variável `COPIA` no código do Apps Script.
