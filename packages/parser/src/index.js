import Validation from 'data.validation';
const { Success, Failure } = Validation;

import Parser from './parser';
import Position from './position';
import pchar from './pchar';
import pstring from './pstring';
import { pint, pfloat } from './pint';
import { satisfy, printResult, range } from './helpers';

// -----------------------------------------------------------------------------
// const isDigit = x => x >= '0' && x <= '9';
// const parseDigitWithLabel = satisfy(isDigit, 'digit');
// Parser.printResult(parseDigitWithLabel.parse('|ABC'));
// 
// const exampleError =
//   Failure(['identifier', 'unexpected |', ['123 ab|cd', 1, 6]]);
// printResult(exampleError);
