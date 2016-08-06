function Token(value, type, precedence, fn) {
    this.value = value;
    this.type = type;
    this.precedence =  precedence
    this.fn = (a, b) => { return false; };
    if(fn) {
        this.fn = fn;
    }
}

module.exports = Token;