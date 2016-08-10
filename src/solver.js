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
            if(stack.length >= 2) {

                var opA = stack.pop();
                var opB = stack.pop();
            
                var result = this.tokenFactory.createToken(token.evaluate(opB.value, opA.value));
                stack = stack.concat(result);
                

            } else {
                throw("Invalid expression");
            }
        }
    }

    return stack;
}

module.exports = Solver;