// Minimal YAML-subset parser for VibeMap node frontmatter.
// Supports:
//   - scalar key: value (string, number, [])
//   - nested mapping (2-space indent) one level deep for `title:`
//   - list of mappings (2-space indent, `- ` prefix) for `refs:`
//   - inline empty list: `key: []`
// Rejects anything else with a line-numbered error.

export function parseFrontmatter(source) {
  const lines = source.split('\n');
  if (lines[0] !== '---') {
    throw new Error('frontmatter: missing opening --- delimiter');
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') { end = i; break; }
  }
  if (end < 0) throw new Error('frontmatter: missing closing --- delimiter');

  const fmLines = lines.slice(1, end);
  const body = lines.slice(end + 1).join('\n');
  const data = parseBlock(fmLines, 0);
  return { data, body };
}

function parseBlock(lines, baseIndent) {
  const out = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) { i++; continue; }
    const indent = line.length - line.trimStart().length;
    if (indent !== baseIndent) {
      throw new Error(`frontmatter: unexpected indent at line ${i + 1}: ${JSON.stringify(line)}`);
    }
    const m = line.match(/^(\s*)([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!m) throw new Error(`frontmatter: unparsable line ${i + 1}: ${JSON.stringify(line)}`);
    const key = m[2];
    const rest = m[3];

    if (rest === '') {
      const childIndent = baseIndent + 2;
      const childLines = [];
      i++;
      while (i < lines.length) {
        const L = lines[i];
        if (!L.trim() || L.trim().startsWith('#')) { childLines.push(L); i++; continue; }
        const ind = L.length - L.trimStart().length;
        if (ind < childIndent) break;
        childLines.push(L.slice(childIndent));
        i++;
      }
      out[key] = parseChildren(childLines);
    } else if (rest === '[]') {
      out[key] = [];
      i++;
    } else {
      out[key] = parseScalar(rest);
      i++;
    }
  }
  return out;
}

function parseChildren(lines) {
  if (lines.length === 0) return {};
  const firstNonEmpty = lines.find((L) => L.trim() && !L.trim().startsWith('#'));
  if (firstNonEmpty && firstNonEmpty.startsWith('- ')) {
    return parseList(lines);
  }
  return parseBlock(lines, 0);
}

function parseList(lines) {
  const items = [];
  let current = null;
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (line.startsWith('- ')) {
      if (current !== null) items.push(current);
      const rest = line.slice(2);
      current = {};
      const m = rest.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
      if (!m) throw new Error(`frontmatter: list item must start with "key: value" — got ${JSON.stringify(line)}`);
      current[m[1]] = parseScalar(m[2]);
    } else if (line.startsWith('  ')) {
      const m = line.slice(2).match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
      if (!m || !current) throw new Error(`frontmatter: bad list continuation ${JSON.stringify(line)}`);
      current[m[1]] = parseScalar(m[2]);
    } else {
      throw new Error(`frontmatter: unexpected list line ${JSON.stringify(line)}`);
    }
  }
  if (current !== null) items.push(current);
  return items;
}

function parseScalar(raw) {
  const s = raw.trim();
  if (s === '') return '';
  if (s === '[]') return [];
  if (/^-?\d+$/.test(s)) return Number(s);
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}
