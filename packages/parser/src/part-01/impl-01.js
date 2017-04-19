/*
 * Implementation 1. Parsing a hard-coded character
 * https://fsharpforfunandprofit.com/posts/understanding-parser-combinators/
 */

// A_Parser :: string -> [bool, string]
const A_Parser = str => {
  if (!str) {
    return [false, ''];
  } else if (str[0] === 'A') {
    return [true, str.slice(1)];
  } else {
    return [false, str];
  }
};

let inputZBC = 'ABC';
console.log(A_Parser(inputZBC));

inputZBC = 'ZBC';
console.log(A_Parser(inputZBC));

inputZBC = null;
console.log(A_Parser(inputZBC));
