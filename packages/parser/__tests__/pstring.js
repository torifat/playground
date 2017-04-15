import pstring from '../src/pstring';

describe('pstring', () => {
  const parseABC = pstring('ABC');

  it('should handle empty or null input', () => {
    expect(parseABC.parse().value).toEqual(['No more input']);
    expect(parseABC.parse('').value).toEqual(['No more input']);
    expect(parseABC.parse('A').value).toEqual(['No more input']);
    expect(parseABC.parse('AB').value).toEqual(['No more input']);
    expect(parseABC.parse(null).value).toEqual(['No more input']);
    expect(parseABC.parse(undefined).value).toEqual(['No more input']);
  });

  it('should parse `ABC` and return the rest', () => {
    expect(parseABC.parse('ABCDE').value).toEqual(['ABC', 'DE']);
    expect(parseABC.parse('ABC').value).toEqual(['ABC', '']);
  });

  it('should give feedback for non match', () => {
    expect(parseABC.parse('A|CDE').value).toEqual([`Expecting 'B'. Got '|'`]);
    expect(parseABC.parse('AB|DE').value).toEqual([`Expecting 'C'. Got '|'`]);
  });
});
