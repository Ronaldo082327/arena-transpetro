/* Dora Rotina: junta a agenda pessoal (arquivo .ics do Google Agenda, iPhone/iCloud ou Outlook) ao ciclo de estudos.
   Funções puras (testáveis em Node) + nada de rede: o aluno exporta/importa o .ics; o link privado da agenda
   só pode ser lido por um servidor (porteiro), porque o navegador bloqueia (CORS).
   - lerICS(texto) -> eventos {inicio, fim, titulo, local, diaInteiro, rrule, exdates}
   - expandir(eventos, de, ate) -> ocorrências concretas no intervalo (RRULE diária/semanal/mensal simples)
   - classificar(ev) -> 'trabalho' | 'transito' | 'saude' | 'aula' | 'compromisso' | 'estudo' | 'descanso'
   - livres(ocorrencias, dia, janela) -> buracos livres do dia (minutos), descontando folga antes/depois
   - encaixar(livres, tarefas) -> blocos de estudo distribuídos nos buracos
   - gerarICS(blocos) -> texto .ics para importar/assinar no celular */
(function (raiz) {
  'use strict';
  function desdobrar(t) { return String(t || '').replace(/\r\n/g, '\n').replace(/\n[ \t]/g, ''); }
  function desesc(v) { return String(v || '').replace(/\\n/gi, ' ').replace(/\\([,;\\])/g, '$1').trim(); }
  // 20261121T083000Z | 20261121T083000 (local/TZID) | 20261121 (dia inteiro)
  function data(v, params) {
    var m = String(v || '').match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/); if (!m) return null;
    if (!m[4]) return { d: new Date(+m[1], +m[2] - 1, +m[3]), diaInteiro: true };
    var a = [+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0)];
    if (m[7]) return { d: new Date(Date.UTC.apply(null, a)), diaInteiro: false };
    var tz = params && params.TZID;
    if (tz && raiz.Intl) { try { return { d: deFuso(a, tz), diaInteiro: false }; } catch (e) { } }
    return { d: new Date(a[0], a[1], a[2], a[3], a[4], a[5]), diaInteiro: false };
  }
  // Converte hora de parede num fuso IANA para Date (ajuste por diferença, 2 passadas).
  function deFuso(a, tz) {
    var chute = Date.UTC.apply(null, a), f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    for (var i = 0; i < 2; i++) {
      var p = {}; f.formatToParts(new Date(chute)).forEach(function (x) { p[x.type] = +x.value; });
      var visto = Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second); chute += Date.UTC.apply(null, a) - visto;
    }
    return new Date(chute);
  }
  function lerICS(texto) {
    var linhas = desdobrar(texto).split('\n'), evs = [], cur = null;
    linhas.forEach(function (l) {
      if (/^BEGIN:VEVENT/i.test(l)) { cur = { exdates: [] }; return; }
      if (/^END:VEVENT/i.test(l)) { if (cur && cur.inicio) { if (!cur.fim) cur.fim = new Date(cur.inicio.getTime() + (cur.diaInteiro ? 864e5 : (cur.dur || 36e5))); evs.push(cur); } cur = null; return; }
      if (!cur) return; var i = l.indexOf(':'); if (i < 0) return;
      var cab = l.slice(0, i), val = l.slice(i + 1), partes = cab.split(';'), nome = partes[0].toUpperCase(), params = {};
      partes.slice(1).forEach(function (p) { var j = p.indexOf('='); if (j > 0) params[p.slice(0, j).toUpperCase()] = p.slice(j + 1).replace(/"/g, ''); });
      if (nome === 'DTSTART') { var d = data(val, params); if (d) { cur.inicio = d.d; cur.diaInteiro = d.diaInteiro || params.VALUE === 'DATE'; } }
      else if (nome === 'DTEND') { var e = data(val, params); if (e) cur.fim = e.d; }
      else if (nome === 'DURATION') { var m = val.match(/P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/); if (m) cur.dur = ((+m[1] || 0) * 1440 + (+m[2] || 0) * 60 + (+m[3] || 0)) * 6e4; }
      else if (nome === 'SUMMARY') cur.titulo = desesc(val);
      else if (nome === 'LOCATION') cur.local = desesc(val);
      else if (nome === 'DESCRIPTION') cur.descricao = desesc(val).slice(0, 300);
      else if (nome === 'RRULE') { var r = {}; val.split(';').forEach(function (p) { var k = p.split('='); r[k[0].toUpperCase()] = k[1]; }); cur.rrule = r; }
      else if (nome === 'EXDATE') val.split(',').forEach(function (v) { var x = data(v, params); if (x) cur.exdates.push(x.d.getTime()); });
      else if (nome === 'TRANSP') cur.livre = /TRANSPARENT/i.test(val);
      else if (nome === 'STATUS') cur.cancelado = /CANCELLED/i.test(val);
      else if (nome === 'UID') cur.uid = val;
    });
    return evs.filter(function (e) { return !e.cancelado; });
  }
  var DIAS = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
  function expandir(evs, de, ate) {
    var out = [], ini = de.getTime(), fim = ate.getTime();
    evs.forEach(function (e) {
      var dur = e.fim - e.inicio, r = e.rrule;
      var poe = function (t) { if (e.exdates.indexOf(t) >= 0) return; if (t < fim && t + dur > ini) out.push({ inicio: new Date(t), fim: new Date(t + dur), titulo: e.titulo || '', local: e.local || '', diaInteiro: e.diaInteiro, livre: !!e.livre }); };
      if (!r) { poe(e.inicio.getTime()); return; }
      var freq = (r.FREQ || '').toUpperCase(), intv = +(r.INTERVAL || 1), ateR = r.UNTIL ? (data(r.UNTIL) || {}).d : null, cont = r.COUNT ? +r.COUNT : Infinity, n = 0;
      var limite = Math.min(fim, ateR ? ateR.getTime() + 1 : Infinity), byday = r.BYDAY ? r.BYDAY.split(',').map(function (x) { return DIAS[x.slice(-2)]; }) : null;
      var base = new Date(e.inicio), h = base.getHours(), mi = base.getMinutes();
      for (var k = 0; k < 800 && n < cont; k++) {
        var dia;
        if (freq === 'DAILY') dia = new Date(base.getFullYear(), base.getMonth(), base.getDate() + k * intv, h, mi);
        else if (freq === 'WEEKLY') {
          var sem = new Date(base.getFullYear(), base.getMonth(), base.getDate() - base.getDay() + k * 7 * intv, h, mi), dias = byday || [base.getDay()], parou = false;
          for (var j = 0; j < 7 && n < cont; j++) { if (dias.indexOf(j) < 0) continue; var dd = new Date(sem.getFullYear(), sem.getMonth(), sem.getDate() + j, h, mi); if (dd < base) continue; if (dd.getTime() >= limite) { parou = true; break; } n++; poe(dd.getTime()); }
          if (parou || sem.getTime() >= limite) break; continue;
        }
        else if (freq === 'MONTHLY') dia = new Date(base.getFullYear(), base.getMonth() + k * intv, base.getDate(), h, mi);
        else if (freq === 'YEARLY') dia = new Date(base.getFullYear() + k * intv, base.getMonth(), base.getDate(), h, mi);
        else { poe(e.inicio.getTime()); break; }
        if (dia.getTime() >= limite) break; n++; poe(dia.getTime());
      }
    });
    return out.sort(function (a, b) { return a.inicio - b.inicio; });
  }
  var REGRAS = [['transito', /tr[aâ]nsito|deslocamento|ida |volta |uber|[oô]nibus|metr[oô]|carona|commute|viagem/i], ['saude', /m[eé]dic|consulta|dentista|exame|terapia|psic|fisio|hospital|cl[ií]nica|academia|treino|nata[cç]/i],
    ['trabalho', /trabalho|expediente|reuni[aã]o|plant[aã]o|turno|escrit[oó]rio|meeting|call|cliente|job/i], ['aula', /aula|curso|faculdade|escola|p[oó]s|mentoria/i],
    ['estudo', /estud|revis|quest[oõ]es|simulado|dora/i], ['descanso', /almo[cç]o|jantar|caf[eé]|descanso|sono|dormir|fam[ií]lia|igreja|lazer/i]];
  function classificar(e) { var t = (e.titulo || '') + ' ' + (e.local || ''); for (var i = 0; i < REGRAS.length; i++) if (REGRAS[i][1].test(t)) return REGRAS[i][0]; return 'compromisso'; }
  // janela: {de:'06:00', ate:'23:00', folga:10, minimo:20}
  function hm(s, dia) { var p = String(s).split(':'); return new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), +p[0], +(p[1] || 0)); }
  function livres(ocs, dia, janela) {
    janela = janela || {}; var a = hm(janela.de || '06:00', dia), b = hm(janela.ate || '23:00', dia), folga = (janela.folga == null ? 10 : janela.folga) * 6e4, min = (janela.minimo || 20) * 6e4;
    var ocup = ocs.filter(function (o) { return !o.livre && !o.diaInteiro && o.fim > a && o.inicio < b && classificar(o) !== 'estudo'; })
      .map(function (o) { return [Math.max(a, o.inicio - folga), Math.min(b, +o.fim + folga)]; }).sort(function (x, y) { return x[0] - y[0]; });
    var out = [], t = +a;
    ocup.forEach(function (o) { if (o[0] - t >= min) out.push({ inicio: new Date(t), fim: new Date(o[0]), min: Math.round((o[0] - t) / 6e4) }); t = Math.max(t, o[1]); });
    if (b - t >= min) out.push({ inicio: new Date(t), fim: new Date(+b), min: Math.round((b - t) / 6e4) });
    return out;
  }
  // tarefas: [{titulo, min, tipo:'teoria'|'questoes'|'revisao', prioridade}] -> blocos nos buracos (Pomodoro 25/5 ou 50/10)
  function encaixar(buracos, tarefas, op) {
    op = op || {}; var bloco = op.bloco || 50, pausa = op.pausa || 10, fila = tarefas.slice().sort(function (a, b) { return (b.prioridade || 0) - (a.prioridade || 0); }).map(function (t) { return Object.assign({ resta: t.min }, t); });
    var out = [];
    buracos.forEach(function (bu) {
      var t = +bu.inicio, fim = +bu.fim;
      while (fila.length && fim - t >= 20 * 6e4) {
        var tf = fila[0], dur = Math.min(tf.resta, bloco, Math.round((fim - t) / 6e4)); if (dur < 15) break;
        out.push({ inicio: new Date(t), fim: new Date(t + dur * 6e4), titulo: tf.titulo, tipo: tf.tipo || 'teoria', ref: tf.ref || '' });
        tf.resta -= dur; if (tf.resta < 15) fila.shift(); t += (dur + pausa) * 6e4;
      }
    });
    return { blocos: out, sobrou: fila.map(function (t) { return { titulo: t.titulo, min: t.resta }; }) };
  }
  function fmt(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function esc(s) { return String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n'); }
  function gerarICS(blocos, nome) {
    var agora = fmt(new Date()), l = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Dora Guilda//Dora Rotina//PT-BR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:' + esc(nome || 'Estudos · Dora Guilda')];
    blocos.forEach(function (b, i) {
      var desc = b.descricao || ((b.tipo ? 'Tipo: ' + b.tipo + '. ' : '') + (b.ref ? 'Abrir: ' + b.ref : 'Plano da Dora Guilda'));
      l.push('BEGIN:VEVENT', 'UID:' + (b.uid || ('dora-' + (+b.inicio) + '-' + i)) + '@dora-guilda', 'DTSTAMP:' + agora, 'DTSTART:' + fmt(b.inicio), 'DTEND:' + fmt(b.fim), 'SUMMARY:' + esc((b.semFlor ? '' : '🌻 ') + b.titulo), 'DESCRIPTION:' + esc(desc));
      (b.alarmes || ['-PT5M']).forEach(function (al) { l.push('BEGIN:VALARM', 'TRIGGER:' + al, 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(b.aviso || 'Hora de estudar'), 'END:VALARM'); });
      if (b.local) l.push('LOCATION:' + esc(b.local)); if (b.url) l.push('URL:' + b.url);
      l.push('END:VEVENT');
    });
    l.push('END:VCALENDAR');
    return l.map(function (x) { var o = [], s = x; while (s.length > 74) { o.push(s.slice(0, 74)); s = ' ' + s.slice(74); } o.push(s); return o.join('\r\n'); }).join('\r\n') + '\r\n';
  }
  raiz.DoraRotina = { lerICS: lerICS, expandir: expandir, classificar: classificar, livres: livres, encaixar: encaixar, gerarICS: gerarICS };
})(typeof window !== 'undefined' ? window : globalThis);
