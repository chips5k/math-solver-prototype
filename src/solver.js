var TokenFactory = require('./token-factory');
function Solver(tokenFactory) {
    this.tokenFactory = tokenFactory
}

Solver.prototype.solveRpn = function(rpnTokenArray) {
    
    var stack = [];

    while(rpnTokenArray.length) {

        var token = rpnTokenArray.shift();

        if(token.definition.type !== TokenFactory.prototype.OPERATOR) {
            stack.push(token);
        } else {
            if(stack.length > 1) {

                var opA = stack.pop();
                var opB = stack.pop();

                if(opA.definition.type === 'number' && opB.definition.type === 'number') {
                    
                    var result = this.tokenFactory.createToken(token.evaluate(opB.value, opA.value));
                    stack = stack.concat(result);
                } else {
                    stack.push(opB, opA, token);
                }

            } else {
                throw("Invalid expression");
            }
        }
    }

    return stack;
}

module.exports = Solver;