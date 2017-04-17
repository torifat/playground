import pchar from './pchar';
import pstring from './pstring';
import { satisfy, range, manyChars, manyChars1, isDigit } from './helpers';
import anyOf, { choice } from './any-of';

class Token {
  static of (...args) {
    return new this(...args);
  }
}

class ValuedToken extends Token {
  constructor (value) {
    super();
    this.value = value;
  }
}

class JNull extends Token {}
class JBool extends ValuedToken {}
class JString extends ValuedToken {}
class JNumber extends ValuedToken {}

// Null
export const jNull = pstring('null').map(_ => JNull.of()).setLabel('null');

// Bool
const jtrue = pstring('true').map(_ => JBool.of(true));
const jfalse = pstring('false').map(_ => JBool.of(false));
export const jBool = jtrue.orElse(jfalse).setLabel('bool');

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
].map(([ toMatch, result ]) => pstring(`\\${toMatch}`).map(_ => result)))
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
const quotedString = quote.andThenRight(manyChars(jchar)).andThenLeft(quote);
const jString = quotedString.map(value => JString.of(value)).setLabel('quoted strin');

// Number
const optSign = pchar('-').opt();
const zero = pstring('0');
const digitOneNine = satisfy((ch => isDigit(ch) && ch !== '0')).setLabel('1-9');
const digit = satisfy(isDigit, 'digit');
const point = pchar('.');

const e = pchar('e').orElse(pchar('E'));
const optPlusMinus = pchar('-').orElse(pchar('+')).opt();

const nonZeroInt = digitOneNine.andThen(manyChars(digit))
  .map(([first, rest]) => `${first}${rest}`);

const intPart = zero.orElse(nonZeroInt);

const oneOrMoreDigits = manyChars1(digit);
const fractionPart = point.andThenRight(oneOrMoreDigits);
const exponentPart = e.andThenRight(optPlusMinus).andThen(oneOrMoreDigits);

// utility function to convert an optional value to a string, or "" if missing
const optToString = opt => f => opt.cata({
  Nothing: () => f(''),
  Just: f
});
const id = x => x;

const convertToJNumber = ([[[optSign, intPart], fractionPart], expPart]) => {
  // e.g. "-"
  const signStr = optToString(optSign)(id);
  // e.g. ".456"
  const fractionPartStr = optToString(fractionPart)(val => `.${val}`);
  // e.g. "e-12"
  const expPartStr = optToString(expPart)(([optSign, digits]) =>
    optToString(optSign)(sign => `e${sign}${digits}`));

  return JNumber.of(Number.parseFloat(
    `${signStr}${intPart}${fractionPartStr}${expPartStr}`
  ));
};

/// Parse a JNumber
const jNumber = optSign.andThen(intPart)
  .andThen(fractionPart.opt()).andThen(exponentPart.opt())
  .map(convertToJNumber).setLabel('number');
