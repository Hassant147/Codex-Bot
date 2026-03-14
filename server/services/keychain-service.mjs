import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { KEYCHAIN_SERVICE_NAME } from '../config.mjs';

const execFileAsync = promisify(execFile);

export function decodeKeychainSecret(raw = '') {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return '';
  if (trimmed.length % 2 === 0 && /^[0-9a-f]+$/i.test(trimmed)) {
    try {
      const decoded = Buffer.from(trimmed, 'hex').toString('utf8').trim();
      if (decoded) return decoded;
    } catch {
      // Fall back to the original secret if decoding fails.
    }
  }
  return trimmed;
}

export class KeychainService {
  async save(accountId, secret) {
    await execFileAsync('/usr/bin/security', [
      'add-generic-password',
      '-a',
      accountId,
      '-s',
      KEYCHAIN_SERVICE_NAME,
      '-w',
      secret,
      '-U'
    ]);
  }

  async read(accountId) {
    const { stdout } = await execFileAsync('/usr/bin/security', [
      'find-generic-password',
      '-a',
      accountId,
      '-s',
      KEYCHAIN_SERVICE_NAME,
      '-w'
    ]);
    return decodeKeychainSecret(stdout || '');
  }

  async remove(accountId) {
    try {
      await execFileAsync('/usr/bin/security', [
        'delete-generic-password',
        '-a',
        accountId,
        '-s',
        KEYCHAIN_SERVICE_NAME
      ]);
    } catch {
      // Ignore deletes for missing entries.
    }
  }
}
