// Success helper
// Convert an array to:
// {
//   lines: ['A'],
//   position: { 'column': 1, 'line': 0 }
// }
// `line` is third param here because most tests will run on line 0
export const _s = (value, lines, column, line = 0) => [
  value,
  { lines, position: { column, line } },
];

// Failure helper (pchar)
// `line` is last param here because most tests will run on line 0
export const _ec = (value, label, lines, column, line = 0) => [
  value,
  `Unexpected '${label}'`,
  [lines, line, column],
];
