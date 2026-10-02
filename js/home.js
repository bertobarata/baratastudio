/**
 * home.js - the hero terminal, a tiny shell over the site.
 *
 *   ls [-l] [dir]   list sections (or the items inside projetos/ and apps/)
 *   cd <dir>        open a section, a page or a project
 *   pwd, whoami, ajuda/help, clear (Ctrl+L)
 *
 * Mouse and touch work too: every folder in the output is clickable and the
 * shortcut chips run real commands. Tab completes, arrow keys walk the history.
 *
 * Localised: folder names and messages follow <html lang>; folder names from
 * any language are accepted (cd projetos works on the English page).
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

  var LANG = (document.documentElement.lang || 'pt').slice(0, 2).toLowerCase();
  if (['pt', 'en', 'fr', 'es'].indexOf(LANG) < 0) LANG = 'pt';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ICON = { dir: ' ', open: ' ', link: '', home: ' ' };

  /* ---------- messages ---------- */
  var M = {
    pt: {
      help: [['ls', 'lista as secções'], ['ls -l', 'lista com descrição'], ['cd projetos', 'abre uma secção (ou clica numa pasta)'], ['cd ..', 'volta atrás'], ['pwd', 'onde estás'], ['whoami', 'quem fez isto'], ['clear', 'limpa o ecrã (Ctrl+L)']],
      helpTip: 'Tab completa nomes. As setas repetem comandos anteriores.',
      notFound: ': pasta não encontrada', cdNotFound: ': pasta não encontrada. Escreve «ls» para ver o que existe.',
      noSub: 'Esta secção não tem subpastas. Usa «cd ..» para voltar.', home: 'de volta ao início',
      openingTab: 'a abrir {x} num novo separador ', opening: 'a abrir {x}…', inside: 'Escreve «ls» para ver o que há aqui dentro.',
      noPage: 'Ainda sem página pública.', tip: 'dica: da próxima vez escreve «cd {x}»',
      unknown: ': comando não encontrado. Escreve «ls» ou «ajuda».',
      who: 'Berto Barata · Barata Studio, websites feitos à mão', personal: 'pessoal: ',
      goTo: 'Ir para ', open: 'Abrir ', suggest: 'cd projetos', placeholder: 'experimenta: cd projetos'
    },
    en: {
      help: [['ls', 'lists the sections'], ['ls -l', 'lists with descriptions'], ['cd projects', 'opens a section (or click a folder)'], ['cd ..', 'goes back'], ['pwd', 'where you are'], ['whoami', 'who made this'], ['clear', 'clears the screen (Ctrl+L)']],
      helpTip: 'Tab completes names. The arrow keys repeat earlier commands.',
      notFound: ': folder not found', cdNotFound: ': folder not found. Type "ls" to see what exists.',
      noSub: 'This section has no subfolders. Use "cd .." to go back.', home: 'back to the start',
      openingTab: 'opening {x} in a new tab ', opening: 'opening {x}…', inside: 'Type "ls" to see what is inside.',
      noPage: 'No public page yet.', tip: 'tip: next time type "cd {x}"',
      unknown: ': command not found. Type "ls" or "help".',
      who: 'Berto Barata · Barata Studio, websites made by hand', personal: 'personal: ',
      goTo: 'Go to ', open: 'Open ', suggest: 'cd projects', placeholder: 'try: cd projects'
    },
    fr: {
      help: [['ls', 'liste les sections'], ['ls -l', 'liste avec descriptions'], ['cd projets', 'ouvre une section (ou cliquez sur un dossier)'], ['cd ..', 'revient en arrière'], ['pwd', 'où vous êtes'], ['whoami', 'qui a fait ça'], ['clear', 'efface l’écran (Ctrl+L)']],
      helpTip: 'Tab complète les noms. Les flèches rappellent les commandes précédentes.',
      notFound: ' : dossier introuvable', cdNotFound: ' : dossier introuvable. Tapez « ls » pour voir ce qui existe.',
      noSub: 'Cette section n’a pas de sous-dossier. Utilisez « cd .. » pour revenir.', home: 'retour au début',
      openingTab: 'ouverture de {x} dans un nouvel onglet ', opening: 'ouverture de {x}…', inside: 'Tapez « ls » pour voir le contenu.',
      noPage: 'Pas encore de page publique.', tip: 'astuce : la prochaine fois, tapez « cd {x} »',
      unknown: ' : commande introuvable. Tapez « ls » ou « aide ».',
      who: 'Berto Barata · Barata Studio, des sites faits main', personal: 'perso : ',
      goTo: 'Aller à ', open: 'Ouvrir ', suggest: 'cd projets', placeholder: 'essayez : cd projets'
    },
    es: {
      help: [['ls', 'lista las secciones'], ['ls -l', 'lista con descripción'], ['cd proyectos', 'abre una sección (o haz clic en una carpeta)'], ['cd ..', 'vuelve atrás'], ['pwd', 'dónde estás'], ['whoami', 'quién hizo esto'], ['clear', 'limpia la pantalla (Ctrl+L)']],
      helpTip: 'Tab completa nombres. Las flechas repiten comandos anteriores.',
      notFound: ': carpeta no encontrada', cdNotFound: ': carpeta no encontrada. Escribe «ls» para ver lo que hay.',
      noSub: 'Esta sección no tiene subcarpetas. Usa «cd ..» para volver.', home: 'de vuelta al inicio',
      openingTab: 'abriendo {x} en una pestaña nueva ', opening: 'abriendo {x}…', inside: 'Escribe «ls» para ver lo que hay dentro.',
      noPage: 'Todavía sin página pública.', tip: 'consejo: la próxima vez escribe «cd {x}»',
      unknown: ': comando no encontrado. Escribe «ls» o «ayuda».',
      who: 'Berto Barata · Barata Studio, webs hechas a mano', personal: 'personal: ',
      goTo: 'Ir a ', open: 'Abrir ', suggest: 'cd proyectos', placeholder: 'prueba: cd proyectos'
    }
  }[LANG];

  /* ---------- the file system ---------- */
  // name: folder name per language; desc: description per language.
  var DEF = [
    { id: 'projects', target: '#projects',
      name: { pt: 'projetos', en: 'projects', fr: 'projets', es: 'proyectos' },
      desc: { pt: 'trabalho publicado', en: 'published work', fr: 'travaux publiés', es: 'trabajo publicado' },
      children: {
        'valejas-ac': { url: 'https://valejasac.pt', desc: { pt: 'clube de futsal, loja e área da Direção', en: 'futsal club, shop and board area', fr: 'club de futsal, boutique et espace direction', es: 'club de fútbol sala, tienda y área de la directiva' } },
        'greenbond': { url: 'https://greenbond.pt', desc: { pt: 'plataforma para o sector público', en: 'platform for the public sector', fr: 'plateforme pour le secteur public', es: 'plataforma para el sector público' } },
        'ludy-artes': { url: 'https://ludyartes.pt', desc: { pt: 'loja de agendas personalizadas', en: 'custom planner shop', fr: 'boutique d’agendas personnalisés', es: 'tienda de agendas personalizadas' } },
        'cao-na-rua': { url: 'https://caonarua.pt', desc: { pt: 'creche canina em Sintra', en: 'dog daycare in Sintra', fr: 'garderie canine à Sintra', es: 'guardería canina en Sintra' } },
        'gentle-laughter': { url: 'https://gentlelaughter.com', desc: { pt: 'produção de eventos', en: 'event production', fr: 'production d’événements', es: 'producción de eventos' } },
        'queen-bee-hair': { url: 'https://bertobarata.github.io/queen-bee-hair/', desc: { pt: 'extensões de cabelo', en: 'hair extensions', fr: 'extensions capillaires', es: 'extensiones de cabello' } },
        'barbearia-supra': { url: 'https://bertobarata.github.io/barbearia-supra/', desc: { pt: 'barbearia em Lisboa', en: 'barbershop in Lisbon', fr: 'barbier à Lisbonne', es: 'barbería en Lisboa' } }
      } },
    { id: 'apps', target: '#apps',
      name: { pt: 'apps', en: 'apps', fr: 'apps', es: 'apps' },
      desc: { pt: 'projetos em desenvolvimento', en: 'projects in development', fr: 'projets en développement', es: 'proyectos en desarrollo' },
      children: {
        'meet-tracker': { url: 'https://apps.apple.com/pt/app/meet-tracker/id6813061781', desc: { pt: 'app iOS, na App Store', en: 'iOS app, on the App Store', fr: 'app iOS, sur l’App Store', es: 'app iOS, en la App Store' } },
        'tvde': { url: 'https://apptvde.store', desc: { pt: 'app para o exame TVDE, em desenvolvimento', en: 'TVDE exam app, in development', fr: 'app pour l’examen TVDE, en développement', es: 'app para el examen TVDE, en desarrollo' } },
        'fine-rag': { desc: { pt: 'protótipo privado: perguntas sobre fichas FINE, a correr localmente', en: 'private prototype: questions about FINE sheets, running locally', fr: 'prototype privé : questions sur les fiches FINE, en local', es: 'prototipo privado: preguntas sobre fichas FINE, en local' } },
        'bertobarata.com': { url: 'https://bertobarata.com', desc: { pt: 'portfólio pessoal', en: 'personal portfolio', fr: 'portfolio personnel', es: 'portfolio personal' } }
      } },
    { id: 'services', target: '#services',
      name: { pt: 'servicos', en: 'services', fr: 'services', es: 'servicios' },
      desc: { pt: 'o que faço', en: 'what I do', fr: 'ce que je fais', es: 'lo que hago' } },
    { id: 'process', target: '#process-layers',
      name: { pt: 'processo', en: 'process', fr: 'processus', es: 'proceso' },
      desc: { pt: 'do briefing ao launch', en: 'from briefing to launch', fr: 'du brief au lancement', es: 'del briefing al lanzamiento' } },
    { id: 'about', target: '#sobre',
      name: { pt: 'sobre', en: 'about', fr: 'a-propos', es: 'sobre-mi' },
      desc: { pt: 'quem está por trás', en: 'who is behind it', fr: 'qui est derrière', es: 'quién está detrás' } },
    { id: 'faq', target: 'faq.html',
      name: { pt: 'faq', en: 'faq', fr: 'faq', es: 'faq' },
      desc: { pt: 'perguntas frequentes', en: 'frequently asked questions', fr: 'questions fréquentes', es: 'preguntas frecuentes' } },
    { id: 'contact', target: 'formulario.html',
      name: { pt: 'contacto', en: 'contact', fr: 'contact', es: 'contacto' },
      desc: { pt: 'pedir proposta', en: 'request a proposal', fr: 'demander un devis', es: 'pedir presupuesto' } }
  ];

  var FS = { children: {} };
  var ALIASES = {};
  // Words people will try instead of the folder names.
  var EXTRA = {
    projects: ['portfolio', 'portefolio', 'trabalho', 'trabalhos', 'work', 'projeto', 'project', 'projet', 'proyecto', 'travaux', 'trabajo'],
    apps: ['aplicacoes', 'app', 'em-desenvolvimento', 'lab', 'labs', 'applications', 'aplicaciones'],
    services: ['servico', 'service', 'servicio'],
    process: ['metodo'],
    about: ['info', 'sobre-mim', 'sobremim', 'about-me', 'eu', 'me', 'apropos', 'quien'],
    faq: ['perguntas', 'questions', 'preguntas'],
    contact: ['contactos', 'contato', 'proposta', 'orcamento', 'devis', 'presupuesto', 'contacts']
  };
  DEF.forEach(function (d) {
    var kids = null;
    if (d.children) {
      kids = {};
      Object.keys(d.children).forEach(function (k) {
        var c = d.children[k];
        kids[k] = { url: c.url, desc: c.desc[LANG] };
      });
    }
    var here = d.name[LANG];
    FS.children[here] = { target: d.target, desc: d.desc[LANG], children: kids };
    Object.keys(d.name).forEach(function (l) { ALIASES[d.name[l]] = here; });
    (EXTRA[d.id] || []).forEach(function (w) { ALIASES[w] = here; });
  });

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
  // A bare section name also works from inside another folder (cd sobre from ~/apps).
  function resolve(arg) {
    var r = resolveFrom(arg, cwd);
    if (!r && cwd.length && arg && arg.indexOf('/') < 0 && arg.charAt(0) !== '.') r = resolveFrom(arg, []);
    return r;
  }

  function resolveFrom(arg, start) {
    var a = (arg || '').trim();
    var path = start.slice();
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
    b.setAttribute('aria-label', (external ? M.open : M.goTo) + label.replace(/\/$/, ''));
    return b;
  }

  function labelFor(name, node) { return node.children || node.target ? name + '/' : name; }
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
      M.help.forEach(function (row) {
        print([el('span', 'term-key', (row[0] + '              ').slice(0, 14)), row[1]]);
      });
      print(M.helpTip, 'term-dim');
    },
    ls: function (args) {
      var long = args.some(function (a) { return /^-\w*l/.test(a); });
      var target = args.filter(function (a) { return a.charAt(0) !== '-'; })[0];
      var path = target ? resolve(target) : cwd;
      if (!path) return print('ls: ' + target + M.notFound, 'term-err');
      var node = nodeAt(path);
      if (node.url) return print([dirButton(path[path.length - 1], pretty(path), true)]);
      if (!node.children) {
        print(node.desc, 'term-dim');
        return print(M.noSub, 'term-dim');
      }
      var names = Object.keys(node.children);
      if (long) {
        names.forEach(function (n) {
          var child = node.children[n];
          var row = print([dirButton(labelFor(n, child), pretty(path.concat(n)), !!child.url)]);
          row.classList.add('term-row');
          row.appendChild(el('span', 'term-desc', child.desc));
        });
      } else {
        var row = print([], 'term-grid');
        names.forEach(function (n) {
          var child = node.children[n];
          row.appendChild(dirButton(labelFor(n, child), pretty(path.concat(n)), !!child.url));
        });
      }
    },
    cd: function (args) {
      var arg = args[0];
      var path = resolve(arg);
      if (!path) return print('cd: ' + arg + M.cdNotFound, 'term-err');
      if (path.length === 0) {
        setCwd([]);
        print([ICON.home + M.home], 'term-ok');
        go('#home');
        return;
      }
      var node = nodeAt(path);
      var leaf = path[path.length - 1];
      if (!node.url && !node.target && !node.children) {
        print(leaf + ': ' + node.desc, 'term-dim');
        print(M.noPage, 'term-dim');
        return;
      }
      if (node.url) {
        print([M.openingTab.replace('{x}', leaf), el('span', 'term-icon', ICON.link)], 'term-ok');
        window.open(node.url, '_blank', 'noopener');
        return;
      }
      setCwd(path);
      if (node.target.charAt(0) === '#') {
        print([ICON.open + pretty(path)], 'term-ok');
        if (node.children) print(M.inside, 'term-dim');
      } else {
        print([ICON.open + M.opening.replace('{x}', node.target)], 'term-ok');
      }
      go(node.target);
    },
    pwd: function () { print('/home/berto' + (cwd.length ? '/' + cwd.join('/') : '')); },
    whoami: function () {
      var a = el('a', null, 'bertobarata.com');
      a.href = 'https://bertobarata.com'; a.target = '_blank'; a.rel = 'noopener noreferrer';
      print(M.who);
      print([M.personal, a]);
    },
    clear: function () { out.textContent = ''; }
  };
  COMMANDS.help = COMMANDS.aide = COMMANDS.ayuda = COMMANDS.ajuda;
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
      print(M.tip.replace('{x}', words[0]), 'term-dim');
      COMMANDS.cd([words[0]]);
    } else {
      print(words[0] + M.unknown, 'term-err');
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
  // Stop the ghost typing as soon as the visitor does anything.
  // clearText: wipe the half-typed suggestion (on a key press or a click), never on submit.
  function stopDemo(clearText) {
    if (demoDone) return;
    if (demoTimer) { clearTimeout(demoTimer); demoTimer = null; }
    if (clearText && !input.dataset.user) input.value = '';
    input.placeholder = M.placeholder;
    demoDone = true;
  }
  function demo() {
    if (demoDone) return;
    if (REDUCED) { stopDemo(true); return; }
    var text = M.suggest;
    var i = 0;
    var back = false;
    (function step() {
      if (demoDone) return;
      if (!back) {
        input.value = text.slice(0, ++i);
        if (i === text.length) { back = true; demoTimer = setTimeout(step, 1400); return; }
        demoTimer = setTimeout(step, i === 1 ? 700 : 95);
      } else {
        input.value = text.slice(0, --i);
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
