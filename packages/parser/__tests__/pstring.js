import pstring from '../src/pstring';
import { _s, _ec } from './__helpers';

describe('pstring', () => {
  const parseABC = pstring('ABC');

  it('should handle empty or null input', () => {
    const err = ['A', 'No more input', ['EOF', 0, 0]];
    expect(parseABC.parse().value).toEqual(err);
    expect(parseABC.parse('').value).toEqual(err);
    expect(parseABC.parse('A').value).toEqual(_ec('B', '\n', 'A', 1));
    expect(parseABC.parse('AB').value).toEqual(_ec('C', '\n', 'AB', 2));
    expect(parseABC.parse(null).value).toEqual(err);
    expect(parseABC.parse(undefined).value).toEqual(err);
  });

  it('should parse `ABC` and return the rest', () => {
    expect(parseABC.parse('ABCDE').value).toEqual(_s('ABC', ['ABCDE'], 3));
    expect(parseABC.parse('ABC').value).toEqual(_s('ABC', ['ABC'], 3));
  });

  it('should give feedback for non match', () => {
    expect(parseABC.parse('A|CDE').value).toEqual(_ec('B', '|', 'A|CDE', 1));
    expect(parseABC.parse('AB|DE').value).toEqual(_ec('C', '|', 'AB|DE', 2));
  });
});
