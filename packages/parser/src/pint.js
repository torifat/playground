import pchar from './pchar';
import anyOf from './any-of';
import { range } from './helpers';

// define parser for one digit
const digit = anyOf(range('0', '9'));

// define parser for one or more digits
const digits = digit.many1();

const resultToInt = ([sign, charList]) => sign.cata({
  Just: () => -(charList.join('')),
  Nothing: () => +(charList.join(''))
});

// map the digits to an int
// pint :: string -> Parser
export default pchar('-').opt().andThen(digits).map(resultToInt);
