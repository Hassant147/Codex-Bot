export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function sanitizeText(value, max = 4000) {
  return String(value || '').replace(/\u0000/g, '').slice(0, max);
}

export function tokenizeCliArgs(input = '') {
  const value = String(input || '').trim();
  if (!value) return [];
  const tokens = [];
  let current = '';
  let quote = '';
  let escaping = false;
  for (const char of value) {
    if (escaping) {
      current += char;
      escaping = false;
      continue;
    }
    if (char === '\\') {
      escaping = true;
      continue;
    }
    if (quote) {
      if (char === quote) {
        quote = '';
      } else {
        current += char;
      }
      continue;
    }
    if (char === '"' || char === '\'') {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }
    current += char;
  }
  if (current) tokens.push(current);
  return tokens;
}
