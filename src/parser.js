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
    var currentNode = null;
    while(rpnTokenArray.length) {

        var currentToken = rpnTokenArray.shift();

        if(currentToken.definition.type !== TokenFactory.prototype.OPERATOR) {
            stack.push(currentToken);
        } else {

            if(stack.length > 1) {
                var b = stack.pop();
                var a = stack.pop();
                
                currentNode = new Node(currentToken, a, b);
                stack.push(currentNode);
            }
        }
    }    

    return currentNode;

}

Parser.prototype.toString = function(node) {

    
    var string = '';

    if(node.left) {
        string += '(';
        string += this.toString(node.left);
    }

    if(node.constructor.name === 'Node') {
        string += node.value.value;
    } else if(node.constructor.name === 'Token') {
        string += node.value;
    }

    if(node.right) {
        string += this.toString(node.right);
        string += ')';
    }

    return string;
    
    
}

function Node(value, left, right) {
    this.value = value ? value : null;
    this.left = left ? left : null;
    this.right = right ? right : null;
}

module.exports = Parser;