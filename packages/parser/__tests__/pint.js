import { pint, pfloat } from '../src/pint';
import { _s, _ec } from './__helpers';

describe('pint', () => {
  it('should handle empty or null input', () => {
    const err = ['digit', 'No more input', ['EOF', 0, 0]];
    expect(pint.parse().value).toEqual(err);
    expect(pint.parse('').value).toEqual(err);
    expect(pint.parse(null).value).toEqual(err);
    expect(pint.parse(undefined).value).toEqual(err);
  });

  it('should parse integer and return the rest', () => {
    expect(pint.parse('1ABC').value).toEqual(_s(1, ['1ABC'], 1));
    expect(pint.parse('12BC').value).toEqual(_s(12, ['12BC'], 2));
    expect(pint.parse('123C').value).toEqual(_s(123, ['123C'], 3));
    expect(pint.parse('1234').value).toEqual(_s(1234, ['1234'], 4));
  });

  it('should give feedback for non match', () => {
    expect(pint.parse('ABC').value).toEqual(_ec('digit', 'A', 'ABC', 0));
  });

  it('should optionally handle negative number', () => {
    expect(pint.parse('-123C').value).toEqual(_s(-123, ['-123C'], 4));
  });
});

describe('pfloat', () => {
  it('should handle empty or null input', () => {
    const err = ['digit', 'No more input', ['EOF', 0, 0]];
    expect(pfloat.parse().value).toEqual(err);
    expect(pfloat.parse('').value).toEqual(err);
    expect(pfloat.parse(null).value).toEqual(err);
    expect(pfloat.parse(undefined).value).toEqual(err);
  });

  it('should parse float and return the rest', () => {
    expect(pfloat.parse('123.45Z').value).toEqual(_s(123.45, ['123.45Z'], 6));
  });

  it('should optionally handle negative number', () => {
    expect(pfloat.parse('-123.45Z').value).toEqual(_s(-123.45, ['-123.45Z'], 7));
  });
});
