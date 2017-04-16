import Validation from 'data.validation';
const { Success, Failure } = Validation;

import Parser from './parser';
import pchar from './pchar';
import pstring from './pstring';
import pint from './pint';
import { satisfy, range } from './helpers';

// -----------------------------------------------------------------------------
// const isDigit = x => x >= '0' && x <= '9';
// const parseDigitWithLabel = satisfy(isDigit, 'digit');
// Parser.printResult(parseDigitWithLabel.parse('|ABC'));
