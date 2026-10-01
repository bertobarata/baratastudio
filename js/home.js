/**
 * home.js - interactive terminal in the hero.
 * Progressive enhancement: the HTML already shows a static session.
 * All output is built with textContent / createElement. Nothing typed by the
 * visitor is ever inserted as HTML.
 */
(function () {
  'use strict';

  var out = document.getElementById('term-out');
  var form = document.getElementById('term-form');
  var input = document.getElementById('term-input');
  var chips = document.getElementById('term-chips');
  if (!out || !form || !input) return;

  form.hidden = false;
  if (chips) chips.hidden = false;

  var LINKS = {
    email: 'mailto:berto.barata77@gmail.com',
    whatsapp: 'https://wa.me/351939443377?text=' + encodeURIComponent('Olá Berto, vi o teu site e tenho interesse em desenvolver um projeto.'),
    instagram: 'https://instagram.com/berto_barata',
    form: 'formulario.html',
    pessoal: 'https://bertobarata.com'
  };

  var PROJECTS = [
    ['valejas-ac', 'https://valejasac.pt'],
    ['greenbond', 'https://greenbond.pt'],
    ['ludy-artes', 'https://ludyartes.pt'],
    ['cao-na-rua', '#projects'],
    ['gentle-laughter', '#projects'],
    ['barbearia-supra', 'https://bertobarata.github.io/barbearia-supra/'],
    ['queen-bee-hair', 'https://bertobarata.github.io/queen-bee-hair/']
  ];

  /* A line is an array of parts: plain strings or [text, href]. */
  var COMMANDS = {
    ajuda: function () {
      return [
        ['comandos disponíveis:'],
        ['  servicos   o que faço'],
        ['  projetos   trabalho publicado'],
        ['  processo   do briefing ao launch'],
        ['  contacto   falar comigo'],
        ['  sobre      quem está por trás'],
        ['  abrir N    abrir o projeto N da lista'],
        ['  clear      limpar o ecrã']
      ];
    },
    servicos: function () {
      return [
        ['Websites Institucionais'],
        ['Landing Pages'],
        ['Redesign de Sites'],
        ['Identidade Digital Base'],
        ['Manutenção & Evolução'],
        [['ver detalhe →', '#services']]
      ];
    },
    projetos: function () {
      return PROJECTS.map(function (p, i) { return [(i + 1) + '  ', [p[0], p[1]]]; }).concat([['escreve «abrir 1» para ver o primeiro']]);
    },
    processo: function () {
      return [
        ['briefing → design → build → launch'],
        [['ver os passos →', '#process-layers']]
      ];
    },
    contacto: function () {
      return [
        ['email      ', [ 'berto.barata77@gmail.com', LINKS.email ]],
        ['whatsapp   ', [ 'abrir conversa', LINKS.whatsapp ]],
        ['instagram  ', [ '@berto_barata', LINKS.instagram ]],
        ['formulário ', [ 'pedir proposta', LINKS.form ]],
        ['resposta em menos de 24h']
      ];
    },
    sobre: function () {
      return [
        ['Barata Studio é o estúdio de Berto Barata.'],
        ['Websites à medida, sem templates.'],
        ['pessoal   ', [ 'bertobarata.com', LINKS.pessoal ]]
      ];
    }
  };
  COMMANDS.help = COMMANDS.ajuda;
  COMMANDS.ls = COMMANDS.projetos;
  COMMANDS.contactos = COMMANDS.contacto;
  COMMANDS['serviços'] = COMMANDS.servicos;
  COMMANDS['serviço'] = COMMANDS.servicos;

  var history = [];
  var hIndex = 0;

  function line(parts, cls) {
    var p = document.createElement('p');
    p.className = 'term-line' + (cls ? ' ' + cls : '');
    parts.forEach(function (part) {
      if (typeof part === 'string') {
        p.appendChild(document.createTextNode(part));
      } else {
        var a = document.createElement('a');
        a.textContent = part[0];
        a.href = part[1];
        if (/^https?:/.test(part[1])) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        p.appendChild(a);
      }
    });
    return p;
  }

  function gap() {
    var d = document.createElement('div');
    d.className = 'term-gap';
    return d;
  }

  function run(raw) {
    var cmd = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!cmd) return;

    if (cmd === 'clear' || cmd === 'limpar') {
      out.textContent = '';
      return;
    }

    out.appendChild(gap());
    out.appendChild(line([raw.trim()], 'term-cmd'));

    var open = cmd.match(/^abrir\s+(\S+)$/);
    var fn = Object.prototype.hasOwnProperty.call(COMMANDS, cmd) ? COMMANDS[cmd] : null;
    if (fn) {
      fn().forEach(function (parts) { out.appendChild(line(parts)); });
    } else if (open) {
      var key = open[1];
      var hit = PROJECTS.filter(function (p, i) { return String(i + 1) === key || p[0] === key; })[0];
      if (hit) {
        out.appendChild(line(['a abrir ', [hit[0], hit[1]]], 'term-dim'));
        if (/^https?:/.test(hit[1])) window.open(hit[1], '_blank', 'noopener');
        else location.hash = hit[1];
      } else {
        out.appendChild(line(['projeto não encontrado. Escreve «projetos» para ver a lista.'], 'term-dim'));
      }
    } else {
      out.appendChild(line(['comando não encontrado. Escreve «ajuda».'], 'term-dim'));
    }
    out.scrollTop = out.scrollHeight;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value;
    if (v.trim()) { history.push(v); hIndex = history.length; }
    run(v);
    input.value = '';
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex] || '';
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault();
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] || '';
    }
  });

  if (chips) {
    chips.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cmd]');
      if (!btn) return;
      run(btn.getAttribute('data-cmd'));
    });
  }
})();
