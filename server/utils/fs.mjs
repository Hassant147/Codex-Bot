import fs from 'node:fs/promises';
import path from 'node:path';

export async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(targetPath) {
  await fs.mkdir(targetPath, { recursive: true });
}

export async function readJson(targetPath, fallback = null) {
  try {
    const raw = await fs.readFile(targetPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function writeJson(targetPath, value) {
  await ensureDir(path.dirname(targetPath));
  await fs.writeFile(targetPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function appendJsonLine(targetPath, value) {
  await ensureDir(path.dirname(targetPath));
  await fs.appendFile(targetPath, `${JSON.stringify(value)}\n`, 'utf8');
}

export async function readJsonLines(targetPath, limit = 200) {
  try {
    const raw = await fs.readFile(targetPath, 'utf8');
    return raw
      .trim()
      .split('\n')
      .filter(Boolean)
      .slice(-limit)
      .map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}
