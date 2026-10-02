/**
 * home.js - the hero terminal, a tiny shell over the site.
 *
 *   ls [-l] [dir]   list sections (or the projects inside projetos/)
 *   cd <dir>        open a section, a page or a project
 *   pwd, whoami, ajuda/help, clear (Ctrl+L)
 *
 * Mouse and touch work too: every folder in the output is clickable and the
 * shortcut chips run real commands. Tab completes, arrow keys walk the history.
 *
 * Progressive enhancement: the HTML already shows an `ls -l` with real links.
 * All output is built with createElement/textContent. Nothing typed by the
 * visitor is ever inserted as HTML.
 */
(function () {
  'use strict';

  var term = document.getElementById('terminal');
  var out = document.getElementById('term-out');
  var form = document.getElementById('term-form');
  var input = document.getElementById('term-input');
  var pathEl = document.getElementById('term-path');
  var titleEl = document.getElementById('term-title');
  if (!term || !out || !form || !input) return;


  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ICON = { dir: ' ', open: ' ', link: '', home: ' ' };

  /* ---------- the file system ---------- */
  var FS = {
    children: {
      projetos: {
        target: '#projects', desc: 'trabalho publicado',
        children: {
          'valejas-ac': { url: 'https://valejasac.pt', desc: 'clube de futsal, loja e área da Direção' },
          'greenbond': { url: 'https://greenbond.pt', desc: 'plataforma para o sector público' },
          'ludy-artes': { url: 'https://ludyartes.pt', desc: 'loja de agendas personalizadas' },
          'cao-na-rua': { url: 'https://caonarua.pt', desc: 'creche canina em Sintra' },
          'gentle-laughter': { url: 'https://gentlelaughter.com', desc: 'produção de eventos' },
          'barbearia-supra': { url: 'https://bertobarata.github.io/barbearia-supra/', desc: 'barbearia em Lisboa' },
          'queen-bee-hair': { url: 'https://bertobarata.github.io/queen-bee-hair/', desc: 'extensões de cabelo' }
        }
      },
      apps: {
        target: '#apps', desc: 'projetos em desenvolvimento',
        children: {
          'meet-tracker': { url: 'https://apps.apple.com/pt/app/meet-tracker/id6813061781', desc: 'app iOS, na App Store' },
          'tvde': { url: 'https://apptvde.store', desc: 'app para o exame TVDE, em desenvolvimento' },
          'fine-rag': { desc: 'protótipo privado: perguntas sobre fichas FINE, a correr localmente' },
          'bertobarata.com': { url: 'https://bertobarata.com', desc: 'portfólio pessoal' }
        }
      },
      servicos: { target: '#services', desc: 'o que faço' },
      processo: { target: '#process-layers', desc: 'do briefing ao launch' },
      sobre: { target: '#manifesto', desc: 'quem está por trás' },
      faq: { target: 'faq.html', desc: 'perguntas frequentes' },
      contacto: { target: 'formulario.html', desc: 'pedir proposta' }
    }
  };

  // Words people will try instead of the folder names.
  var ALIASES = {
    portfolio: 'projetos', aplicacoes: 'apps', app: 'apps', 'em-desenvolvimento': 'apps', lab: 'apps', labs: 'apps', trabalho: 'projetos', trabalhos: 'projetos', projects: 'projetos', work: 'projetos', projeto: 'projetos',
    servico: 'servicos', services: 'servicos',
    process: 'processo',
    info: 'sobre', 'sobre-mim': 'sobre', sobremim: 'sobre', about: 'sobre', 'about-me': 'sobre', eu: 'sobre',
    perguntas: 'faq', ajuda: 'faq',
    contactos: 'contacto', contact: 'contacto', contato: 'contacto', proposta: 'contacto', orcamento: 'contacto'
  };

  var cwd = []; // path segments from ~

  function norm(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function nodeAt(path) {
    var n = FS;
    for (var i = 0; i < path.length; i++) {
      if (!n.children || !n.children[path[i]]) return null;
      n = n.children[path[i]];
    }
    return n;
  }

  function childName(node, word) {
    if (!node || !node.children) return null;
    var w = norm(word);
    if (node.children[w]) return w;
    if (node === FS && ALIASES[w]) return ALIASES[w];
    return null;
  }

  // Resolve "projetos/valejas-ac", "../faq", "~/sobre" to a path array, or null.
  function resolve(arg) {
    var a = (arg || '').trim();
    var path = cwd.slice();
    if (a === '' || a === '~' || a === '/') return [];
    if (a.charAt(0) === '~' || a.charAt(0) === '/') { path = []; a = a.replace(/^~\/?|^\//, ''); }
    var parts = a.split('/').filter(Boolean);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p === '.') continue;
      if (p === '..') { path.pop(); continue; }
      var name = childName(nodeAt(path), p);
      if (!name) return null;
      path.push(name);
    }
    return path;
  }

  function pretty(path) { return '~' + (path.length ? '/' + path.join('/') : ''); }

  function setCwd(path) {
    cwd = path;
    if (pathEl) pathEl.textContent = pretty(cwd);
    if (titleEl) titleEl.textContent = 'berto@barata-studio: ' + pretty(cwd);
  }

  /* ---------- output ---------- */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function print(parts, cls) {
    var p = el('p', 'term-line' + (cls ? ' ' + cls : ''));
    (Array.isArray(parts) ? parts : [parts]).forEach(function (part) {
      p.appendChild(typeof part === 'string' ? document.createTextNode(part) : part);
    });
    out.appendChild(p);
    return p;
  }

  function promptEcho(cmd) {
    out.appendChild(el('div', 'term-gap'));
    var p = el('p', 'term-line term-cmd');
    p.appendChild(el('span', 'tp-user', 'berto@barata-studio:'));
    p.appendChild(el('span', 'tp-path', pretty(cwd)));
    p.appendChild(document.createTextNode('$ ' + cmd));
    out.appendChild(p);
  }

  // A folder you can click: runs `cd <path>`.
  function dirButton(label, cdArg, external) {
    var b = el('button', 'term-dir' + (external ? ' term-dir--ext' : ''));
    b.type = 'button';
    b.setAttribute('data-cmd', 'cd ' + cdArg);
    b.appendChild(el('span', 'term-icon', external ? '' : ICON.dir));
    b.appendChild(document.createTextNode(label));
    if (external) b.appendChild(el('span', 'term-icon term-icon--after', ' ' + ICON.link));
    b.setAttribute('aria-label', (external ? 'Abrir ' : 'Ir para ') + label.replace(/\/$/, ''));
    return b;
  }

  function scrollDown() { out.scrollTop = out.scrollHeight; }

  /* ---------- navigation ---------- */
  function go(target) {
    if (target.charAt(0) === '#') {
      var dest = document.querySelector(target);
      if (!dest) return;
      dest.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
      var heading = dest.querySelector('h2, h1') || dest;
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
      return;
    }
    setTimeout(function () { window.location.href = target; }, REDUCED ? 0 : 420);
  }

  /* ---------- commands ---------- */
  var COMMANDS = {
    ajuda: function () {
      [
        ['ls', 'lista as secções'],
        ['ls -l', 'lista com descrição'],
        ['cd projetos', 'abre uma secção (ou clica numa pasta)'],
        ['cd ..', 'volta atrás'],
        ['pwd', 'onde estás'],
        ['whoami', 'quem fez isto'],
        ['clear', 'limpa o ecrã (Ctrl+L)']
      ].forEach(function (row) {
        print([el('span', 'term-key', (row[0] + '            ').slice(0, 13)), row[1]]);
      });
      print('Tab completa nomes. As setas repetem comandos anteriores.', 'term-dim');
    },
    ls: function (args) {
      var long = args.some(function (a) { return /^-\w*l/.test(a); });
      var target = args.filter(function (a) { return a.charAt(0) !== '-'; })[0];
      var path = target ? resolve(target) : cwd;
      if (!path) return print('ls: ' + target + ': pasta não encontrada', 'term-err');
      var node = nodeAt(path);
      if (node.url) return print([dirButton(path[path.length - 1], pretty(path), true)]);
      if (!node.children) {
        print(node.desc, 'term-dim');
        return print('Esta secção não tem subpastas. Usa «cd ..» para voltar.', 'term-dim');
      }
      var names = Object.keys(node.children);
      if (long) {
        names.forEach(function (n) {
          var child = node.children[n];
          var cdArg = pretty(path.concat(n));
          var label = child.children || child.target ? n + '/' : n;
          var row = print([dirButton(label, cdArg, !!child.url)]);
          row.classList.add('term-row');
          row.appendChild(el('span', 'term-desc', child.desc));
        });
      } else {
        var row = print([], 'term-grid');
        names.forEach(function (n) {
          var child = node.children[n];
          row.appendChild(dirButton(child.children || child.target ? n + '/' : n, pretty(path.concat(n)), !!child.url));
        });
      }
    },
    cd: function (args) {
      var arg = args[0];
      var path = resolve(arg);
      if (!path) {
        return print('cd: ' + arg + ': pasta não encontrada. Escreve «ls» para ver o que existe.', 'term-err');
      }
      if (path.length === 0) {
        setCwd([]);
        print([ICON.home + 'de volta ao início'], 'term-ok');
        go('#home');
        return;
      }
      var node = nodeAt(path);
      if (!node.url && !node.target && !node.children) {
        print(path[path.length - 1] + ': ' + node.desc, 'term-dim');
        print('Ainda sem página pública.', 'term-dim');
        return;
      }
      if (node.url) {
        print(['a abrir ' + path[path.length - 1] + ' num novo separador ', el('span', 'term-icon', ICON.link)], 'term-ok');
        window.open(node.url, '_blank', 'noopener');
        return;
      }
      setCwd(path);
      if (node.target.charAt(0) === '#') {
        print([ICON.open + pretty(path)], 'term-ok');
        if (node.children) print('Escreve «ls» para ver o que há aqui dentro.', 'term-dim');
      } else {
        print([ICON.open + 'a abrir ' + node.target + '…'], 'term-ok');
      }
      go(node.target);
    },
    pwd: function () { print('/home/berto' + (cwd.length ? '/' + cwd.join('/') : '')); },
    whoami: function () {
      var a = el('a', null, 'bertobarata.com');
      a.href = 'https://bertobarata.com'; a.target = '_blank'; a.rel = 'noopener noreferrer';
      print('Berto Barata · Barata Studio, websites feitos à mão');
      print(['pessoal: ', a]);
    },
    clear: function () { out.textContent = ''; }
  };
  COMMANDS.help = COMMANDS.ajuda;
  COMMANDS.dir = COMMANDS.ls;
  COMMANDS.ll = function (args) { COMMANDS.ls(['-l'].concat(args)); };

  var history = [];
  var hIndex = 0;

  function run(raw) {
    var line = raw.trim().replace(/\s+/g, ' ');
    if (!line) return;
    var words = line.split(' ');
    var cmd = norm(words[0]);
    var args = words.slice(1);

    input.placeholder = ''; // the suggestion has done its job
    if (cmd === 'clear' || cmd === 'cls') { COMMANDS.clear(); return; }
    promptEcho(line);

    if (Object.prototype.hasOwnProperty.call(COMMANDS, cmd)) {
      COMMANDS[cmd](args);
    } else if (cmd === 'cd..') {
      COMMANDS.cd(['..']);
    } else if (resolve(words[0])) {
      // Typed a folder name without `cd`: be kind and open it.
      print('dica: da próxima vez escreve «cd ' + words[0] + '»', 'term-dim');
      COMMANDS.cd([words[0]]);
    } else {
      print(words[0] + ': comando não encontrado. Escreve «ls» ou «ajuda».', 'term-err');
    }
    scrollDown();
  }

  /* ---------- tab completion ---------- */
  function complete() {
    var v = input.value;
    var words = v.split(' ');
    if (words.length === 1) {
      var cmds = Object.keys(COMMANDS).filter(function (c) { return c.indexOf(norm(words[0])) === 0; });
      if (cmds.length === 1) { input.value = cmds[0] + ' '; return true; }
      if (cmds.length > 1) { promptEcho(v); print(cmds.join('   '), 'term-dim'); scrollDown(); return true; }
      return false;
    }
    var partial = words[words.length - 1];
    var slash = partial.lastIndexOf('/');
    var base = slash >= 0 ? partial.slice(0, slash + 1) : '';
    var stem = partial.slice(slash + 1);
    var dirPath = base ? resolve(base) : cwd;
    var node = dirPath && nodeAt(dirPath);
    if (!node || !node.children) return false;
    var hits = Object.keys(node.children).filter(function (n) { return n.indexOf(norm(stem)) === 0; });
    if (hits.length === 1) {
      var child = node.children[hits[0]];
      words[words.length - 1] = base + hits[0] + (child.children ? '/' : '');
      input.value = words.join(' ');
      return true;
    }
    if (hits.length > 1) {
      promptEcho(v);
      print(hits.map(function (h) { return h + (node.children[h].children ? '/' : ''); }).join('   '), 'term-dim');
      scrollDown();
      return true;
    }
    return false;
  }

  /* ---------- events ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    stopDemo(false);
    var v = input.value;
    if (v.trim()) { history.push(v.trim()); hIndex = history.length; }
    input.value = '';
    run(v);
  });

  input.addEventListener('keydown', function (e) {
    stopDemo(true);
    if (e.key === 'Tab' && !e.shiftKey && input.value.trim()) {
      // Only take Tab when there is something to complete; otherwise it moves focus as usual.
      if (complete()) e.preventDefault();
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex] || '';
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault();
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] || '';
    } else if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      COMMANDS.clear();
    } else if (e.ctrlKey && (e.key === 'c' || e.key === 'C') && !window.getSelection().toString()) {
      e.preventDefault();
      promptEcho(input.value + '^C');
      input.value = '';
      scrollDown();
    }
  });

  // Folders in the output and the shortcut chips run real commands.
  term.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cmd]');
    if (btn) {
      e.preventDefault(); // chips are links so they still work without JavaScript
      stopDemo(true);
      var cmd = btn.getAttribute('data-cmd');
      history.push(cmd); hIndex = history.length;
      run(cmd);
      return;
    }
    // Clicking empty terminal space focuses the prompt, like a real terminal.
    if (!e.target.closest('a, button, input') && !window.getSelection().toString()) {
      input.focus({ preventScroll: true });
    }
  });

  /* ---------- first impression ----------
   The `ls -l` is already in the HTML (so the terminal paints at once and never
   shifts). The demo only ghost-types a suggestion in the prompt, without running it. */
  var demoTimer = null;
  var demoDone = false;
  var SUGGESTION = 'cd projetos';
  var PLACEHOLDER = 'experimenta: cd projetos';
  // Stop the ghost typing as soon as the visitor does anything.
  // clearText: wipe the half-typed suggestion (on a key press or a click), never on submit.
  function stopDemo(clearText) {
    if (demoDone) return;
    if (demoTimer) { clearTimeout(demoTimer); demoTimer = null; }
    if (clearText && !input.dataset.user) input.value = '';
    input.placeholder = PLACEHOLDER;
    demoDone = true;
  }
  function demo() {
    if (demoDone) return;
    if (REDUCED) { stopDemo(true); return; }
    var i = 0;
    var back = false;
    (function step() {
      if (demoDone) return;
      if (!back) {
        input.value = SUGGESTION.slice(0, ++i);
        if (i === SUGGESTION.length) { back = true; demoTimer = setTimeout(step, 1400); return; }
        demoTimer = setTimeout(step, i === 1 ? 700 : 95);
      } else {
        input.value = SUGGESTION.slice(0, --i);
        if (i === 0) { stopDemo(true); return; }
        demoTimer = setTimeout(step, 35);
      }
    })();
  }
  input.addEventListener('input', function () { input.dataset.user = '1'; });

  if ('IntersectionObserver' in window) {
    var seen = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { seen.disconnect(); demo(); }
    }, { threshold: 0.4 });
    seen.observe(term);
  } else {
    demo();
  }
})();
