import pint from '../src/pint';

describe('pint', () => {
  it('should handle empty or null input', () => {
    const err = ['9', 'No more input'];
    expect(pint.parse().value).toEqual(err);
    expect(pint.parse('').value).toEqual(err);
    expect(pint.parse(null).value).toEqual(err);
    expect(pint.parse(undefined).value).toEqual(err);
  });

  it('should parse integer and return the rest', () => {
    expect(pint.parse('1ABC').value).toEqual([1, 'ABC']);
    expect(pint.parse('12BC').value).toEqual([12, 'BC']);
    expect(pint.parse('123C').value).toEqual([123, 'C']);
    expect(pint.parse('1234').value).toEqual([1234, '']);
  });

  it('should give feedback for non match', () => {
    expect(pint.parse('ABC').value).toEqual(['9', `Unexpected 'A'`]);
  });

  it('should optionally handle negative number', () => {
    expect(pint.parse('-123C').value).toEqual([-123, 'C']);
  });
});
