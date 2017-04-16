import pchar from '../src/pchar';
import { _s, _ec } from './__helpers';

describe('pchar', () => {
  const parseA = pchar('A');

  it('should handle empty or null input', () => {
    const err = ['A', 'No more input', ['EOF', 0, 0]];
    expect(parseA.parse().value).toEqual(err);
    expect(parseA.parse('').value).toEqual(err);
    expect(parseA.parse(null).value).toEqual(err);
    expect(parseA.parse(undefined).value).toEqual(err);
  });
  
  // TODO: Check with Success/Failure isEqual
  it('should parse `A` and return the rest', () => {
    expect(parseA.parse('A').value).toEqual(_s('A', ['A'], 1));

    expect(parseA.parse('AB').value).toEqual(_s('A', ['AB'], 1));

    expect(parseA.parse('ABC').value).toEqual(_s('A', ['ABC'], 1));
    expect(parseA.parse('AA').value).toEqual(_s('A', ['AA'], 1));
  });

  it('should give feedback for non match', () => {
    expect(parseA.parse('B').value).toEqual(_ec('A', 'B', 'B', 0));
    expect(parseA.parse('BC').value).toEqual(_ec('A', 'B', 'BC', 0));
    expect(parseA.parse('BAC').value).toEqual(_ec('A', 'B', 'BAC', 0));
  });
});
