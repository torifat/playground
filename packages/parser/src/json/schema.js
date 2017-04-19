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

export class JNull extends Token {}
export class JBool extends ValuedToken {}
export class JString extends ValuedToken {}
export class JNumber extends ValuedToken {}
export class JArray extends ValuedToken {}
export class JObject extends ValuedToken {}
