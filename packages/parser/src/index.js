// import Validation from 'data.validation';
// const { Success, Failure } = Validation;
// console.log(jBool.parse('true'));
// -----------------------------------------------------------------------------
// const isDigit = x => x >= '0' && x <= '9';
// const parseDigitWithLabel = satisfy(isDigit, 'digit');
// Parser.printResult(parseDigitWithLabel.parse('|ABC'));
//
// const exampleError =
//   Failure(['identifier', 'unexpected |', ['123 ab|cd', 1, 6]]);
// printResult(exampleError);
//
// printResult(jNull.parse('null'));
// printResult(jNull.parse('nulp'));
//
// printResult(jBool.parse('true'));
// printResult(jBool.parse('false'));
// printResult(jBool.parse('trux'));

export { default as Parser } from './Parser';
export { default as Position } from './Position';

export { default as anyOf } from './anyOf';
export { default as pchar } from './pchar';
export { default as pstring } from './pstring';
export { pint, pfloat } from './pint';
export {
  id,
  choice,
  satisfy,
  printResult,
  range,
  spaces,
  spaces1,
  isDigit,
  manyChars,
  manyChars1,
  until,
  any,
  createParserForwardedToRef,
} from './helpers';
