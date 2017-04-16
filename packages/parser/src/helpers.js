import Validation from 'data.validation';
const { Success, Failure } = Validation;

import Parser from './parser';
import pchar from './pchar';

export const satisfy = (predicate, label) => 
  Parser.of(input => {
    const [ remainingInput, charOpt ] = input.nextChar();
    return charOpt.cata({
      Nothing: () => {
        return Failure([label, 'No more input', input.getParserPosition()]);
      },
      Just: first => {
        return (predicate(first)) ?
          Success([first, remainingInput]) :
          Failure([label, `Unexpected '${first}'`, input.getParserPosition()])
      }
    });
  }, label);

/// Parses a sequence of zero or more chars with the char parser cp. 
/// It returns the parsed chars as a string.
export const manyChars = cp => cp.many().map(charListToStr);

/// Parses a sequence of one or more chars with the char parser cp. 
/// It returns the parsed chars as a string.
export const manyChars1 = cp => cp.many1().map(charListToStr);

export const printResult = result => {
  result.cata({
    Success: ([ value, input ]) => console.log(value),
    Failure: ([ label, error, pos ]) => {
      const { line, column } = pos;
      const errorLine = pos.currentLine();
      const info = `Line:${line} Col:${column} Error parsing ${label}`;
      console.log(`${info}\n${errorLine}\n${' '.repeat(column)}^ ${error}`);
    }
  });
}

// Non parser helper
export const range = (start, end) => 
  Array.from({
    length: (end.charCodeAt(0) - start.charCodeAt(0) + 1)
  }, (v, k) => 
    String.fromCharCode(k + start.charCodeAt(0)));
