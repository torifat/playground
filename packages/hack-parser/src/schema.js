import chalk from 'chalk';
import { inspect } from 'util';

export class Token {
  static of(...args) {
    return new this(...args);
  }
}

export class ValuedToken extends Token {
  constructor(value) {
    super();
    this.value = value;
  }
}

export class Comment extends ValuedToken {
  [inspect.custom]() {
    return chalk`{bold.grey Comment} \t"${this.value}"`;
  }
}

export class AInstruction extends ValuedToken {
  [inspect.custom]() {
    return chalk`{bold.blue {italic A}-Instruction} \t${this.value}`;
  }
}
