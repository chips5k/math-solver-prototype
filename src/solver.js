var TokenFactory = require('./token-factory');

function Solver(tokenFactory) {
    this.tokenFactory = tokenFactory
}

Solver.prototype.solveRpn = function(rpnTokenArray) {
    
    var output = [];

    while(rpnTokenArray.length) {

        var token = rpnTokenArray.shift();

        if(token.definition.type !== TokenFactory.prototype.OPERATOR) {
            output.push(token);
        } else {
            if(output.length > 1) {

                var opA = output.pop();
                var opB = output.pop();

                if(opA.definition.type === 'number' && opB.definition.type === 'number') {
                    
                    var result = this.tokenFactory.createToken(token.evaluate(opB.value, opA.value));
                    output = output.concat(result);
                } else {
                    output.push(opB, opA, token);
                }

            } else {
                throw("Invalid expression");
            }
        }
    }

    return output;
}

Solver.prototype.solveNode = function(node) {

    if(node.left && node.left.constructor.name === 'Node') {
        this.solveNode(node.left);
    }

    if(node.right && node.right.constructor.name === 'Node') {
        this.solveNode(node.right);
    }
    
    if(node.left.value.definition === 'number' && node.right.value.definition === 'number') {
        node.value = this.tokenFactory.createToken(node.value.evaluate(node.left.value, node.right.value));
    }
    
}

Solver.prototype.evaluateNode = function(node) {

    if(node.left) {
        if(node.left.constructor.name === 'Node') {
            this.evaluateNode(node.left);
        } else {
            node.left = node.left.value;
        }
    }

    if(node.right) {
        if(node.right.constructor.name === 'Node') {
            
            this.evaluateNode(node.right);
        } else {
            
            node.right = node.right.value;
        }
    }
    
    node.value = node.value.value;
}

module.exports = Solver;