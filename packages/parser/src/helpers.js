import Validation from 'data.validation';
const { Success, Failure } = Validation;

import Parser from './parser';
import pchar from './pchar';

// Choose any of a list of parsers
export const choice = listOfParsers => listOfParsers.reduce((a, b) => a.orElse(b));

// Choose any of a list of characters
export const anyOf = listOfChars => 
  choice(listOfChars.map(pchar)).setLabel(`any of ${listOfChars.join(', ')}`);

export const satisfy = (predicate, label) => 
  Parser.of(input => {
    if (!input) {
      return Failure([label, 'No more input']);
    }
    const [ first ] = input;
    return predicate(first) ?
      Success([first, input.slice(1)]) :
      Failure([label, `Unexpected '${first}'`]);
  }, label);

// Non parser helper
export const range = (start, end) => 
  Array.from({
    length: (end.charCodeAt(0) - start.charCodeAt(0) + 1)
  }, (v, k) => 
    String.fromCharCode(k + start.charCodeAt(0)));
