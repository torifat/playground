import pstring from '../pstring';

import { JBool } from './schema';

// Bool
const jtrue = pstring('true').map(() => JBool.of(true));
const jfalse = pstring('false').map(() => JBool.of(false));

// jBool
export default jtrue.orElse(jfalse).setLabel('bool');
