var fs = require('fs');

var DOMParser = require('xmldom').DOMParser;

var inspect = require('eyes').inspector({maxLength: false})


///load 
var xmlFile = fs.readFileSync(__dirname + '/contents.xml', "utf8");


//parse
var doc = new DOMParser().parseFromString(xmlFile, 'text/xml');
//doc.documentElement.setAttribute('x','y');
//doc.documentElement.setAttributeNS('./lite','c:x','y2');
//var nsAttr = doc.documentElement.getAttributeNS('./lite','x');
//console.info(nsAttr)
console.log(doc);



//build html
function buildHtml(req) {
	var title = doc.getElementsByTagName('carpeta_titulo')[0].childNodes[0].nodeValue;

	//var autor_nombre = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;
	//var autor_bio = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;
	
	var introduccion = doc.getElementsByTagName('introduccion')[0];

	var unidades = doc.getElementsByTagName('unidad');


	var header = 'hhh';
	var body = doc;
	
	var footer = 'fff';
	return '<!DOCTYPE html>'+'<html><head><meta charset="utf8"/><title>'+title+'</title></head><header>' + header + '</header><body>' + introduccion + '</body><footer>' + unidades[0] + '</footer></html>';
};


///WRITE HTML
var fileName = 'output/test.html';
var stream = fs.createWriteStream(fileName);

stream.once('open', function(fd) {
	var html = buildHtml();
	stream.end(html);
});

