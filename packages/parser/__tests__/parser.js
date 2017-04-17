import Validation from 'data.validation';
const { Success, Failure } = Validation;

import Parser from '../src/parser';

import pchar from '../src/pchar';
import { _s, _ec } from './__helpers';

describe('Parser', () => {

  describe('andThen', () => {
    const parseAB = pchar('A').andThen(pchar('B'));

    it('should continue parsing on success', () => {
      expect(parseAB.parse('ABC').value).toEqual(_s(['A', 'B'], ['ABC'], 2));
    });

    it('should stop parsing on first failure', () => {
      expect(parseAB.parse('DBC').value).toEqual(_ec('A', 'D', 'DBC', 0));
    });

    it('should report the proper failure', () => {
      const result = parseAB.parse('ADC');
      expect(result.value).toEqual(_ec('B', 'D', 'ADC', 1));
      expect(result.isFailure).toBeTruthy();
    });
  });

  describe('orElse', () => {
    const parseAOrB = pchar('A').orElse(pchar('B'));

    it('should try all the parsers', () => {
      expect(parseAOrB.parse('ABC').value).toEqual(_s('A', ['ABC'], 1));
      expect(parseAOrB.parse('BBC').value).toEqual(_s('B', ['BBC'], 1));
    });

    it('should report the proper failure', () => {
      const result = parseAOrB.parse('DAC');
      expect(result.value).toEqual(_ec('B', 'D', 'DAC', 0));
      expect(result.isFailure).toBeTruthy();
    });
  });

  describe('map', () => {
    it('should map f on Success value', () => {
      const result = pchar('A').map(c => c.toLowerCase()).parse('ABC');
      expect(result.value).toEqual(_s('a', ['ABC'], 1));
    });

    it('should not map f on Failure value', () => {
      const result = pchar('A').map(c => c.toLowerCase()).parse('BAC');
      expect(result.value).toEqual(_ec('A', 'B', 'BAC', 0));
      expect(result.isFailure).toBeTruthy();
    });
  });

  describe('many', () => {
    const manyA = pchar('A').many();

    it('should match zero or more occurences of the specified parser', () => {
      expect(manyA.parse('ABCD').value).toEqual(_s(['A'], ['ABCD'], 1));
      expect(manyA.parse('AACD').value).toEqual(_s(['A', 'A'], ['AACD'], 2));
      expect(manyA.parse('AAAD').value).toEqual(_s(['A', 'A', 'A'], ['AAAD'], 3));
    });

    it('should not fail when there is no match', () => {
      expect(manyA.parse('|BCD').value).toEqual(_s([], ['|BCD'], 0));
    });
  });

  describe('many1', () => {
    const many1A = pchar('A').many1();

    it('should match one or more occurences of the specified parser', () => {
      expect(many1A.parse('ABCD').value).toEqual(_s(['A'], ['ABCD'], 1));
      expect(many1A.parse('AACD').value).toEqual(_s(['A', 'A'], ['AACD'], 2));
      expect(many1A.parse('AAAD').value).toEqual(_s(['A', 'A', 'A'], ['AAAD'], 3));
    });

    it('should not fail when there is no match', () => {
      expect(many1A.parse('|BCD').value).toEqual(_ec('A', '|', '|BCD', 0));
    });
  });

  describe('andThenLeft', () => {
    const parseAB = pchar('A').andThenLeft(pchar('B'));

    it('should only take value from left parser', () => {
      expect(parseAB.parse('ABC').value).toEqual(_s('A', ['ABC'], 2));
    });
  });

  describe('andThenRight', () => {
    const parseAB = pchar('A').andThenRight(pchar('B'));

    it('should only take value from right parser', () => {
      expect(parseAB.parse('ABC').value).toEqual(_s('B', ['ABC'], 2));
    });
  });

  describe('between', () => {
    const lParser = pchar('L');
    const rParser = pchar('R');
    const parser = pchar('M').between(lParser)(rParser);

    it('should only store value from the middle parser', () => {
      expect(parser.parse('LMR').value).toEqual(_s('M', ['LMR'], 3));
      expect(parser.parse('LMRA').value).toEqual(_s('M', ['LMRA'], 3));
    });

    it('should handle failure', () => {
      const result = parser.parse('LMXR');
      expect(result.value).toEqual(_ec('R', 'X', 'LMXR', 2));
      expect(result.isFailure).toBeTruthy();
    });
  });

  describe('sepBy', () => {
    const parseListOfA = pchar('A').sepBy(pchar(','));

    it('should parse zero or more occurrences of p separated by sep', () => {
      expect(parseListOfA.parse('A').value).toEqual(_s(['A'], ['A'], 1));
      expect(parseListOfA.parse('A,A,A').value)
        .toEqual(_s(['A', 'A', 'A'], ['A,A,A'], 5));
      expect(parseListOfA.parse('A,A,B').value)
        .toEqual(_s(['A', 'A'], ['A,A,B'], 3));
    });

    it('should not fail when there is no match', () => {
      expect(parseListOfA.parse(',B').value).toEqual(_s([], [',B'], 0));
    });
  });

  describe('sepBy1', () => {
    const parseListOfA = pchar('A').sepBy1(pchar(','));

    it('should parse one or more occurrences of p separated by sep', () => {
      expect(parseListOfA.parse('A').value).toEqual(_s(['A'], ['A'], 1));
      expect(parseListOfA.parse('A,A,A').value)
        .toEqual(_s(['A', 'A', 'A'], ['A,A,A'], 5));
      expect(parseListOfA.parse('A,A,B').value)
        .toEqual(_s(['A', 'A'], ['A,A,B'], 3));
    });

    it('should handle failure', () => {
      const result = parseListOfA.parse('B,');
      expect(result.value).toEqual(_ec('A', 'B', 'B,', 0));
      expect(result.isFailure).toBeTruthy();
    });
  });
});
