var TokenFactory = require('./token-factory');

function Parser(tokenFactory) {
    this.tokenFactory = tokenFactory;
}

Parser.prototype.toRpn = function(tokenArray) {

    var stack = [];
    var output = [];

    while(tokenArray.length) {
        var token = tokenArray.shift();

        if(token.definition.type === 'operator') {
            if(token.value === '(') {
                output = output.concat(this.toRpn(tokenArray));
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


Parser.prototype.toParseTree = function(rpnTokenArray) {

}

Parser.prototype.toString = function(parseTree) {

}

module.exports = Parser;