var open = require("open");
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname+'/output-HTML/' )).listen(8080);

console.log('Server running at http://localhost:8080/');

open("http://localhost:8080/");