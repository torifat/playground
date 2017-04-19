import type Location from './location';

export default class Token {
  constructor(value: string, location: Location) {
    this.value = value;
    this.location = location;
  }

  static of(value: string, location: Location) {
    return new this(value, location);
  }

  inspect() {
    return `Token ${this.location} (${this.value})`;
  }
}
