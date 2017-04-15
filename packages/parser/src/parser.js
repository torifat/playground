import Validation from 'data.validation';
import Maybe from 'data.maybe';

const { Success, Failure } = Validation;

export default class Parser {
  constructor (fn) {
    this.fn = fn;
  }

  parse (input) {
    return this.fn(input);
  }
  
  parseZeroOrMore (input) {
    return this.parse(input).cata({
      Failure: _ => [[], input],
      Success: ([firstValue, inputAfterFirstParse]) => {
        // if parse succeeds, call recursively to get the subsequent values
        const [subsequentValues, remainingInput] = 
          this.parseZeroOrMore(inputAfterFirstParse);
        return [[firstValue, ...subsequentValues], remainingInput];
      }
    });
  }
  
  // match zero or more occurences of the specified parser
  // :: Parser<A> -> Parser<[A]>
  many () {
    // parse the input -- wrap in Success as it always succeeds
    return Parser.of(input => Success(this.parseZeroOrMore(input)));
  }
  
  // match one or more occurences of the specified parser
  // :: Parser<A> -> Parser<[A]>
  many1 () {
    return Parser.of(input => this.parse(input).cata({
      Failure: Failure,
      Success: ([firstValue, inputAfterFirstParse]) => {
        // if first found, look for zeroOrMore now
        const [subsequentValues, remainingInput] = 
          this.parseZeroOrMore(inputAfterFirstParse);
        return Success([[firstValue, ...subsequentValues], remainingInput]);
      }
    }));
  }
  
  andThen (otherParser) {
    return Parser.of(input => this.parse(input).cata({
      Failure: Failure,
      Success: ([value1, remaining1]) => otherParser.parse(remaining1).cata({
        Failure: Failure,
        Success: ([value2, remaining2]) => Success([[value1, value2], remaining2])
      })
    }));
  }

  orElse (otherParser) {
    return Parser.of(str => this.parse(str).orElse(() => otherParser.parse(str)));
  }
  
  // :: f:(A -> B) -> Parser<A> -> Parser<B>
  map (f) {
    return Parser.of(input => this.parse(input).map(
      ([value, remaining]) => [f(value), remaining]
    ));
  }
  
  // :: Parser<(A -> B)> -> Parser<A> -> Parser<B>
  apply (otherParser) {
    return this.andThen(otherParser).map(([f, x]) => f(x));
  }
  
  opt () {
    return this.map(Maybe.Just).orElse(Parser.return(Maybe.Nothing()));
  }
  
  // Keep only the result of the left side parser
  // .>>
  andThenLeft (otherParser) {
    return this.andThen(otherParser).map(([a, ]) => a);
  }

  // Keep only the result of the left side parser
  // >>.
  andThenRight (otherParser) {
    return this.andThen(otherParser).map(([, b]) => b);
  }
  
  between (leftParser) {
    return rightParser =>
      leftParser.andThenRight(this).andThenLeft(rightParser);
  }

  static of (fn) {
    return new this(fn);
  }
  
  // :: A -> Parser<A>
  static return (value) {
    return Parser.of(input => Validation.of([value, input]));
  }

  // :: f:(A -> B -> C) -> Parser<A> -> Parser<B> -> Parser<C>
  static lift2 (f) {
    return otherParser => anotherParser => 
      Parser.return(f).apply(otherParser).apply(anotherParser);
  }
  
  // :: [Parser<A>] -> Parser<[A]>
  static sequence (list) {
    const cons = head => tail => [head, ...tail];
    const consP = Parser.lift2(cons);

    if (!list || list.length === 0) {
      return Parser.return([]);
    }
    const [head, ...tail] = list;
    return consP(head)(Parser.sequence(tail));
  };
}
