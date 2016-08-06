var Lexer = require('./src/lexer.js');
var Token = require('./src/token.js');

var constants = ['pi'];
var functions = ['sin', 'cos', 'tan'];

var lexer = new Lexer(constants, functions);

var tokens = lexer.tokenize('10*((2+4)*3)');


var rpn = toRpn(tokens);
console.log(rpn.map((i) => { return i.value; }));

var solve = solveRpn(rpn);
console.log(solve.map((i) => { return i.value; }));

function toRpn(tokens) {

    var stack = [];
    var output = [];

    while(tokens.length) {
        var token = tokens.shift();

        if(token.type === 'operator') {
            if(token.value === '(') {
                output = output.concat(toRpn(tokens));
            } else if (token.value === ')') {
                break;
            } else {
                if(stack.length > 0 && stack[0].precedence > token.precedence) {
                    output.push(stack.shift());
                }

                stack.push(token);
            }
        } else {
            output.push(token);
        }        
    }
    
    return output.concat(stack.reverse());
}

function solveRpn(tokens) {
    
    var stack = [];

    while(tokens.length) {

        var token = tokens.shift();

        if(token.type !== 'operator') {
            stack.push(token);
        } else {
            if(stack.length >= 2) {

                var opA = stack.pop();
                var opB = stack.pop();
                var t = new Token(token.fn(opB.value, opA.value));
               
                stack.push(t);

            } else {
                throw("Invalid expression");
            }
        }
    }
    return stack;
}