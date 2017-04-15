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
  
  andThen (anotherParser) {
    return Parser.of(str => this.parse(str).cata({
      Failure: Failure,
      Success: ([value1, remaining1]) => anotherParser.parse(remaining1).cata({
        Failure: Failure,
        Success: ([value2, remaining2]) => Success([[value1, value2], remaining2])
      })
    }));
  }

  orElse (anotherParser) {
    return Parser.of(str => this.parse(str).orElse(() => anotherParser.parse(str)));
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
const parseB = pchar('B');
const parseC = pchar('C');

const parseAThenB = parseA.andThen(parseB);
const parseAOrElseB = parseA.orElse(parseB);
const parseBOrElseC = parseB.orElse(parseC);
const parseAAndThenBorC = parseA.andThen(parseBOrElseC);

console.log('andThen');

let input = 'ABC';
console.log(run(parseAThenB)(input));
// Success (('A', 'B'), "C")

input = 'ZBC';
console.log(run(parseAThenB)(input));
// Failure "Expecting 'A'. Got 'Z'"

input = 'AZC';
console.log(run(parseAThenB)(input));
// Failure "Expecting 'B'. Got 'Z'"

input = null;
console.log(run(parseAThenB)(input));


console.log('orElse');

input = 'AZZ';
console.log(run(parseAOrElseB)(input));
// Success ('A', "ZZ")

input = 'BZZ';
console.log(run(parseAOrElseB)(input));
// Failure "Expecting 'A'. Got 'Z'"

input = 'CZZ';
console.log(run(parseAOrElseB)(input));
// Failure "Expecting 'B'. Got 'Z'"

input = null;
console.log(run(parseAOrElseB)(input));


console.log('andThenOr');

input = 'ABZ';
console.log(run(parseAAndThenBorC)(input));
// Success ('A', "ZZ")

input = 'ACZ';
console.log(run(parseAAndThenBorC)(input));
// Failure "Expecting 'A'. Got 'Z'"

input = 'QBZ';
console.log(run(parseAAndThenBorC)(input));
// Failure "Expecting 'B'. Got 'Z'"

input = 'AQZ';
console.log(run(parseAAndThenBorC)(input));


// Choose any of a list of parsers
const choice = listOfParsers => listOfParsers.reduce((a, b) => a.orElse(b));

// Choose any of a list of characters
const anyOf = listOfChars => choice(listOfChars.map(pchar));

console.log(run(anyOf(['a', 'b', 'c']))('aBC'));
console.log(run(anyOf(['a', 'b', 'c']))('ABC'));
