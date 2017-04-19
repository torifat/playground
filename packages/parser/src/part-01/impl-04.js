/*
 * Implementation 4. Switching to a curried implementation
 * https://fsharpforfunandprofit.com/posts/understanding-parser-combinators/
 */

import Validation from 'data.validation';
const { Success, Failure } = Validation;

// pchar :: string -> string -> Result<[string, string], string>
const pchar = chr => str => {
  if (!str) {
    return Failure(['No more input']);
  } else if (str[0] === chr) {
    return Success([chr, str.slice(1)]);
  } else {
    return Failure([`Expecting '${chr}'. Got '${str[0]}'`]);
  }
};

const parseA = pchar('A');
const parseZ = pchar('Z');

let inputZBC = 'ABC';
console.log(parseA(inputZBC));

inputZBC = 'ZBC';
console.log(parseA(inputZBC));

inputZBC = 'ZBC';
console.log(parseZ(inputZBC));

inputZBC = null;
console.log(parseA(inputZBC));
