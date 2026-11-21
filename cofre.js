/* Dora Cofre de exportação (window.DoraCofre): monta um .zip (sem compressão, formato ZIP padrão) no navegador.
   Usado para exportar todos os dados do aluno como um cofre de notas em Markdown (abre no Obsidian, Logseq,
   VS Code…) com [[links]] entre tópicos, erros, fichas, mapas e grifos, mais o backup completo em JSON. */
(function (raiz) {
  'use strict';
  var TAB = (function () { var t = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(b) { var c = 0xFFFFFFFF; for (var i = 0; i < b.length; i++) c = TAB[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function nomeSeguro(s) { return String(s || 'sem nome').replace(/[\\/:*?"<>|#^\[\]]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90) || 'sem nome'; }
  // arquivos: [{caminho, texto}] -> Blob application/zip
  function zip(arquivos) {
    var enc = new TextEncoder(), partes = [], central = [], off = 0, agora = new Date(), dt = ((agora.getHours() << 11) | (agora.getMinutes() << 5) | (agora.getSeconds() >> 1)) & 0xFFFF, dd = (((agora.getFullYear() - 1980) << 9) | ((agora.getMonth() + 1) << 5) | agora.getDate()) & 0xFFFF;
    arquivos.forEach(function (a) {
      var nome = enc.encode(a.caminho), dados = typeof a.texto === 'string' ? enc.encode(a.texto) : a.texto, crc = crc32(dados), h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true); h.setUint16(10, dt, true); h.setUint16(12, dd, true); h.setUint32(14, crc, true); h.setUint32(18, dados.length, true); h.setUint32(22, dados.length, true); h.setUint16(26, nome.length, true); h.setUint16(28, 0, true);
      partes.push(new Uint8Array(h.buffer), nome, dados);
      var c = new DataView(new ArrayBuffer(46)); c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true); c.setUint16(12, dt, true); c.setUint16(14, dd, true); c.setUint32(16, crc, true); c.setUint32(20, dados.length, true); c.setUint32(24, dados.length, true); c.setUint16(28, nome.length, true); c.setUint32(42, off, true);
      central.push(new Uint8Array(c.buffer), nome); off += 30 + nome.length + dados.length;
    });
    var tamC = central.reduce(function (s, x) { return s + x.length; }, 0), fim = new DataView(new ArrayBuffer(22));
    fim.setUint32(0, 0x06054b50, true); fim.setUint16(8, arquivos.length, true); fim.setUint16(10, arquivos.length, true); fim.setUint32(12, tamC, true); fim.setUint32(16, off, true);
    return new Blob(partes.concat(central, [new Uint8Array(fim.buffer)]), { type: 'application/zip' });
  }
  raiz.DoraCofre = { zip: zip, crc32: crc32, nome: nomeSeguro };
})(typeof window !== 'undefined' ? window : globalThis);
