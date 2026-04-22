// Validates VibeMap node records parsed from raw/nodes/<id>.md frontmatter.
// Throws with file path + field path on the first violation.

const ALLOWED_LANGS = new Set(['ko', 'en', 'ja', 'other']);
const ALLOWED_SIZES = new Set([1, 2, 3]);

export function validateNode(node, { knownCats, file }) {
  const where = (field) => `${file}: ${field}`;
  if (!node || typeof node !== 'object') {
    throw new Error(`${file}: expected object, got ${typeof node}`);
  }
  if (!node.id || typeof node.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(node.id)) {
    throw new Error(`${where('id')}: missing or invalid id (lowercase/digits/hyphen; got ${JSON.stringify(node.id)})`);
  }
  if (!knownCats.has(node.cat)) {
    throw new Error(`${where('cat')}: unknown cat ${JSON.stringify(node.cat)}`);
  }
  if (!ALLOWED_SIZES.has(node.size)) {
    throw new Error(`${where('size')}: size must be 1, 2, or 3 (got ${JSON.stringify(node.size)})`);
  }
  if (!node.title || typeof node.title !== 'object') {
    throw new Error(`${where('title')}: missing title object`);
  }
  for (const lang of ['ko', 'en', 'ja']) {
    const t = node.title[lang];
    if (typeof t !== 'string' || !t.trim()) {
      throw new Error(`${where(`title.${lang}`)}: required non-empty string`);
    }
  }
  if (node.refs !== undefined) {
    if (!Array.isArray(node.refs)) throw new Error(`${where('refs')}: must be array`);
    node.refs.forEach((r, i) => {
      if (!r || typeof r !== 'object') throw new Error(`${where(`refs[${i}]`)}: must be object`);
      if (typeof r.url !== 'string' || !/^https?:\/\//.test(r.url)) {
        throw new Error(`${where(`refs[${i}].url`)}: must start with http:// or https:// (got ${JSON.stringify(r.url)})`);
      }
      if (typeof r.title !== 'string' || !r.title.trim()) {
        throw new Error(`${where(`refs[${i}].title`)}: required non-empty string`);
      }
      if (r.lang !== undefined && !ALLOWED_LANGS.has(r.lang)) {
        throw new Error(`${where(`refs[${i}].lang`)}: must be one of ${[...ALLOWED_LANGS].join('/')}`);
      }
    });
  }
  if (node.extraEdges !== undefined && !Array.isArray(node.extraEdges)) {
    throw new Error(`${where('extraEdges')}: must be array`);
  }
}
