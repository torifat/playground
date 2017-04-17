import Parser from './Parser';
import pchar from './pchar';

// match a specific string
// pstring :: TBD
export default str => Parser.sequence(str.split('').map(pchar))
    // convert Parser<[char]> to Parser<string>
    .map(arr => arr.join('')).setLabel(str);
