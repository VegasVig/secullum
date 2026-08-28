/*************************************************************
 * TREINAMENTO SECULLUM — VEGAS VIGILÂNCIA
 * Google Apps Script — recebe as respostas do quiz,
 * envia por e-mail ao RH e guarda tudo numa planilha.
 *
 * COMO INSTALAR (passo a passo no final do arquivo).
 *************************************************************/

// ===== CONFIGURAÇÃO =====
var RH_EMAIL  = "gerencia.rh@vegasvigilancia.com.br";  // destinatário
var COPIA     = "";                                     // e-mail em cópia (opcional). Ex: "voce@empresa.com"
var NOME_ABA  = "Respostas";                            // nome da aba da planilha
// ========================

function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);

    salvarNaPlanilha(dados);
    enviarEmail(dados);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, erro: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function salvarNaPlanilha(d) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var aba = ss.getSheetByName(NOME_ABA);
  if (!aba) {
    aba = ss.insertSheet(NOME_ABA);
    aba.appendRow(["Data/Hora", "Nome", "E-mail", "Acertos", "Total", "%", "Respostas detalhadas"]);
    aba.getRange(1, 1, 1, 7).setFontWeight("bold");
  }

  var detalhe = (d.respostas || []).map(function (r, i) {
    return (i + 1) + ") [" + r.modulo + "] " + r.pergunta +
           "\n   Resposta: " + r.escolha +
           "\n   Correta:  " + r.correta +
           "\n   " + (r.acertou ? "[ACERTOU]" : "[ERROU]");
  }).join("\n\n");

  aba.appendRow([
    d.data || new Date().toLocaleString("pt-BR"),
    d.nome || "",
    d.email || "",
    d.acertos,
    d.total,
    d.percentual + "%",
    detalhe
  ]);
}

function enviarEmail(d) {
  var assunto = "Treinamento Secullum — " + d.nome + " (" + d.percentual + "%)";

  var linhas = (d.respostas || []).map(function (r, i) {
    var cor = r.acertou ? "#1f7a3d" : "#b3261e";
    var tag = r.acertou ? "ACERTOU" : "ERROU";
    return '<tr>' +
      '<td style="padding:8px;border:1px solid #ddd;vertical-align:top;">' + (i + 1) + '</td>' +
      '<td style="padding:8px;border:1px solid #ddd;">' +
        '<b>' + escapeHtml(r.modulo) + '</b><br>' + escapeHtml(r.pergunta) +
        '<br><br><b>Resposta do funcionário:</b> ' + escapeHtml(r.escolha) +
        '<br><b>Resposta correta:</b> ' + escapeHtml(r.correta) +
      '</td>' +
      '<td style="padding:8px;border:1px solid #ddd;color:' + cor + ';font-weight:bold;white-space:nowrap;">' + tag + '</td>' +
    '</tr>';
  }).join("");

  var html =
    '<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;color:#222;">' +
      '<div style="background:#0d0f14;color:#fff;padding:20px;border-radius:10px 10px 0 0;">' +
        '<h2 style="margin:0;color:#f5a623;">Treinamento Secullum — Vegas Vigilância</h2>' +
        '<p style="margin:6px 0 0;color:#9aa5b8;">Novo resultado recebido</p>' +
      '</div>' +
      '<div style="border:1px solid #ddd;border-top:none;padding:20px;border-radius:0 0 10px 10px;">' +
        '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">' +
          '<tr><td style="padding:6px 0;"><b>Nome:</b></td><td>' + escapeHtml(d.nome) + '</td></tr>' +
          '<tr><td style="padding:6px 0;"><b>E-mail:</b></td><td>' + escapeHtml(d.email) + '</td></tr>' +
          '<tr><td style="padding:6px 0;"><b>Data:</b></td><td>' + escapeHtml(d.data) + '</td></tr>' +
          '<tr><td style="padding:6px 0;"><b>Pontuação:</b></td><td style="font-size:18px;color:#f5a623;"><b>' +
            d.acertos + '/' + d.total + ' (' + d.percentual + '%)</b></td></tr>' +
        '</table>' +
        '<h3 style="border-bottom:2px solid #f5a623;padding-bottom:6px;">Respostas detalhadas</h3>' +
        '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
          '<tr style="background:#f2f2f2;"><th style="padding:8px;border:1px solid #ddd;">#</th>' +
          '<th style="padding:8px;border:1px solid #ddd;text-align:left;">Questão</th>' +
          '<th style="padding:8px;border:1px solid #ddd;">Resultado</th></tr>' +
          linhas +
        '</table>' +
      '</div>' +
    '</div>';

  var opcoes = { htmlBody: html, name: "Treinamento Secullum" };
  if (COPIA) opcoes.cc = COPIA;

  MailApp.sendEmail(RH_EMAIL, assunto, "Resultado do treinamento (veja em HTML).", opcoes);
}

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* Função de teste opcional — rode uma vez no editor para ver o e-mail chegar */
function testeManual() {
  enviarEmail({
    nome: "Fulano Teste", email: "fulano@teste.com",
    data: new Date().toLocaleString("pt-BR"),
    acertos: 3, total: 21, percentual: 14,
    respostas: [
      { modulo: "Módulo 1", pergunta: "Pergunta de teste?", escolha: "A) opção", correta: "B) certa", acertou: false }
    ]
  });
}

/*************************************************************
 * COMO INSTALAR
 * 1. Acesse https://sheets.google.com e crie uma planilha nova
 *    (ex.: "Treinamento Secullum - Respostas").
 * 2. No menu: Extensões > Apps Script.
 * 3. Apague o conteúdo padrão e cole TODO este código.
 * 4. Salve (ícone de disquete).
 * 5. Clique em "Implantar" > "Nova implantação".
 *    - Tipo: "App da Web".
 *    - Executar como: "Eu".
 *    - Quem pode acessar: "Qualquer pessoa".
 *    - Clique em "Implantar" e autorize o acesso.
 * 6. Copie a URL gerada (termina em /exec).
 * 7. Abra o arquivo HTML, localize a linha:
 *        const APPS_SCRIPT_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";
 *    e cole a URL entre as aspas.
 * 8. Pronto! Cada envio cai no e-mail do RH e na planilha.
 *
 * OBS.: O e-mail é enviado pela SUA conta Google (a que criou
 * o script). Limite gratuito: ~100 e-mails/dia (Gmail comum).
 *************************************************************/
