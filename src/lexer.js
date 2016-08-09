var TokenFactory = require('./token-factory');
function Lexer(tokenFactory) {

    
    this.tokenFactory = tokenFactory;
    

    //Define the regex patterns
    this.patterns = {
        number: '(?:[^0-9+\\-]?\\-)?[0-9]+(?:\\.[0-9]+)?',
        function: '(?:' + this.tokenFactory.getFunctionValues().join('|') + ')(?=\\()',
        constant: '(?:' + this.tokenFactory.getConstantValues().join('|') + ')',
        operator: '[\\' + this.tokenFactory.getOperatorValues().join('\\') + ']{1}',
        variable: '[a-z]'
    }
    

    //Build the final regex pattern
    this.pattern = new RegExp('(' + Object.keys(this.patterns).map((n) => { return this.patterns[n]; }).join(')|(') + ')', 'g');
}

Lexer.prototype.tokenize = function(expression) {

    var matches = {};
    var tokens = [];
    var lastToken = null;
    var currentToken = null;
    while(matches = this.pattern.exec(expression)) {
        
        
        currentToken = this.tokenFactory.createToken(matches[0]);
        if(lastToken && currentToken) {

            var isImplicit = true;

            if(currentToken.definition.type === TokenFactory.prototype.NUMBER && lastToken.definition.type === TokenFactory.prototype.NUMBER) {
                isImplicit = false;
            }

            if(currentToken.definition.type === TokenFactory.prototype.OPERATOR || lastToken.definition.type === TokenFactory.prototype.OPERATOR) {
                
                if(currentToken.value !== '(' && lastToken.value !== ')'){
                    isImplicit = false;
                }

            }

            if(isImplicit) {
                tokens.push(this.tokenFactory.createToken('*'));
            }
        }

        lastToken = currentToken;
        tokens.push(currentToken);
    }
    
    return tokens;
}

module.exports = Lexer;
