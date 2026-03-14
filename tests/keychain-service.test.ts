import { describe, expect, it } from 'vitest';
import { decodeKeychainSecret } from '../server/services/keychain-service.mjs';

describe('decodeKeychainSecret', () => {
  it('decodes hex-encoded keychain payloads back to utf8', () => {
    const hexPayload = Buffer.from('{"auth_mode":"chatgpt"}\n', 'utf8').toString('hex');
    expect(decodeKeychainSecret(hexPayload)).toBe('{"auth_mode":"chatgpt"}');
  });

  it('leaves plain string secrets unchanged', () => {
    expect(decodeKeychainSecret('sk-test-123')).toBe('sk-test-123');
  });
});
