var Lexer = require('./src/lexer.js');

var constants = ['pi'];
var functions = ['sin', 'cos', 'tan'];

var lexer = new Lexer(constants, functions);

var tokens = lexer.tokenize('(3 + 2) (5 + 4)');

var rpn = toRpn(tokens);
console.log(rpn.map((i) => { return i.value; }));

var solve = solveRpn(rpn);
console.log(solve.map((i) => { return i.value; }));

function toRpn(tokens) {

    var stack = [];
    var output = [];

    while(tokens.length) {
        var token = tokens.shift();

        if(token.definition.type === 'operator') {
            if(token.value === '(') {
                output = output.concat(toRpn(tokens));
            } else if (token.value === ')') {
                break;
            } else {
               
                if(stack.length > 0 && stack[0].definition.precedence > token.definition.precedence) {
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

        if(token.definition.type !== 'operator') {
            stack.push(token);
        } else {
            if(stack.length >= 2) {

                var opA = stack.pop();
                var opB = stack.pop();
            
                var result = lexer.createToken(token.evaluate(opB.value, opA.value));
                stack = stack.concat(result);
                

            } else {
                throw("Invalid expression");
            }
        }
    }

    return stack;
}