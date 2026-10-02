#!/usr/bin/env python3
"""
Build the translated pages (/en, /fr, /es) from the Portuguese sources.

    python3 scripts/build-i18n.py

- Portuguese is the source of truth (index.html, faq.html, formulario.html).
- Translations live in i18n/<lang>.json as {"exact PT text": "translation"}.
- Translates text nodes, user-facing attributes and JSON-LD strings.
- Rewrites relative URLs for the subfolder (pages that are not translated,
  like the legal ones, stay in Portuguese and are linked with ../).
- Writes the language switcher and the hreflang links into every version,
  including the Portuguese pages (idempotent, between i18n markers).
- Fails loudly on any visible PT string without a translation.
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://baratastudio.com/'
PAGES = ['index.html', 'faq.html', 'formulario.html']
LANGS = ['pt', 'en', 'fr', 'es']
LABELS = {'pt': 'Português', 'en': 'English', 'fr': 'Français', 'es': 'Español'}
SWITCH_ARIA = {'pt': 'Idioma', 'en': 'Language', 'fr': 'Langue', 'es': 'Idioma'}
LOCALE = {'pt': 'pt_PT', 'en': 'en_GB', 'fr': 'fr_FR', 'es': 'es_ES'}
ATTRS = ('alt', 'aria-label', 'placeholder', 'title', 'data-tooltip', 'data-cmd')
META_KEYS = ('description', 'og:title', 'og:description')

# Visible strings that stay the same in every language.
KEEP = {
    'Barata Studio', 'FAQ', 'Email', 'WhatsApp', 'Instagram', 'Tab', 'ls', 'ok', '↑', '$',
    'berto.barata77@gmail.com', '@berto_barata', 'bertobarata.com', 'berto@barata-studio:',
    'berto@barata-studio: ~', '~', '$ ls -l', 'apps/', 'faq/', 'briefing', 'design', 'build', 'launch',
    'Meet Tracker', 'FINE RAG', 'Astro', 'SwiftUI · SwiftData · CloudKit', 'Next.js · Ollama · LanceDB',
    '100/100', '800+', '·', 'PT', 'EN', 'FR', 'ES', 'Português', 'English', 'Français', 'Español',
    'Barata Studio · Websites Personalizados', '©', '×', 'Language', 'Langue', 'Idioma',
}


def url_for(page, lang):
    base = '' if lang == 'pt' else lang + '/'
    return SITE + base + ('' if page == 'index.html' else page)


def href_from(page, from_lang, to_lang):
    up = '' if from_lang == 'pt' else '../'
    sub = '' if to_lang == 'pt' else to_lang + '/'
    return up + sub + page


def switch_html(page, lang, cls):
    items = []
    for l in LANGS:
        cur = ' aria-current="page"' if l == lang else ''
        items.append(f'<a href="{href_from(page, lang, l)}" hreflang="{l}" lang="{l}" title="{LABELS[l]}"{cur}>{l.upper()}</a>')
    return f'<nav class="lang-switch {cls}" aria-label="{SWITCH_ARIA[lang]}">' + ''.join(items) + '</nav>'


def hreflang_block(page):
    lines = [f'<link rel="alternate" hreflang="{l}" href="{url_for(page, l)}" />' for l in LANGS]
    lines.append(f'<link rel="alternate" hreflang="x-default" href="{url_for(page, "pt")}" />')
    return '\n  '.join(lines)


def put_block(s, name, content, anchor_re, where='after'):
    """Insert or replace <!-- i18n:name -->...<!-- /i18n:name --> next to an anchor."""
    block = f'<!-- i18n:{name} -->{content}<!-- /i18n:{name} -->'
    pat = re.compile(rf'<!-- i18n:{name} -->.*?<!-- /i18n:{name} -->', re.S)
    if pat.search(s):
        return pat.sub(lambda m: block, s, count=1)
    m = re.search(anchor_re, s, re.S)
    if not m:
        return s
    i = m.end() if where == 'after' else m.start()
    return s[:i] + block + s[i:]


def add_shared_blocks(s, page, lang):
    s = put_block(s, 'hreflang', '\n  ' + hreflang_block(page) + '\n  ', r'<link rel="canonical"[^>]*>\n')
    s = put_block(s, 'switch-header', switch_html(page, lang, 'lang-switch--header'),
                  r'\s*<a class="header-cta', where='before')
    s = put_block(s, 'switch-footer', switch_html(page, lang, 'lang-switch--footer'),
                  r'<div class="footer-bottom">', where='after')
    if page == 'index.html':
        s = put_block(s, 'switch-hero', switch_html(page, lang, 'lang-switch--hero'),
                      r'<div class="hero-copy">', where='after')
    return s


def norm(t):
    return ' '.join(html.unescape(t).split())


class Translator:
    def __init__(self, table, lang):
        self.t = table
        self.lang = lang
        self.missing = set()

    def text(self, raw):
        key = norm(raw)
        if not key or not re.search(r'[A-Za-zÀ-ÿ]', key):
            return raw
        if key in self.t:
            lead = raw[:len(raw) - len(raw.lstrip())]
            trail = raw[len(raw.rstrip()):]
            return lead + html.escape(self.t[key], quote=False) + trail
        if key not in KEEP:
            self.missing.add(key)
        return raw

    def attr(self, val):
        key = norm(val)
        if key in self.t:
            return html.escape(self.t[key], quote=True)
        if re.search(r'[A-Za-zÀ-ÿ]{3}', key) and key not in KEEP:
            self.missing.add(key)
        return val


def translate(s, page, lang, table):
    tr = Translator(table, lang)
    parts = re.split(r'(<script\b.*?</script>|<style\b.*?</style>)', s, flags=re.S)
    out = []
    for part in parts:
        if part.startswith('<script'):
            if 'application/ld+json' in part:
                part = re.sub(r'"((?:[^"\\]|\\.)*)"', lambda m: '"' + json.dumps(table.get(m.group(1), m.group(1)), ensure_ascii=False)[1:-1] + '"', part)
            out.append(part)
            continue
        if part.startswith('<style'):
            out.append(part)
            continue
        # attributes
        part = re.sub(r'\b(' + '|'.join(ATTRS) + r')="([^"]*)"', lambda m: f'{m.group(1)}="{tr.attr(m.group(2))}"', part)
        part = re.sub(r'(<meta (?:name|property)="(?:' + '|'.join(META_KEYS) + r')" content=")([^"]*)(")',
                      lambda m: m.group(1) + tr.attr(m.group(2)) + m.group(3), part)
        # text nodes
        part = re.sub(r'>([^<>]+)<', lambda m: '>' + tr.text(m.group(1)) + '<', part)
        out.append(part)
    s = ''.join(out)
    return s, tr.missing


def rewrite_urls(s, lang):
    """Make relative URLs work from /<lang>/. Translated pages stay in the same folder."""
    def fix(m):
        attr, url = m.group(1), m.group(2)
        if re.match(r'^(#|https?:|mailto:|tel:|data:|/|javascript:)', url) or url.startswith('../'):
            return m.group(0)
        path = url.split('#')[0].split('?')[0]
        if path in PAGES:
            return m.group(0)
        return f'{attr}="../{url}"'
    # language-switch links are generated already correct; protect them
    switches = {}
    def stash(m):
        k = f'@@SWITCH{len(switches)}@@'
        switches[k] = m.group(0)
        return k
    s = re.sub(r'<!-- i18n:switch-[a-z]+ -->.*?<!-- /i18n:switch-[a-z]+ -->', stash, s, flags=re.S)
    s = re.sub(r'\b(href|src|action)="([^"]*)"', fix, s)
    for k, v in switches.items():
        s = s.replace(k, v)
    return s


def localise_head(s, page, lang):
    s = re.sub(r'<html lang="[^"]*"( data-root="[^"]*")?>', f'<html lang="{lang}" data-root="../">', s, count=1)
    s = re.sub(r'<link rel="canonical" href="[^"]*" />', f'<link rel="canonical" href="{url_for(page, lang)}" />', s, count=1)
    s = re.sub(r'<meta property="og:url" content="[^"]*" />', f'<meta property="og:url" content="{url_for(page, lang)}" />', s, count=1)
    if 'og:locale' in s:
        s = re.sub(r'<meta property="og:locale" content="[^"]*" />', f'<meta property="og:locale" content="{LOCALE[lang]}" />', s)
    return s


def ensure_pt_head(s):
    if '<meta property="og:locale"' not in s:
        s = s.replace('<meta property="og:type" content="website" />', '<meta property="og:type" content="website" />\n  <meta property="og:locale" content="pt_PT" />', 1)
    return s


PT_ONLY = [('politica-privacidade.html', 'yearly', '0.3'), ('politica-cookies.html', 'yearly', '0.3'),
           ('termos-condicoes.html', 'yearly', '0.3'), ('mettracker.html', 'yearly', '0.4'),
           ('mettracker-privacidade.html', 'yearly', '0.3')]
PAGE_META = {'index.html': ('monthly', '1.0'), 'faq.html': ('monthly', '0.7'), 'formulario.html': ('yearly', '0.6')}


def write_sitemap(today):
    rows = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for page in PAGES:
        freq, prio = PAGE_META[page]
        alts = ''.join(f'\n    <xhtml:link rel="alternate" hreflang="{l}" href="{url_for(page, l)}" />' for l in LANGS)
        alts += f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{url_for(page, "pt")}" />'
        for l in LANGS:
            rows.append(f'  <url>\n    <loc>{url_for(page, l)}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>{freq}</changefreq>\n    <priority>{prio}</priority>{alts}\n  </url>')
    for page, freq, prio in PT_ONLY:
        rows.append(f'  <url>\n    <loc>{SITE}{page}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>{freq}</changefreq>\n    <priority>{prio}</priority>\n  </url>')
    rows.append('</urlset>\n')
    (ROOT / 'sitemap.xml').write_text('\n'.join(rows), encoding='utf-8')


def main():
    tables = {l: json.loads((ROOT / 'i18n' / f'{l}.json').read_text(encoding='utf-8')) for l in LANGS if l != 'pt'}
    problems = 0
    for page in PAGES:
        src_path = ROOT / page
        src = ensure_pt_head(src_path.read_text(encoding='utf-8'))
        src = add_shared_blocks(src, page, 'pt')
        src_path.write_text(src, encoding='utf-8')
        for lang, table in tables.items():
            s = add_shared_blocks(src, page, lang)
            s, missing = translate(s, page, lang, table)
            s = rewrite_urls(s, lang)
            s = localise_head(s, page, lang)
            out = ROOT / lang / page
            out.parent.mkdir(exist_ok=True)
            out.write_text(s, encoding='utf-8')
            if missing:
                problems += len(missing)
                print(f'[{lang}] {page}: {len(missing)} untranslated')
                for m in sorted(missing):
                    print('   -', m)
    import datetime
    write_sitemap(datetime.date.today().isoformat())
    print('done' if not problems else f'{problems} untranslated strings')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
