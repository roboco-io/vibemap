// scripts/build-references.mjs
// graphify의 graph.json을 VibeMap용 docs/references.json으로 변환한다.

export function normalizeText(input) {
  if (input == null) return '';
  const s = String(input);
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')   // 구두점·기호를 공백으로
    .replace(/\s+/g, ' ')
    .trim();
}
