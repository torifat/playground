import pchar from '../src/pchar';

describe('pchar', () => {
  const parseA = pchar('A');

  it('should handle empty or null input', () => {
    const err = ['A', 'No more input'];
    expect(parseA.parse().value).toEqual(err);
    expect(parseA.parse('').value).toEqual(err);
    expect(parseA.parse(null).value).toEqual(err);
    expect(parseA.parse(undefined).value).toEqual(err);
  });
  
  // TODO: Check with Success/Failure isEqual
  it('should parse `A` and return the rest', () => {
    expect(parseA.parse('A').value).toEqual(['A', '']);
    expect(parseA.parse('AB').value).toEqual(['A', 'B']);
    expect(parseA.parse('ABC').value).toEqual(['A', 'BC']);
    expect(parseA.parse('AA').value).toEqual(['A', 'A']);
  });

  it('should give feedback for non match', () => {
    const err = ['A', `Unexpected 'B'`];
    expect(parseA.parse('B').value).toEqual(err);
    expect(parseA.parse('BC').value).toEqual(err);
    expect(parseA.parse('BAC').value).toEqual(err);
  });
});
