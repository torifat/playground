import pchar from './pchar';
import { satisfy, manyChars1, isDigit } from './helpers';

/// parse a digit
const digitChar = satisfy(isDigit, 'digit');

// define parser for one or more digits
const digits = manyChars1(digitChar);

const resultToInt = ([sign, digits]) => sign.cata({
  Just: () => -digits,
  Nothing: () => +digits
});

const resultToFloat = ([[[sign, digits1]/*, point*/], digits2]) => {
  const digits = `${digits1}.${digits2}`;
  return sign.cata({
    Just: () => -digits,
    Nothing: () => +digits
  });
};

// pint :: string -> Parser
// an "int" is optional sign + one or more digits
export const pint = pchar('-').opt().andThen(digits)
  .map(resultToInt).setLabel('integer');

// parse a float
export const pfloat = pchar('-').opt().andThen(digits).andThen(pchar('.'))
  .andThen(digits).map(resultToFloat).setLabel('float');
