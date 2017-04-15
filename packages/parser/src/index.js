import Validation from 'data.validation';
const { Success, Failure } = Validation;

import Parser from './parser';
import pchar from './pchar';
import pstring from './pstring';
import pint from './pint';
import { choice, anyOf, range } from './helpers';

// -----------------------------------------------------------------------------
// const parseDigit = anyOf(range('0', '9'));
// const parseThreeDigits = parseDigit.andThen(parseDigit).andThen(parseDigit);
// const parseThreeDigitsAsStr = parseThreeDigits.map(([[c1, c2], c3]) => `${c1}${c2}${c3}`);
// const parseThreeDigitsAsInt = parseThreeDigitsAsStr.map(Number.parseInt);
// console.log(run(parseThreeDigits)('123A'));
// console.log(run(parseThreeDigitsAsStr)('123A'));
// console.log(run(parseThreeDigitsAsInt)('123A'));

// const parseA = pchar('A');
// const parseB = pchar('B');
// const parseC = pchar('C');
// const parsers = [parseA, parseB, parseC];
// const combined = Parser.sequence(parsers);
// console.log(combined.parse('ABCD'));

// const whitespaceChar = anyOf([' ', '\t', '\n']);
// const whitespace = whitespaceChar.many();

// console.log(whitespace.parse('ABC'));
// // Success ([], "ABC")
// console.log(whitespace.parse(' ABC'));
// // Success ([' '], "ABC")
// console.log(whitespace.parse('\tABC'));
// // Success (['\t'], "ABC")

// // define parser for one digit
// const digit = anyOf(range('0', '9'));
// 
// // define parser for one or more digits
// const digits = digit.many1();
// 
// console.log(digits.parse('1ABC'));;
// // Success (['1'], "ABC")
// console.log(digits.parse('12BC'));;
// // Success (['1'; '2'], "BC")
// console.log(digits.parse('123C'));;
// // Success (['1'; '2'; '3'], "C")
// console.log(digits.parse('1234'));;
// // Success (['1'; '2'; '3'; '4'], "")
// 
// console.log(digits.parse('ABC'));;
// // Failure "Expecting '9'. Got 'A'"

// console.log(pint.parse('1ABC'));
// console.log(pint.parse('12BC'));
// console.log(pint.parse('123C'));
// console.log(pint.parse('1234'));
// 
// console.log(pint.parse('ABC'));
// 
// const digit = anyOf(range('0', '9'));
// const digitThenSemicolon = digit.andThenLeft(pchar(';').opt());
// 
// // console.log(digitThenSemicolon.parse('1;').value[0][1].isJust);
// console.log(digitThenSemicolon.parse('1;'));
// // Success (('1', Some ';'), "")
// console.log(digitThenSemicolon.parse('1'));
// // Success (('1', None), "")

// const whitespaceChar = anyOf([' ', '\t', '\n']);
// const whitespace = whitespaceChar.many1();
// 
// const ab = pstring('AB');
// const cd = pstring('CD');
// const ab_cd = ab.andThenLeft(whitespace).andThen(cd);
// 
// console.log(ab_cd.parse('AB \t\nCD'));
// // Success (("AB", "CD"), "")

// const pdoublequote = pchar('"');
// const quotedInteger = pint.between(pdoublequote)(pdoublequote)
// 
// console.log(quotedInteger.parse('"1234"'));
// // Success (1234, "")
// console.log(quotedInteger.parse('1234'));
// // Failure "Expecting '"'. Got '1'"
