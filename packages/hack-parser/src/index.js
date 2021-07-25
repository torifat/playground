/*
<expr> ::= <a_instruction> | <c_instruction> | <comment>
<comment> ::= "//" [a-z]*
<a_instruction> ::= "@" ([1-9] [0-9]* | <symbol>)
<c_instruction> ::= <dest> "=" <comp>  ";" <jump> | <dest> "=" <comp> | <comp>  ";" <jump>

<symbol> ::= [a-z]+ | "R" [0-9] | [A-Z]+
<dest> ::= "A" | "D" | "M" | "AD" | "AM" | "DM" | "ADM"
<comp> ::= "0" | "1" | "-1" 
			| <dest> 
            | "!" <dest> 
            | "-" <dest> 
            | <dest> "+" <dest> 
            | <dest> "-" <dest>
            | <dest> "&" <dest>
            | <dest> "|" <dest>
<jump> ::= "JEQ" | "JLE" | "JGE" | "JGT"
*/

import { printResult, choice, until, any } from '@playground/parser';
import { aInstruction } from './AInstruction';
import { comment } from './Comment';

const hack = choice([aInstruction, comment, until('\n'), any]).many();

printResult(
  hack.parse(`
// hello
// world
@12
`)
);
