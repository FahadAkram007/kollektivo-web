import { describe, expect, it } from 'vitest';

import { keyFromKeyboard, MAX_AMOUNT_CENTS, pressKey, type PadKey } from './amount-entry';

const type = (keys: PadKey[]) => keys.reduce(pressKey, 0);

describe('pressKey', () => {
  it('fills digits in from the right like a cash register', () => {
    expect(type(['6', '8', '0'])).toBe(680);
    expect(type(['1', '2', '00'])).toBe(1200);
  });

  it('ignores leading zeros', () => {
    expect(type(['0', '0', '5'])).toBe(5);
  });

  it('removes the last digit and clears', () => {
    expect(type(['6', '8', '0', 'back'])).toBe(68);
    expect(type(['6', '8', 'clear'])).toBe(0);
  });

  it('never goes above the maximum', () => {
    expect(pressKey(MAX_AMOUNT_CENTS, '1')).toBe(MAX_AMOUNT_CENTS);
    expect(pressKey(10_001, '0')).toBe(10_001);
  });
});

describe('keyFromKeyboard', () => {
  it('maps digits, backspace and escape', () => {
    expect(keyFromKeyboard('7')).toBe('7');
    expect(keyFromKeyboard('Backspace')).toBe('back');
    expect(keyFromKeyboard('Escape')).toBe('clear');
    expect(keyFromKeyboard('a')).toBeNull();
  });
});
