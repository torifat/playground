import Validation from 'data.validation';
import Maybe from 'data.maybe';

import InputState from './InputState';

const { Success, Failure } = Validation;
const { Just, Nothing } = Maybe;

export default class Parser {
  constructor (parseFn, label) {
    this.parseFn = parseFn;
    this.label = label;
  }

  // Update the label in the parser
  setLabel (label) {
    this.label = label;
    return this;
  }

  // Update the label in the parser
  getLabel () {
    return this.label;
  }

  parse (input) {
    return this.runOnInput(this.fromStr(input));
  }

  runOnInput (input) {
    return this.parseFn(input);
  }

  fromStr (str) {
    return str ? InputState.of(str.split(['\r\n', '\n'])) : InputState.of();
  }

  parseZeroOrMore (input) {
    return this.runOnInput(input).cata({
      Failure: () => [[], input],
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
    return this.bind(head => this.many().bind(tail =>
      Parser.return([head, ...tail])));
    // old implementation without bind
    // return Parser.of(input => this.parse(input).cata({
    //   Failure: Failure,
    //   Success: ([firstValue, inputAfterFirstParse]) => {
    //     // if first found, look for zeroOrMore now
    //     const [subsequentValues, remainingInput] =
    //       this.parseZeroOrMore(inputAfterFirstParse);
    //     return Success([[firstValue, ...subsequentValues], remainingInput]);
    //   }
    // }));
  }

  andThen (otherParser) {
    const label = `${this.getLabel()} andThen ${otherParser.getLabel}`;
    return this.bind(p1Result => otherParser.bind(p2Result =>
      Parser.return([p1Result, p2Result]))).setLabel(label);
    // old implementation without bind
    // return Parser.of(input => this.parse(input).cata({
    //   Failure: Failure,
    //   Success: ([value1, remaining1]) => otherParser.parse(remaining1).cata({
    //     Failure: Failure,
    //     Success: ([value2, remaining2]) => Success([[value1, value2], remaining2])
    //   })
    // }));
  }

  orElse (otherParser) {
    const label = `${this.getLabel()} orElse ${otherParser.getLabel}`;
    return Parser.of(str =>
      this.runOnInput(str).orElse(() => otherParser.runOnInput(str)), label);
  }

  // :: f:(A -> B) -> Parser<A> -> Parser<B>
  map (f) {
    return this.bind(x => Parser.return(f(x)));
    // old implementation without bind
    // return Parser.of(input => this.parse(input).map(
    //   ([value, remaining]) => [f(value), remaining]
    // ));
  }

  // apply a wrapped function to a wrapped value
  // :: Parser<(A -> B)> -> Parser<A> -> Parser<B>
  apply (otherParser) {
    return this.bind(f => otherParser.bind(x => Parser.return(f(x))));
    // old implementation without bind
    // return this.andThen(otherParser).map(([f, x]) => f(x));
  }

  opt () {
    return this.map(Just).orElse(Parser.return(Nothing()));
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

  // Parses one or more occurrences of p separated by sep
  sepBy1 (sepParser) {
    return this.andThen(sepParser.andThenRight(this).many())
      .map(([a, arr]) => [a, ...arr]);
  }

  // Parses zero or more occurrences of p separated by sep
  sepBy (sepParser) {
    return this.sepBy1(sepParser).orElse(Parser.return([]));
  }

  // "bind" takes a parser-producing function f, and a parser p
  // and passes the output of p into f, to create a new parser
  // :: f:(A -> Parser<B>) -> Parser<A> -> Parser<B>
  bind (f) {
    return Parser.of(input => this.runOnInput(input).cata({
      // return error from parser1
      Failure: Failure,
      Success: ([value1, remainingInput]) =>
        f(value1).runOnInput(remainingInput)
    }), this.label);
  }

  static of (fn, label = 'unknown') {
    return new this(fn, label);
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
  }
}
