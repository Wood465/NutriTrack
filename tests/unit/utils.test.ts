import { describe, expect, it } from 'vitest';

import { formatCurrency, formatDateToLocal } from '../../app/lib/utils';

describe('utils', () => {
  it('formats currency in USD', () => {
    expect(formatCurrency(1234)).toBe('$12.34');
  });

  it('formats date in the requested locale', () => {
    const result = formatDateToLocal('2024-06-01T12:00:00Z', 'en-US');
    expect(result).toBe('Jun 1, 2024');
  });
});
