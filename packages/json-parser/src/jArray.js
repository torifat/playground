import { pchar, spaces } from '@playground/parser';

import { JArray } from './schema';
import jValue from './jValue';

const left = pchar('[').andThenLeft(spaces);
const right = pchar(']').andThenLeft(spaces);
const comma = pchar(',').andThenLeft(spaces);
let value = jValue.andThenLeft(spaces);

// Parse an JArray

// jArray
export default value
  .sepBy1(comma)
  .between(left)(right)
  .map(values => JArray.of(values))
  .setLabel('array');
