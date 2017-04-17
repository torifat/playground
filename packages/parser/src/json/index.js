import jNull from './jNull';
import jBool from './jBool';
import jString from './jString';
import jNumber from './jNumber';
import jArray from './jArray';
import jObject from './jObject';
import jValue from './jValue';
import { printResult } from '../helpers';
import { choice } from '../anyOf';

jValue.ref.parser = choice([
  jNull, jBool, jNumber, jString, jArray, jObject
]);

const example1 = `{
  "name" : "Scott",
  "isMale" : true,
  "bday" : {"year":2001, "month":12, "day":25 },
  "favouriteColors" : ["blue", "green"]
}`;

const example2 = `{"widget": {
    "debug": "on",
    "window": {
        "title": "Sample Konfabulator Widget",
        "name": "main_window",
        "width": 500,
        "height": 500
    },
    "image": {
        "src": "Images/Sun.png",
        "name": "sun1",
        "hOffset": 250,
        "vOffset": 250,
        "alignment": "center"
    },
    "text": {
        "data": "Click Here",
        "size": 36,
        "style": "bold",
        "name": "text1",
        "hOffset": 250,
        "vOffset": 100,
        "alignment": "center",
        "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
    }
}}`;

// printResult(jValue.parse(example1));
printResult(jValue.parse(example2));
