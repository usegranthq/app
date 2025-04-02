import { describe, expect, it } from 'vitest';

import { isObject, sillyClone } from './object';

describe('Utils: object', () => {
  describe('sillyClone function', () => {
    it('should clone a simple object', () => {
      const original = { name: 'test', value: 42 };
      const cloned = sillyClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it('should clone nested objects', () => {
      const original = {
        name: 'test',
        nested: {
          value: 42,
          array: [1, 2, 3],
        },
      };
      const cloned = sillyClone(original);

      expect(cloned).toEqual(original);
      expect(cloned.nested).not.toBe(original.nested);
    });

    it('should handle arrays', () => {
      const original = [1, 2, 3, { name: 'test' }];
      const cloned = sillyClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[3]).not.toBe(original[3]);
    });

    it('should handle circular references', () => {
      const circular: Record<string, unknown> = { name: 'test' };
      circular.self = circular;

      const cloned = sillyClone(circular);

      expect(cloned.name).toBe('test');
      expect(cloned.self).toBe('[Circular]');
    });

    it('should handle empty objects and arrays', () => {
      expect(sillyClone({})).toEqual({});
      expect(sillyClone([])).toEqual([]);
    });
  });

  describe('isObject function', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ name: 'test' })).toBe(true);
      expect(isObject([])).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(1)).toBe(false);
      expect(isObject('test')).toBe(false);
      expect(isObject(true)).toBe(false);
    });
  });
});
