import Validation from 'data.validation';
const { Success, Failure } = Validation;

import Parser from '../src/parser';

describe('Parser', () => {
  const charParser = chr => 
    Parser.of(([head, ...tail] = []) => 
      head === chr ? Success([head, tail.join('')]) : Failure(head));

  describe('andThen', () => {
    const parseAB = charParser('A').andThen(charParser('B'));

    it('should continue parsing on success', () => {
      expect(parseAB.parse('ABC').value).toEqual([['A', 'B'], 'C']);
    });
    
    it('should stop parsing on first failure', () => {
      expect(parseAB.parse('DBC').value).toEqual('D');
    });
    
    it('should report the proper failure', () => {
      const result = parseAB.parse('ADC');
      expect(result.value).toEqual('D');
      expect(result.isFailure).toBeTruthy();
    });
  });

  describe('orElse', () => {
    const parseAOrB = charParser('A').orElse(charParser('B'));

    it('should try all the parsers', () => {
      expect(parseAOrB.parse('ABC').value).toEqual(['A', 'BC']);
      expect(parseAOrB.parse('BBC').value).toEqual(['B', 'BC']);
    });
    
    it('should report the proper failure', () => {
      const result = parseAOrB.parse('DAC');
      expect(result.value).toEqual('D');
      expect(result.isFailure).toBeTruthy();
    });
  });
  
  describe('map', () => {
    it('should map f on Success value', () => {
      const result = charParser('A').map(c => c.toLowerCase()).parse('ABC');
      expect(result.value).toEqual(['a', 'BC']);
    });
    
    it('should not map f on Failure value', () => {
      const result = charParser('A').map(c => c.toLowerCase()).parse('BAC');
      expect(result.value).toEqual('B');
      expect(result.isFailure).toBeTruthy();
    });
  });

  describe('many', () => {
    const manyA = charParser('A').many();

    it('should match zero or more occurences of the specified parser', () => {
      expect(manyA.parse('ABCD').value).toEqual([['A'], 'BCD']);
      expect(manyA.parse('AACD').value).toEqual([['A', 'A'], 'CD']);
      expect(manyA.parse('AAAD').value).toEqual([['A', 'A', 'A'], 'D']);
    });

    it('should not fail when there is no match', () => {
      expect(manyA.parse('|BCD').value).toEqual([[], '|BCD']);
    });
  });

  describe('many1', () => {
    const many1A = charParser('A').many1();

    it('should match one or more occurences of the specified parser', () => {
      expect(many1A.parse('ABCD').value).toEqual([['A'], 'BCD']);
      expect(many1A.parse('AACD').value).toEqual([['A', 'A'], 'CD']);
      expect(many1A.parse('AAAD').value).toEqual([['A', 'A', 'A'], 'D']);
    });

    it('should not fail when there is no match', () => {
      expect(many1A.parse('|BCD').value).toEqual('|');
    });
  });

  describe('andThenLeft', () => {
    const parseAB = charParser('A').andThenLeft(charParser('B'));

    it('should only take value from left parser', () => {
      expect(parseAB.parse('ABC').value).toEqual(['A', 'C']);
    });
  });
  
  describe('andThenRight', () => {
    const parseAB = charParser('A').andThenRight(charParser('B'));

    it('should only take value from right parser', () => {
      expect(parseAB.parse('ABC').value).toEqual(['B', 'C']);
    });
  });
  
  describe('between', () => {
    const lParser = charParser('L');
    const rParser = charParser('R');
    const parser = charParser('M').between(lParser)(rParser);

    it('should only store value from the middle parser', () => {
      expect(parser.parse('LMR').value).toEqual(['M', '']);
      expect(parser.parse('LMRA').value).toEqual(['M', 'A']);
    });
    
    it('should handle failure', () => {
      const result = parser.parse('LMXR');
      expect(result.value).toEqual('X');
      expect(result.isFailure).toBeTruthy();
    });
  });
  
  describe('sepBy1', () => {
    const parseListOfA = charParser('A').sepBy1(charParser(','));

    it('should parse one or more occurrences of p separated by sep', () => {
      expect(parseListOfA.parse('A').value).toEqual([['A'], '']);
      expect(parseListOfA.parse('A,A,A').value).toEqual([['A', 'A', 'A'], '']);
      expect(parseListOfA.parse('A,A,B').value).toEqual([['A', 'A'], ',B']);
    });

    it('should handle failure', () => {
      const result = parseListOfA.parse('B,');
      expect(result.value).toEqual('B');
      expect(result.isFailure).toBeTruthy();
    });
  });

  describe('sepBy', () => {
    const parseListOfA = charParser('A').sepBy(charParser(','));

    it('should parse zero or more occurrences of p separated by sep', () => {
      expect(parseListOfA.parse('A').value).toEqual([['A'], '']);
      expect(parseListOfA.parse('A,A,A').value).toEqual([['A', 'A', 'A'], '']);
      expect(parseListOfA.parse('A,A,B').value).toEqual([['A', 'A'], ',B']);
      expect(parseListOfA.parse(',B').value).toEqual([[], ',B']);
    });
  });

});
