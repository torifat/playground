import pchar from './pchar';
import { choice } from './helpers';

// Choose any of a list of characters
export default listOfChars =>
  choice(listOfChars.map(pchar)).setLabel(`anyOf ${listOfChars.join(', ')}`);
