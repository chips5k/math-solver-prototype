function Token(value, definition) {
    this.value = value;
    this.definition = definition;
    this.evaluate = function() {
        return this.definition.evaluator.apply(this, arguments);
    }
}

function Lexer(definitions) {

    this.tokenDefinitions = {};
    
    //Operators
    this.tokenDefinitions[Lexer.prototype.OPERATOR] = {
        '^': {
            value: '^',
            precedence: 2,
            type: Lexer.prototype.OPERATOR,
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
            type: Lexer.prototype.OPERATOR,
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
            type: Lexer.prototype.OPERATOR,
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
            type: Lexer.prototype.OPERATOR,
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
            type: Lexer.prototype.OPERATOR,
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
            type: Lexer.prototype.OPERATOR,
            evaluator: () => {
                return this.value;
            }
        },
        '(': {
            value: '(',
            precedence: 0,
            type: Lexer.prototype.OPERATOR,
            evaluator: () => {
                return this.value;
            }
        },
        ')': {
            value: ')',
            precedence: 0,
            type: Lexer.prototype.OPERATOR,
            evaluator: () => {
                return this.value;
            }
        },
        ',': {
            value: ',',
            precedence: 0,
            type: Lexer.prototype.OPERATOR,
            evaluator: () => {
                return this.value;
            }
        }
    };

    //Numbers
    this.tokenDefinitions[Lexer.prototype.NUMBER] = {};
    this.tokenDefinitions[Lexer.prototype.NUMBER][Lexer.prototype.NUMBER] = {
        value: null,
        precedence: 0,
        type: Lexer.prototype.NUMBER,
        evaluator: () => {
            return this.value;
        }
    };

    //Variables
    this.tokenDefinitions[Lexer.prototype.VARIABLE] = {};
    this.tokenDefinitions[Lexer.prototype.VARIABLE][Lexer.prototype.VARIABLE] = {
        value: null,
        precedence: 0,
        type: Lexer.prototype.VARIABLE,
        evaluator: () => {
            return this.value;
        }
    };

    //Functions
    this.tokenDefinitions[Lexer.prototype.FUNCTION] = {
        sin: {
            value: 'sin',
            precedence: 0,
            type: Lexer.prototype.FUNCTION,
            evaluator: (n) => {
                var n = parseFloat(n);
                if(isNaN(n)) { throw 'Incorrect argument types'; }
                return Math.sin(n);
            }
        },
        cos: {
            value: 'cos',
            precedence: 0,
            type: Lexer.prototype.FUNCTION,
            evaluator: (n) => {
                var n = parseFloat(n);
                if(isNaN(n)) { throw 'Incorrect argument types'; }
                return Math.cos(n);
            }
        },
        tan: {
            value: 'tan',
            precedence: 0,
            type: Lexer.prototype.FUNCTION,
            evaluator: (n) => {
                var n = parseFloat(n);
                if(isNaN(n)) { throw 'Incorrect argument types'; }
                return Math.tan(n);
            }
        }
    };

    //Constants
    this.tokenDefinitions[Lexer.prototype.CONSTANT] = {
        pi: {
            value: 'pi',
            precedence: 0,
            type: Lexer.prototype.FUNCTION,
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
    var functions = Object.keys(this.tokenDefinitions[Lexer.prototype.FUNCTION]);
    var operators = Object.keys(this.tokenDefinitions[Lexer.prototype.OPERATOR]);
    var constants = Object.keys(this.tokenDefinitions[Lexer.prototype.CONSTANT]);

    //Define the regex patterns
    this.patterns = {
        number: '(?:[^0-9+\\-]?\\-)?[0-9]+(?:\\.[0-9]+)?',
        function: '(?:' + functions.join('|') + ')(?=\\()',
        constant: '(?:' + constants.join('|') + ')',
        operator: '[\\' + operators.join('\\') + ']{1}',
        variable: '[a-z]'
    }
    
    //Build the final regex pattern
    this.pattern = new RegExp('(' + Object.keys(this.patterns).map((n) => { return this.patterns[n]; }).join(')|(') + ')', 'g');
}

Lexer.prototype.OPERATOR = 'operator';
Lexer.prototype.VARIABLE = 'variable';
Lexer.prototype.NUMBER = 'number';
Lexer.prototype.FUNCTION = 'function';
Lexer.prototype.CONSTANT = 'constant';

Lexer.prototype.createToken = function(value) {

    //Look up the token definition by value
    var definition = this.tokenDefinitionMap.hasOwnProperty(value) ? this.tokenDefinitionMap[value] : null;
    
    if(!definition) {
        var numeric = !isNaN(parseFloat(value));
        if(!numeric) {
            definition = this.tokenDefinitionMap[Lexer.prototype.VARIABLE];
        } else {
            definition = this.tokenDefinitionMap[Lexer.prototype.NUMBER];
        }
    }
    
    return new Token(value, definition);

}

Lexer.prototype.tokenize = function(expression) {

    var matches = {};
    var tokens = [];
    var lastToken = null;
    var currentToken = null;
    while(matches = this.pattern.exec(expression)) {
        
        
        currentToken = this.createToken(matches[0]);
        if(lastToken && currentToken) {

            var isImplicit = true;

            if(currentToken.definition.type === Lexer.prototype.NUMBER && lastToken.definition.type === Lexer.prototype.NUMBER) {
                isImplicit = false;
            }

            if(currentToken.definition.type === Lexer.prototype.OPERATOR || lastToken.definition.type === Lexer.prototype.OPERATOR) {
                
                if(currentToken.value !== '(' && lastToken.value !== ')'){
                    isImplicit = false;
                }

            }

            if(isImplicit) {
                tokens.push(this.createToken('*'));
            }
        }

        lastToken = currentToken;
        tokens.push(currentToken);
    }
    
    return tokens;
}

module.exports = Lexer;
