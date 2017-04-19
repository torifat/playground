import Position from './Position';
import Maybe from 'data.maybe';

const { Just, Nothing } = Maybe;

export default class InputState {
  constructor(lines, position) {
    this.lines = lines;
    this.position = position;
  }

  currentLine() {
    const { lines, position: { line } } = this;
    return line < lines.length ? lines[line] : 'EOF';
  }

  /// Get the next character from the input, if any
  /// else return None. Also return the updated InputState
  /// Signature: InputState -> InputState * char option
  nextChar() {
    const { lines, position: { line, column } } = this;
    // three cases
    // 1) if line >= maxLine ->
    //       return EOF
    // 2) if col less than line length ->
    //       return char at colPos, increment colPos
    // 3) if col at line length ->
    //       return NewLine, increment linePos
    if (line >= lines.length) {
      return [this, Nothing()];
    } else {
      const currentLine = this.currentLine();
      if (column < currentLine.length) {
        const char = currentLine[column];
        return [InputState.of(lines, this.position.incrCol()), Just(char)];
      } else {
        return [InputState.of(lines, this.position.incrLine()), Just('\n')];
      }
    }
  }

  getParserPosition() {
    const { line, column } = this.position;
    const currentLine = this.currentLine();
    return [currentLine, line, column];
  }

  static of(lines = [], position = Position.of()) {
    return new this(lines, position);
  }
}
