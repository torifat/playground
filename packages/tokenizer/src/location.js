export default class Location {
  constructor(row, column) {
    this.row = row;
    this.column = column;
  }

  static of(row, column) {
    return new this(row, column);
  }

  toString() {
    return `{${this.row}:${this.column}}`;
  }
}
