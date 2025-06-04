import { Player } from '../src/entities';
import { describe, expect, test } from 'bun:test';

describe('player entity', () => {
  test('creation sets name and hp', () => {
    const p = new Player('Bob', 100);
    expect(p.name).toBe('Bob');
    expect(p.hp).toBe(100);
  });

  test('health regeneration', () => {
    const p = new Player('Alice', 50);
    p.inflictDamage(20);
    expect(p.hp).toBe(30);
    p.addHP(10);
    expect(p.hp).toBe(40);
    p.addHP(20); // should cap at max
    expect(p.hp).toBe(50);
  });
});
