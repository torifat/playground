import Validation from 'data.validation';
const { Success, Failure } = Validation;

import Parser from './parser';

// pchar :: string -> Parser
export default chr => Parser.of(input => {
  if (!input) {
    return Failure(['No more input']);
  }
  else if (input[0] === chr) {
    return Success([chr, input.slice(1)]);
  } else {
    return Failure([`Expecting '${chr}'. Got '${input[0]}'`]);
  }
});
