import pstring from '../src/pstring';

describe('pstring', () => {
  const parseABC = pstring('ABC');

  it('should handle empty or null input', () => {
    const err = ['A', 'No more input'];
    expect(parseABC.parse().value).toEqual(err);
    expect(parseABC.parse('').value).toEqual(err);
    expect(parseABC.parse('A').value).toEqual(['B', 'No more input']);
    expect(parseABC.parse('AB').value).toEqual(['C', 'No more input']);
    expect(parseABC.parse(null).value).toEqual(err);
    expect(parseABC.parse(undefined).value).toEqual(err);
  });

  it('should parse `ABC` and return the rest', () => {
    expect(parseABC.parse('ABCDE').value).toEqual(['ABC', 'DE']);
    expect(parseABC.parse('ABC').value).toEqual(['ABC', '']);
  });

  it('should give feedback for non match', () => {
    expect(parseABC.parse('A|CDE').value).toEqual(['B', `Unexpected '|'`]);
    expect(parseABC.parse('AB|DE').value).toEqual(['C', `Unexpected '|'`]);
  });
});
