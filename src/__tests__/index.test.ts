import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const mod = await import('../../dist/index.js');

describe('feature-flag', () => {
  it('should export createFlags', () => {
    assert.ok(mod.createFlags);
  });
});
