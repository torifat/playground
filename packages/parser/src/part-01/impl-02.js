/*
 * Implementation 2. Parsing a specified character
 * https://fsharpforfunandprofit.com/posts/understanding-parser-combinators/
 */

// pchar :: (string, string) -> [string, string]
const pchar = (chr, str) => {
  if (!str) {
    return ['No more input', ''];
  } else if (str[0] === chr) {
    return [`Found ${chr}`, str.slice(1)];
  } else {
    return [`Expecting '${chr}'. Got '${str[0]}'`, str];
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
