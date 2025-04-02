import { describe, expect, it } from 'vitest';

import { clamp, number } from './number';

describe('Utils: number', () => {
  describe('number function', () => {
    it('should return the default value if the value is not a number', () => {
      expect(number('not a number', 1)).toBe(1);
      expect(number(null, 1)).toBe(1);
      expect(number(undefined, 1)).toBe(1);
      expect(number({}, 1)).toBe(1);
      expect(number([], 1)).toBe(1);
    });

    it('should return the number if the value is a number', () => {
      expect(number(1, 1)).toBe(1);
      expect(number(0, 1)).toBe(0);
      expect(number(-1, 1)).toBe(-1);
    });

    it('should return the number if the value is a decimal number', () => {
      expect(number(1.5, 1)).toBe(1.5);
      expect(number(0.5, 1)).toBe(0.5);
      expect(number(-1.5, 1)).toBe(-1.5);
    });

    it('should return the number if the value is a string number', () => {
      expect(number('1.5', 1)).toBe(1.5);
      expect(number('0', 1)).toBe(0);
      expect(number('-1', 1)).toBe(-1);
      expect(number('1e5', 1)).toBe(100000);
    });
  });

  describe('clamp function', () => {
    it('should return the value if it is within the min and max range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('should return the min value if the value is less than min', () => {
      expect(clamp(-1, 0, 10)).toBe(0);
      expect(clamp(0, 5, 10)).toBe(5);
    });

    it('should return the max value if the value is greater than max', () => {
      expect(clamp(11, 0, 10)).toBe(10);
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle negative ranges', () => {
      expect(clamp(-5, -10, 0)).toBe(-5);
      expect(clamp(-15, -10, 0)).toBe(-10);
      expect(clamp(5, -10, 0)).toBe(0);
    });
  });
});
