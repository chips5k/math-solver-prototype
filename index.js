var TokenFactory = require('./src/token-factory.js');
var Lexer = require('./src/lexer.js');
var Parser = require('./src/parser.js');
var Solver = require('./src/solver.js');

var tokenFactory = new TokenFactory()
var lexer = new Lexer(tokenFactory);
var parser = new Parser(tokenFactory);
var solver = new Solver(tokenFactory);

var tokens = lexer.tokenize('3 + 2 - 5 * 5');

var rpn = parser.toRpn(tokens);
console.log(rpn.map((i) => { return i.value; }));

var solve = solver.solveRpn(rpn);
console.log(solve.map((i) => { return i.value; }));

var tree = parser.toParseTree(rpn);

console.log(tree);

