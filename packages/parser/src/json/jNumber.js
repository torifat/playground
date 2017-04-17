import pchar from '../pchar';
import pstring from '../pstring';
import { satisfy, manyChars, manyChars1, isDigit, spaces1 } from '../helpers';

import { JNumber } from './schema';

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
  Nothing: () => '',
  Just: f
});
const id = x => x;

const convertToJNumber = ([[[optSign, intPart], fractionPart], expPart]) => {
  // e.g. "-"
  const signStr = optToString(optSign)(id);
  // e.g. ".456"
  const fractionPartStr = optToString(fractionPart)(val => `.${val}`);
  // e.g. "e-12"
  const expPartStr = optToString(expPart)(([optSign, digits]) => {
    const sign = optToString(optSign)(id);
    return `e${sign}${digits}`;
  });

  return JNumber.of(Number.parseFloat(
    `${signStr}${intPart}${fractionPartStr}${expPartStr}`
  ));
};

/// Parse a JNumber
const jNumber = optSign.andThen(intPart)
  .andThen(fractionPart.opt()).andThen(exponentPart.opt())
  .map(convertToJNumber).setLabel('number');

// jNumber_
export const jNumber_ = jNumber.andThenLeft(spaces1);
export default jNumber;
