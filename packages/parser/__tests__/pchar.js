import pchar from '../src/pchar';

describe('pchar', () => {
  const parseA = pchar('A');

  it('should handle empty or null input', () => {
    expect(parseA.parse().value).toEqual(['No more input']);
    expect(parseA.parse('').value).toEqual(['No more input']);
    expect(parseA.parse(null).value).toEqual(['No more input']);
    expect(parseA.parse(undefined).value).toEqual(['No more input']);
  });
  
  // TODO: Check with Success/Failure isEqual
  it('should parse `A` and return the rest', () => {
    expect(parseA.parse('A').value).toEqual(['A', '']);
    expect(parseA.parse('AB').value).toEqual(['A', 'B']);
    expect(parseA.parse('ABC').value).toEqual(['A', 'BC']);
    expect(parseA.parse('AA').value).toEqual(['A', 'A']);
  });

  it('should give feedback for non match', () => {
    const msg = `Expecting 'A'. Got 'B'`;
    expect(parseA.parse('B').value).toEqual([msg]);
    expect(parseA.parse('BC').value).toEqual([msg]);
    expect(parseA.parse('BAC').value).toEqual([msg]);
  });
});
