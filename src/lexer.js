var Token = require('./token.js');

function Lexer(constants, functions) {

    this._predefinedTokens = {
        constants: constants,
        functions: functions,
        operators: ['+', '-', '/', '*', '^', '=', '(', ')']
    };

    this._precedenceMap = {
        '^': 3,
        '/': 2,
        '*': 2,
        '-': 1,
        '+': 1
    }

    this._functionMap = {
        '^': (a, b) => { return Math.pow(parseFloat(a), parseFloat(b));  },
        '/': (a, b) => { return parseFloat(a) / parseFloat(b);  },
        '*': (a, b) => { return parseFloat(a) * parseFloat(b); },
        '-': (a, b) => { return parseFloat(a) - parseFloat(b); },
        '+': (a, b) => { return parseFloat(a) + parseFloat(b); }
    };

    this._patterns = {
        numeric: '(?:[^0-9+\\-]?\\-)?[0-9]+(?:\\.[0-9]+)?',
        function: '(?:' + this._predefinedTokens.functions.join('|') + ')(?=\\()',
        constant: '(?:' + this._predefinedTokens.constants.join('|') + ')',
        operator: '[' + this._predefinedTokens.operators.join('\\') + ']{1}',
        variable: '[a-z]'
    }

    this._pattern = new RegExp('(' + Object.keys(this._patterns).map((n) => { return this._patterns[n]; }).join(')|(') + ')', 'g');
}

Lexer.prototype.tokenize = function(expression) {

    var matches = {};
    var tokens = [];
    var lastToken = null;
    var currentToken = null;

    while(matches = this._pattern.exec(expression)) {
        
        var type = null;
        for(var i = 1; i < matches.length; i++) {
            if(matches[i]) {
                type = Object.keys(this._patterns)[i - 1];
                break;
            }
        }

        currentToken = new Token(matches[0], type, this._precedenceMap[matches[0]], this._functionMap[matches[0]]);
        
        if(lastToken && currentToken) {

            var isImplicit = true;

            if(currentToken.type === 'numeric' && lastToken.type === 'numeric') {
                isImplicit = false;
            }

            if(currentToken.type === 'operator' || lastToken.type === 'operator') {
                isImplicit = false;
            }

            if(isImplicit) {
                tokens.push(new Token('*', 'operator', this._precedenceMap['*'], this._functionMap['*']));
            }
        }

        lastToken = currentToken;
        tokens.push(currentToken);
    }
    
    return tokens;
}

module.exports = Lexer;
