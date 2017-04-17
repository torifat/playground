import { satisfy } from './helpers';

// pchar :: string -> Parser
export default charToMatch =>
  satisfy(ch => ch === charToMatch, charToMatch)
