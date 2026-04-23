import { formatDuration, parseDuration } from './durationHelpers';

describe('parseDuration', () => {
  describe('unit-based formats (abbreviated)', () => {
    it.each([
      ['1h 23m', 4980],
      ['1h23m', 4980],
      ['1h', 3600],
      ['23m', 1380],
      ['400s', 400],
      ['2h 30m 15s', 9015],
    ])('should parse "%s" to %i seconds', (input, expected) => {
      expect(parseDuration(input)).toBe(expected);
    });
  });

  describe('unit-based formats (long abbreviations)', () => {
    it.each([
      ['1hr 23min', 4980],
      ['1hr', 3600],
      ['23min', 1380],
      ['400sec', 400],
      ['1hr 23min 10sec', 4990],
    ])('should parse "%s" to %i seconds', (input, expected) => {
      expect(parseDuration(input)).toBe(expected);
    });
  });

  describe('unit-based formats (full words)', () => {
    it.each([
      ['1 hour 23 minutes', 4980],
      ['1 hour', 3600],
      ['23 minutes', 1380],
      ['400 seconds', 400],
      ['2 hours 30 minutes', 9000],
      ['1 hour 23 minutes 10 seconds', 4990],
      // Singular
      ['1 minute', 60],
      ['1 second', 1],
    ])('should parse "%s" to %i seconds', (input, expected) => {
      expect(parseDuration(input)).toBe(expected);
    });
  });

  describe('colon-delimited formats', () => {
    it.each([
      ['1:23', 4980],
      ['1:23:00', 4980],
      ['0:23', 1380],
      ['1:05', 3900],
      ['0:00', 0],
      ['2:00:30', 7230],
      ['0:0:45', 45],
    ])('should parse "%s" to %i seconds', (input, expected) => {
      expect(parseDuration(input)).toBe(expected);
    });

    it('should reject minutes > 59', () => {
      expect(parseDuration('1:60')).toBeNull();
    });

    it('should reject seconds > 59', () => {
      expect(parseDuration('1:23:60')).toBeNull();
    });
  });

  describe('decimal hours', () => {
    it.each([
      ['1.5h', 5400],
      ['1,5h', 5400],
      ['0.5h', 1800],
      ['0,5h', 1800],
      ['1.5hr', 5400],
      ['1,5hr', 5400],
      ['1.5 hours', 5400],
      ['1,5 hours', 5400],
      ['2.25h', 8100],
    ])('should parse "%s" to %i seconds', (input, expected) => {
      expect(parseDuration(input)).toBe(expected);
    });
  });

  describe('decimal minutes', () => {
    it.each([
      ['1.5m', 90],
      ['1,5m', 90],
      ['1.5min', 90],
      ['1,5 minutes', 90],
      ['30.5m', 1830],
    ])('should parse "%s" to %i seconds', (input, expected) => {
      expect(parseDuration(input)).toBe(expected);
    });
  });

  describe('plain number (interpreted as minutes)', () => {
    it.each([
      ['83', 4980],
      ['30', 1800],
      ['0', 0],
      ['1', 60],
      ['120', 7200],
      ['1.5', 90],
      ['1,5', 90],
    ])('should parse "%s" to %i seconds', (input, expected) => {
      expect(parseDuration(input)).toBe(expected);
    });
  });

  describe('whitespace handling', () => {
    it('should handle leading/trailing whitespace', () => {
      expect(parseDuration('  1h 23m  ')).toBe(4980);
    });

    it('should handle extra internal whitespace', () => {
      expect(parseDuration('1h  23m')).toBe(4980);
    });
  });

  describe('case insensitivity', () => {
    it.each([
      ['1H 23M', 4980],
      ['1Hr 23Min', 4980],
      ['1 Hour 23 Minutes', 4980],
      ['400S', 400],
    ])('should parse "%s" case-insensitively', (input, expected) => {
      expect(parseDuration(input)).toBe(expected);
    });
  });

  describe('invalid inputs', () => {
    it.each([
      ['', 'empty string'],
      ['   ', 'whitespace only'],
      ['abc', 'letters only'],
      ['h m', 'units without numbers'],
      ['1h abc', 'partial garbage'],
      ['--5', 'double dash'],
      ['1h 2h', 'duplicate units'],
    ])('should return null for %s (%s)', input => {
      expect(parseDuration(input)).toBeNull();
    });
  });

  describe('large minute values', () => {
    it('should parse 90m to 5400 seconds', () => {
      expect(parseDuration('90m')).toBe(5400);
    });

    it('should parse 150m to 9000 seconds', () => {
      expect(parseDuration('150m')).toBe(9000);
    });
  });
});

describe('formatDuration', () => {
  it.each([
    [0, '0m'],
    [60, '1m'],
    [1380, '23m'],
    [1800, '30m'],
    [3600, '1h'],
    [4980, '1h 23m'],
    [5400, '1h 30m'],
    [7200, '2h'],
    [9000, '2h 30m'],
  ])('should format %i seconds as "%s"', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });

  describe('seconds display', () => {
    it('should show seconds when non-zero', () => {
      expect(formatDuration(45)).toBe('45s');
    });

    it('should show minutes and seconds', () => {
      expect(formatDuration(90)).toBe('1m 30s');
    });

    it('should show hours, minutes, and seconds', () => {
      expect(formatDuration(3661)).toBe('1h 1m 1s');
    });

    it('should show hours and seconds when minutes are zero', () => {
      expect(formatDuration(3605)).toBe('1h 5s');
    });

    it('should omit seconds when zero', () => {
      expect(formatDuration(3660)).toBe('1h 1m');
    });
  });

  describe('edge cases', () => {
    it('should handle negative values as 0m', () => {
      expect(formatDuration(-100)).toBe('-1m 40s');
    });

    it('should handle 1 second', () => {
      expect(formatDuration(1)).toBe('1s');
    });

    it('should handle 29 seconds', () => {
      expect(formatDuration(29)).toBe('29s');
    });

    it('should handle large values', () => {
      expect(formatDuration(36000)).toBe('10h');
    });

    it('should handle hours with leftover seconds', () => {
      expect(formatDuration(3629)).toBe('1h 29s');
    });

    it('should handle hours with minutes and seconds', () => {
      expect(formatDuration(3630)).toBe('1h 30s');
    });
  });
});

describe('parseDuration → formatDuration round-trip', () => {
  it.each([
    ['1h 23m', '1h 23m'],
    ['1:23', '1h 23m'],
    ['83', '1h 23m'],
    ['1.5h', '1h 30m'],
    ['90m', '1h 30m'],
    ['30m', '30m'],
    ['2h', '2h'],
    ['0', '0m'],
    ['400s', '6m 40s'],
    ['1:23:45', '1h 23m 45s'],
  ])('should round-trip "%s" to "%s"', (input, expected) => {
    const seconds = parseDuration(input)!;
    expect(seconds).not.toBeNull();
    expect(formatDuration(seconds)).toBe(expected);
  });
});
