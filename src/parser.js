function Parser(lexer) {
    this.lexer = lexer;
}

Parser.prototype.toRpn = function(tokens) {

    var stack = [];
    var output = [];

    while(tokens.length) {
        var token = tokens.shift();

        if(token.definition.type === 'operator') {
            if(token.value === '(') {
                output = output.concat(this.toRpn(tokens));
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

Parser.prototype.solveRpn = function(tokens) {
    
    var stack = [];

    while(tokens.length) {

        var token = tokens.shift();

        if(token.definition.type !== 'operator') {
            stack.push(token);
        } else {
            if(stack.length >= 2) {

                var opA = stack.pop();
                var opB = stack.pop();
            
                var result = this.lexer.createToken(token.evaluate(opB.value, opA.value));
                stack = stack.concat(result);
                

            } else {
                throw("Invalid expression");
            }
        }
    }

    return stack;
}



module.exports = Parser;