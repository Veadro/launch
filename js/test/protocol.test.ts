import { serializeString, deserializeString, serializeIntList, deserializeIntList } from '../src/protocol';
import { describe, expect, test } from 'bun:test';

describe('protocol serialization', () => {
  test('string roundtrip', () => {
    const buf = serializeString('hello');
    expect(deserializeString(buf)).toBe('hello');
  });

  test('int list roundtrip', () => {
    const list = [1, 2, 3, 999];
    const buf = serializeIntList(list);
    expect(deserializeIntList(buf)).toEqual(list);
  });
});
