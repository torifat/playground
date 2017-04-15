import Validation from 'data.validation';
const { Success, Failure } = Validation;

import Parser from './parser';
import { choice, anyOf, range } from './helpers';

// define parser for one digit
const digit = anyOf(range('0', '9'));

// define parser for one or more digits
const digits = digit.many1();

// map the digits to an int
// pint :: string -> Parser
export default digits.map(digitList => +digitList.join(''));
