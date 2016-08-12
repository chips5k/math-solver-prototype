var TokenFactory = require('./src/token-factory.js');
var Lexer = require('./src/lexer.js');
var Parser = require('./src/parser.js');
var Solver = require('./src/solver.js');
var util = require('util');

var tokenFactory = new TokenFactory()
var lexer = new Lexer(tokenFactory);
var parser = new Parser(tokenFactory);
var solver = new Solver(tokenFactory);

var tokens = lexer.tokenize('3 + 2 * x - 53 * 5');
//console.log(tokens.map((i) => { return i.value; }));


var rpn = parser.toRpn(tokens.slice(0));
console.log(rpn.map((i) => { return i.value; }));

var solve = solver.solveRpn(rpn.slice(0));
console.log(solve.map((i) => { return i.value; }));

var tree = parser.toParseTree(rpn.slice(0));
// // solver.solveNode(tree);

console.log(parser.toString(tree));

