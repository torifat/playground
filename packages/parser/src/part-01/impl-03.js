/*
 * Implementation 3. Returning a Success/Failure
 * https://fsharpforfunandprofit.com/posts/understanding-parser-combinators/
 */

import Validation from 'data.validation';
const { Success, Failure } = Validation;

// pchar :: (string, string) -> Result<[string, string], string>
const pchar = (chr, str) => {
  if (!str) {
    return Failure(['No more input']);
  } else if (str[0] === chr) {
    return Success([chr, str.slice(1)]);
  } else {
    return Failure([`Expecting '${chr}'. Got '${str[0]}'`]);
  }
};

let inputZBC = 'ABC';
console.log(pchar('A', inputZBC));

inputZBC = 'ZBC';
console.log(pchar('A', inputZBC));

inputZBC = 'ZBC';
console.log(pchar('Z', inputZBC));

inputZBC = null;
console.log(pchar('A', inputZBC));
