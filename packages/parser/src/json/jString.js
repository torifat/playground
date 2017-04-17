import pchar from '../pchar';
import pstring from '../pstring';
import anyOf, { choice } from '../anyOf';
import { satisfy, range, manyChars } from '../helpers';

import { JString } from './schema';

// String
const jUnescapedChar = satisfy(ch => ch !== '\\' && ch !== '"').setLabel('char');

/// Parse an escaped char
const jEscapedChar = choice([
  // [stringToMatch, resultChar]
  ['"', '"'],     // quote
  ['\\', '\\'],   // reverse solidus
  ['/', '/'],     // solidus
  ['b', '\b'],    // backspace
  ['f', '\f'],    // formfeed
  ['n', '\n'],    // newline
  ['r', '\r'],    // cr
  ['t', '\t'],    // tab
].map(([ toMatch, result ]) => pstring(`\\${toMatch}`).map(() => result)))
  .setLabel('escaped char');

// Unicode Character
// set up the "primitive" parsers
const backslash = pchar('\\');
const uChar = pchar('u');
const hexdigit = anyOf(
  range('0', '9').concat(range('A', 'F').concat(range('a', 'f')))
);
// convert the parser output (nested tuples)
// to a char
const convertToChar = ([[[h1, h2], h3], h4]) =>
  String.fromCharCode(parseInt(`${h1}${h2}${h3}${h4}`, 16));

/// Parse a unicode char
const jUnicodeChar = backslash.andThenRight(uChar).andThenRight(hexdigit).andThen(hexdigit)
    .andThen(hexdigit).andThen(hexdigit).map(convertToChar);

/// Parse a String
const quote = pchar('"').setLabel('quote');
const jchar = jUnescapedChar.orElse(jEscapedChar).orElse(jUnicodeChar);
// set up the main parser
export const quotedString = quote.andThenRight(manyChars(jchar)).andThenLeft(quote);

// jString
export default quotedString.map(value => JString.of(value)).setLabel('quoted strin');
