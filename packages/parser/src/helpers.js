import pchar from './pchar';

// Choose any of a list of parsers
export const choice = listOfParsers => listOfParsers.reduce((a, b) => a.orElse(b));

// Choose any of a list of characters
export const anyOf = listOfChars => choice(listOfChars.map(pchar));

export const range = (start, end) => 
  Array.from({
    length: (end.charCodeAt(0) - start.charCodeAt(0) + 1)
  }, (v, k) => 
    String.fromCharCode(k + start.charCodeAt(0)));
