var Lexer = require('./src/lexer.js');
var Parser = require('./src/parser.js');
var constants = ['pi'];
var functions = ['sin', 'cos', 'tan'];

var lexer = new Lexer(constants, functions);
var parser = new Parser(lexer);

var tokens = lexer.tokenize('(3 + 2) (5 + 4)');

var rpn = parser.toRpn(tokens);
console.log(rpn.map((i) => { return i.value; }));

var solve = parser.solveRpn(rpn);
console.log(solve.map((i) => { return i.value; }));

