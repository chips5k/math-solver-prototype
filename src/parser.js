var TokenFactory = require('./token-factory');

function Parser(tokenFactory) {
    this.tokenFactory = tokenFactory;
}

Parser.prototype.toRpn = function(tokenArray) {

    tokenArray = tokenArray.slice(0);

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

    rpnTokenArray = rpnTokenArray.slice(0);

    var stack = [];

    var currentNode =  new Node();
    while(rpnTokenArray.length) {
        
        var token = rpnTokenArray.shift();
        if(token.definition.type === TokenFactory.prototype.OPERATOR) {
            if(currentNode.left) {
                currentNode = new Node(token.value, stack.pop().value, currentNode);
            } else {
                currentNode.value = token.value;
                currentNode.right = stack.pop().value;
                currentNode.left = stack.pop().value;
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