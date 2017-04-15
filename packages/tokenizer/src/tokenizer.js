// @flow
import Token from './token';
import Location from './location';

export default class Tokenizer {
  constructor (input: string) {
    this.input = input;
    this.index = 0;
    this.buffer = '';
    this.line = 1;
    this.column = 0;
  }

  *tokens () {
    do {
      // Skip whitespace
      if (this.peek() === ' ') {
        continue;
      }
      yield(Token.of(this.peek(), Location.of(this.line, this.column)));
    } while (this.forward());
  }
  
  peek (offset: number = 0) {
    if ((this.index + offset) < this.input.length) {
      return this.input[this.index + offset];
    }
    else {
      throw new Error('Array Index Out of Bounds');
    }
  }
  
  forward (): boolean {
    if (this.index + 1 < this.input.length) {
      if (this.isNewLine(this.peek())) {
        this.line++;
      }
      this.index++;
      this.column++;
      return true;
    }
    return false;
  }
  
  isNewLine (char: string): boolean {
    return char === '\n';
  }
}
