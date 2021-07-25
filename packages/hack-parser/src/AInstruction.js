import { isDigit, satisfy, pstring } from '@playground/parser';
import { AInstruction } from './schema';

const digits = satisfy(isDigit, 'digits');

export const aInstruction = pstring('@')
  .andThen(digits.many1().map(chars => chars.join('')))
  .setLabel('A Instruction')
  .map(values => AInstruction.of(values.join('')));
