// VibeMap's intentionally-restricted markdown → HTML renderer.
// Allowed: paragraphs, **bold**, *italic*, `inline code`, ### h3, unordered lists,
//          [[wiki]] / [[wiki|label]].
// Rejected (throws): code blocks, tables, images, raw HTML, h1, h2, h4+, ordered lists, blockquotes.
// Escapes <, >, & in text nodes. Only anchors emitted have `class="wiki-link" data-node-id="..."`.

const WIKI_RE = /\[\[([a-z0-9][a-z0-9-]*)(?:\|([^\]]+))?\]\]/g;

export function splitLanguageSections(source) {
  const headers = [];
  const headerRe = /^##\s+(ko|en|ja)\s*$/gm;
  let match;
  while ((match = headerRe.exec(source)) !== null) {
    headers.push({ lang: match[1], start: match.index, headerLen: match[0].length });
  }
  if (headers.length === 0) throw new Error('markdown: missing ## ko / ## en / ## ja sections');
  const out = {};
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    const bodyStart = h.start + h.headerLen;
    const bodyEnd = i + 1 < headers.length ? headers[i + 1].start : source.length;
    out[h.lang] = source.slice(bodyStart, bodyEnd).trim();
  }
  for (const lang of ['ko', 'en', 'ja']) {
    if (!out[lang] || !out[lang].trim()) {
      throw new Error(`markdown: missing or empty ## ${lang} section`);
    }
  }
  return out;
}

export function renderSection(source) {
  if (/```/.test(source)) throw new Error('markdown: code blocks are not allowed');
  if (/^\s*\|.*\|\s*$/m.test(source)) throw new Error('markdown: tables are not allowed');
  if (/!\[[^\]]*\]\([^)]+\)/.test(source)) throw new Error('markdown: images are not allowed');
  if (/<\/?[a-zA-Z][^>]*>/.test(source)) throw new Error('markdown: raw html is not allowed');
  if (/^#{1,2}\s/m.test(source)) throw new Error('markdown: only ### headers allowed inside language sections');
  if (/^#{4,}\s/m.test(source)) throw new Error('markdown: only ### headers allowed inside language sections');
  if (/^\s*>\s/m.test(source)) throw new Error('markdown: blockquotes are not allowed');
  if (/^\s*\d+\.\s/m.test(source)) throw new Error('markdown: ordered lists are not allowed');

  const wikiLinks = new Set();
  const blocks = source.split(/\n\s*\n/);
  const html = blocks.map((block) => renderBlock(block, wikiLinks)).filter(Boolean).join('');
  return { html, wikiLinks: [...wikiLinks] };
}

function renderBlock(block, wikiLinks) {
  const trimmed = block.trim();
  if (!trimmed) return '';
  if (/^###\s/.test(trimmed)) {
    const text = trimmed.replace(/^###\s+/, '');
    return `<h3>${inline(text, wikiLinks)}</h3>`;
  }
  if (/^-\s/.test(trimmed)) {
    const items = trimmed.split('\n').map((L) => {
      const m = L.match(/^-\s+(.*)$/);
      if (!m) throw new Error(`markdown: malformed list item ${JSON.stringify(L)}`);
      return `<li>${inline(m[1], wikiLinks)}</li>`;
    }).join('');
    return `<ul>${items}</ul>`;
  }
  return `<p>${inline(trimmed.replace(/\n/g, ' '), wikiLinks)}</p>`;
}

function inline(text, wikiLinks) {
  const placeholders = [];
  // 1. Extract wiki-links first so we never re-process their labels.
  let stripped = text.replace(WIKI_RE, (_m, id, label) => {
    wikiLinks.add(id);
    const display = (label || id).trim();
    placeholders.push(`<a class="wiki-link" data-node-id="${id}">${escapeHtml(display)}</a>`);
    return `\x00${placeholders.length - 1}\x00`;
  });
  // 2. Extract `inline code` so its contents are not interpreted as markdown.
  stripped = stripped.replace(/`([^`\n]+)`/g, (_m, code) => {
    placeholders.push(`<code>${escapeHtml(code)}</code>`);
    return `\x00${placeholders.length - 1}\x00`;
  });
  // 3. Escape everything else.
  stripped = escapeHtml(stripped);
  // 4. Bold/italic on escaped text.
  stripped = stripped.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  stripped = stripped.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  // 5. Restore placeholders.
  stripped = stripped.replace(/\x00(\d+)\x00/g, (_m, n) => placeholders[Number(n)]);
  return stripped;
}

function escapeHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
