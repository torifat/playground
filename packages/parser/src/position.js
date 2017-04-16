export default class Position {
  constructor (line, column) {
    this.line = line;
    this.column = column;
  }
  
  /// increment the column number
  incrCol () {
    const { line, column } = this;
    return Position.of(line, column + 1);
  }
  
  /// increment the line number and set the column to 0
  incrLine () {
    const { line, column } = this;
    return Position.of(line + 1, column);
  }
  
  static of (line = 0, column = 0) {
    return new this(line, column);
  }
}
