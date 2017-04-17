/*
 * Implementation 5. Encapsulating the parsing function in a typea
 * https://fsharpforfunandprofit.com/posts/understanding-parser-combinators/
 */

import Validation from 'data.validation';
const { Success, Failure } = Validation;

class Parser {
  constructor (fn) {
    this.fn = fn;
  }

  static of (fn) {
    return new this(fn);
  }

  parse (str) {
    return this.fn(str);
  }
}

// pchar :: string -> Parser
const pchar = chr => Parser.of(str => {
  if (!str) {
    return Failure(['No more input']);
  }
  else if (str[0] === chr) {
    return Success([chr, str.slice(1)]);
  } else {
    return Failure([`Expecting '${chr}'. Got '${str[0]}'`]);
  }
});

// run :: Parser -> Result<[string, string], string>
const run = parser => parser.parse.bind(parser);

const parseA = pchar('A');
const parseZ = pchar('Z');

let inputZBC = 'ABC';
console.log(run(parseA)(inputZBC));

inputZBC = 'ZBC';
console.log(run(parseA)(inputZBC));

inputZBC = 'ZBC';
console.log(run(parseZ)(inputZBC));

inputZBC = null;
console.log(run(parseA)(inputZBC));
