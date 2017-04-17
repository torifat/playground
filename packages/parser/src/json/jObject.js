import pchar from '../pchar';
import { spaces } from '../helpers';

import { JObject } from './schema';
import { quotedString } from './jString';
import jValue from './jValue';

// set up the "primitive" parsers
const left = pchar('{').andThenLeft(spaces);
const right = pchar('}').andThenLeft(spaces);
const colon = pchar(':').andThenLeft(spaces);
const comma = pchar(',').andThenLeft(spaces);
const key = quotedString.andThenLeft(spaces);
const value = jValue.andThenLeft(spaces);

// set up the list parser
const keyValue = key.andThenLeft(colon).andThen(value);
const keyValues = keyValue.sepBy1(comma);

// set up the main parser
// jObject
export default keyValues.between(left)(right)
.map(values => new Map(values))
.map(values => JObject.of(values)).setLabel('object');
