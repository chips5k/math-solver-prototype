function Token(value, definition) {
    this.value = value;
    this.definition = definition;
    this.evaluate = function() {
        return this.definition.evaluator.apply(this, arguments);
    }
}

function TokenFactory(definitions) {
    
    this.tokenDefinitions = {};
    
    //Operators
    this.tokenDefinitions[TokenFactory.prototype.OPERATOR] = {
         '^': {
            value: '^',
            precedence: 2,
            type: TokenFactory.prototype.OPERATOR,
            evaluator: (a, b) => {
                a = parseFloat(a);
                b = parseFloat(b);
                if(isNaN(a) || isNaN(b)) { throw 'Incorrect argument types'; }
                return Math.pow(a, b);
            }
        },
        '/': {
            value: '/',
            precedence: 1,
            type: TokenFactory.prototype.OPERATOR,
            evaluator: (a, b) => {
                a = parseFloat(a);
                b = parseFloat(b);
                if(isNaN(a) || isNaN(b)) { throw 'Incorrect argument types'; }
                return a / b;
            }
        },
        '*': {
            value: '*',
            precedence: 1,
            type: TokenFactory.prototype.OPERATOR,
            evaluator: (a, b) => {
                a = parseFloat(a);
                b = parseFloat(b);
                if(isNaN(a) || isNaN(b)) { throw 'Incorrect argument types'; }
                return a * b;
            }
        },
        '-': {
            value: '-',
            precedence: 0,
            type: TokenFactory.prototype.OPERATOR,
            evaluator: (a, b) => {
                a = parseFloat(a);
                b = parseFloat(b);
                if(isNaN(a) || isNaN(b)) { throw 'Incorrect argument types'; }
                return a - b;
            }
        },
        '+': {
            value: '+',
            precedence: 0,
            type: TokenFactory.prototype.OPERATOR,
            evaluator: (a, b) => {
                a = parseFloat(a);
                b = parseFloat(b);
                if(isNaN(a) || isNaN(b)) { throw 'Incorrect argument types'; }
                return a + b;
            }
        },
        '=': {
            value: '=',
            precedence: 0,
            type: TokenFactory.prototype.OPERATOR,
            evaluator: () => {
                return this.value;
            }
        },
        '(': {
            value: '(',
            precedence: 0,
            type: TokenFactory.prototype.OPERATOR,
            evaluator: () => {
                return this.value;
            }
        },
        ')': {
            value: ')',
            precedence: 0,
            type: TokenFactory.prototype.OPERATOR,
            evaluator: () => {
                return this.value;
            }
        },
        ',': {
            value: ',',
            precedence: 0,
            type: TokenFactory.prototype.OPERATOR,
            evaluator: () => {
                return this.value;
            }
        }
    };

    //Numbers
    this.tokenDefinitions[TokenFactory.prototype.NUMBER] = {};
    this.tokenDefinitions[TokenFactory.prototype.NUMBER][TokenFactory.prototype.NUMBER] = {
        value: null,
        precedence: 0,
        type: TokenFactory.prototype.NUMBER,
        evaluator: () => {
            return this.value;
        }
    };

    //Variables
    this.tokenDefinitions[TokenFactory.prototype.VARIABLE] = {};
    this.tokenDefinitions[TokenFactory.prototype.VARIABLE][TokenFactory.prototype.VARIABLE] = {
        value: null,
        precedence: 0,
        type: TokenFactory.prototype.VARIABLE,
        evaluator: () => {
            return this.value;
        }
    };

    //Functions
    this.tokenDefinitions[TokenFactory.prototype.FUNCTION] = {
        sin: {
            value: 'sin',
            precedence: 0,
            type: TokenFactory.prototype.FUNCTION,
            evaluator: (n) => {
                var n = parseFloat(n);
                if(isNaN(n)) { throw 'Incorrect argument types'; }
                return Math.sin(n);
            }
        },
        cos: {
            value: 'cos',
            precedence: 0,
            type: TokenFactory.prototype.FUNCTION,
            evaluator: (n) => {
                var n = parseFloat(n);
                if(isNaN(n)) { throw 'Incorrect argument types'; }
                return Math.cos(n);
            }
        },
        tan: {
            value: 'tan',
            precedence: 0,
            type: TokenFactory.prototype.FUNCTION,
            evaluator: (n) => {
                var n = parseFloat(n);
                if(isNaN(n)) { throw 'Incorrect argument types'; }
                return Math.tan(n);
            }
        }
    };

    //Constants
    this.tokenDefinitions[TokenFactory.prototype.CONSTANT] = {
        pi: {
            value: 'pi',
            precedence: 0,
            type: TokenFactory.prototype.FUNCTION,
            evaluator: () => {
                return Math.PI;
            }
        }
    };

    
    //Extend the definitions with any user supplied definitions
    this.tokenDefinitions = Object.assign(this.tokenDefinitions, definitions);

    this.tokenDefinitionMap = {};

    for(td in this.tokenDefinitions) {
        Object.assign(this.tokenDefinitionMap, this.tokenDefinitions[td]);
    }

    //Retrieve the token values for use in our regex
    var functions = Object.keys(this.tokenDefinitions[TokenFactory.prototype.FUNCTION]);
    var operators = Object.keys(this.tokenDefinitions[TokenFactory.prototype.OPERATOR]);
    var constants = Object.keys(this.tokenDefinitions[TokenFactory.prototype.CONSTANT]);
}


TokenFactory.prototype.OPERATOR = 'operator';
TokenFactory.prototype.VARIABLE = 'variable';
TokenFactory.prototype.NUMBER = 'number';
TokenFactory.prototype.FUNCTION = 'function';
TokenFactory.prototype.CONSTANT = 'constant';

TokenFactory.prototype.getFunctionValues = function() {
    return Object.keys(this.tokenDefinitions[TokenFactory.prototype.FUNCTION]);
    
}

TokenFactory.prototype.getConstantValues = function() {
    return Object.keys(this.tokenDefinitions[TokenFactory.prototype.CONSTANT]);
}

TokenFactory.prototype.getOperatorValues = function() {
    return Object.keys(this.tokenDefinitions[TokenFactory.prototype.OPERATOR]);
}   

TokenFactory.prototype.createToken = function(value) {

    //Look up the token definition by value
    var definition = this.tokenDefinitionMap.hasOwnProperty(value) ? this.tokenDefinitionMap[value] : null;
    
    if(!definition) {
        var numeric = !isNaN(parseFloat(value));
        if(!numeric) {
            definition = this.tokenDefinitionMap[TokenFactory.prototype.VARIABLE];
        } else {
            definition = this.tokenDefinitionMap[TokenFactory.prototype.NUMBER];
        }
    }
    
    return new Token(value, definition);

}



module.exports = TokenFactory;