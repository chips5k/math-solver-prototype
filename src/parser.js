var TokenFactory = require('./token-factory');

function Parser(tokenFactory) {
    this.tokenFactory = tokenFactory;
}

Parser.prototype.toRpn = function(tokenArray) {

    var stack = [];
    var output = [];

    while(tokenArray.length) {
        var token = tokenArray.shift();

        if(token.definition.type === TokenFactory.prototype.OPERATOR) {
            if(token.value === '(') {
                output = output.concat(this.toRpn(tokenArray));
            } else if (token.value === ')') {
                break;
            } else {
               
                if(stack.length > 0 && stack[0].definition.precedence >= token.definition.precedence) {
                    output = output.concat(stack.reverse());
                    stack.length = 0;
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

    var stack = [];

    var currentNode =  new Node();
    while(rpnTokenArray.length) {
        
        var token = rpnTokenArray.shift();
        if(token.definition.type === TokenFactory.prototype.OPERATOR) {
            if(currentNode.left) {
                currentNode = new Node(token, stack.pop(), currentNode);
            } else {
                currentNode.value = token;
                currentNode.right = stack.pop();
                currentNode.left = stack.pop();
            }

        } else {
            stack.push(token);
        }
    }

    return currentNode;
}

Parser.prototype.toString = function(parseTree) {

    
}

function Node(value, left, right) {
    this.value = value ? value : null;
    this.left = left ? left : null;
    this.right = right ? right : null;
}

module.exports = Parser;