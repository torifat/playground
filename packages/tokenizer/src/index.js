import Tokenizer from './tokenizer';

const t = new Tokenizer(' `hel`lo\n    world');

for (let token of t.tokens()) {
  console.log(token);
}
