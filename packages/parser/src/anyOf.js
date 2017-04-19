import pchar from './pchar';

// Choose any of a list of parsers
export const choice = listOfParsers =>
  listOfParsers.reduce((a, b) => a.orElse(b));

// Choose any of a list of characters
export default listOfChars =>
  choice(listOfChars.map(pchar)).setLabel(`anyOf ${listOfChars.join(', ')}`);
