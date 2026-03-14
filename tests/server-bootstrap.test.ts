import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatAddress, isPortInUseError, shouldRetryWithNextPort } from '../server/index.mjs';

const originalPort = process.env.PORT;

afterEach(() => {
  if (originalPort === undefined) {
    delete process.env.PORT;
  } else {
    process.env.PORT = originalPort;
  }
  vi.restoreAllMocks();
});

describe('server bootstrap helpers', () => {
  it('detects EADDRINUSE errors', () => {
    expect(isPortInUseError({ code: 'EADDRINUSE' })).toBe(true);
    expect(isPortInUseError({ code: 'ECONNRESET' })).toBe(false);
  });

  it('retries on the default port when PORT is not explicitly set', () => {
    delete process.env.PORT;

    expect(shouldRetryWithNextPort({ code: 'EADDRINUSE' }, 4311)).toBe(true);
    expect(shouldRetryWithNextPort({ code: 'EADDRINUSE' }, 4312)).toBe(false);
  });

  it('does not retry when PORT is explicitly set', () => {
    process.env.PORT = '5000';

    expect(shouldRetryWithNextPort({ code: 'EADDRINUSE' }, 4311)).toBe(false);
  });

  it('formats the local address consistently', () => {
    expect(formatAddress(4312)).toBe('http://localhost:4312');
  });
});
