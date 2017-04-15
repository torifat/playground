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
});
