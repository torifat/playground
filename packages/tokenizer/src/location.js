export default class Location {
  constructor(row: number, column: number) {
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
