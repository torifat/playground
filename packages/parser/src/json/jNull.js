import pstring from '../pstring';

import { JNull } from './schema';

// jNull
export default pstring('null').map(() => JNull.of()).setLabel('null');
