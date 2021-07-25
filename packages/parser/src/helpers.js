import Validation from 'data.validation';
import { isWhitespaceCharacter } from 'is-whitespace-character';

import Parser from './Parser';

const { Success, Failure } = Validation;

export const satisfy = (predicate, label) =>
  Parser.of(input => {
    const [remainingInput, charOpt] = input.nextChar();
    return charOpt.cata({
      Nothing: () => {
        return Failure([label, 'No more input', input.getParserPosition()]);
      },
      Just: first => {
        return predicate(first)
          ? Success([first, remainingInput, label])
          : Failure([
              label,
              `Unexpected '${first}'`,
              input.getParserPosition(),
            ]);
      },
    });
  }, label);

export const isDigit = ch => /^\d$/.test(ch);
export const id = x => x;
export const eq = x => y => y === x;
export const not = x => y => y !== x;

const charListToStr = charList => charList.join('');

/// Parses a sequence of zero or more chars with the char parser cp.
/// It returns the parsed chars as a string.
export const manyChars = cp => cp.many().map(charListToStr);

/// Parses a sequence of one or more chars with the char parser cp.
/// It returns the parsed chars as a string.
export const manyChars1 = cp => cp.many1().map(charListToStr);

/// parse a whitespace char
export const whitespaceChar = satisfy(isWhitespaceCharacter, 'whitespace');

/// parse anything
export const any = satisfy(id, 'any');

/// parse until
export const until = char => satisfy(not(char), 'until');

/// parse zero or more whitespace char
export const spaces = whitespaceChar.many();

/// parse one or more whitespace char
export const spaces1 = whitespaceChar.many1();

// Choose any of a list of parsers
export const choice = listOfParsers =>
  listOfParsers.reduce((a, b) => a.orElse(b));

// Forward references
export const createParserForwardedToRef = () => {
  const dummyParser = Parser.of(
    (/*input*/) => {
      throw new Error('unfixed forwarded parser');
    },
    'unknown'
  );
  let parserRef = { parser: dummyParser };
  const wrapperParser = Parser.of(input => parserRef.parser.runOnInput(input));
  wrapperParser.ref = parserRef;
  return wrapperParser;
};

export const logger = input => console.log(input) || input;

export const printResult = result => {
  result.cata({
    Success: ([lines, _input, _label]) =>
      [].concat(lines).forEach((l, _ln) => console.log(l)),
    Failure: ([label, error, pos]) => {
      const [errorLine, line, column] = pos;
      const info = `Line:${line} Col:${column} Error parsing ${label}`;
      console.log(`${info}\n${errorLine}\n${' '.repeat(column)}^ ${error}`);
    },
  });
};

// Non parser helper
export const range = (start, end) =>
  Array.from(
    {
      length: end.charCodeAt(0) - start.charCodeAt(0) + 1,
    },
    (v, k) => String.fromCharCode(k + start.charCodeAt(0))
  );
