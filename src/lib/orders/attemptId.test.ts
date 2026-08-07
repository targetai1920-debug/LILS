import { describe, expect, it, vi } from 'vitest';
import { resolveAttemptIdentity } from './attemptId';

describe('resolveAttemptIdentity', () => {
  it('genera una clave nueva cuando no hay intento previo', () => {
    const generate = vi.fn(() => 'key-1');
    const identity = resolveAttemptIdentity(null, 'fingerprint-a', generate);
    expect(identity.attemptId).toBe('key-1');
    expect(generate).toHaveBeenCalledTimes(1);
  });

  it('reutiliza la misma clave si el fingerprint no cambió (reintento tras error o doble clic)', () => {
    const generate = vi.fn(() => 'key-should-not-be-used');
    const previous = { attemptId: 'key-original', fingerprint: 'fingerprint-a' };
    const identity = resolveAttemptIdentity(previous, 'fingerprint-a', generate);

    expect(identity.attemptId).toBe('key-original');
    expect(generate).not.toHaveBeenCalled();
  });

  it('10. genera una clave nueva cuando el pedido cambió (fingerprint distinto)', () => {
    const generate = vi.fn(() => 'key-new');
    const previous = { attemptId: 'key-original', fingerprint: 'fingerprint-a' };
    const identity = resolveAttemptIdentity(previous, 'fingerprint-b', generate);

    expect(identity.attemptId).toBe('key-new');
    expect(identity.attemptId).not.toBe(previous.attemptId);
    expect(generate).toHaveBeenCalledTimes(1);
  });

  it('no genera una clave distinta solo porque se llamó dos veces con el mismo fingerprint', () => {
    const generate = vi.fn(() => 'key-1');
    const first = resolveAttemptIdentity(null, 'fingerprint-a', generate);
    const second = resolveAttemptIdentity(first, 'fingerprint-a', generate);

    expect(second.attemptId).toBe(first.attemptId);
    expect(generate).toHaveBeenCalledTimes(1);
  });
});
