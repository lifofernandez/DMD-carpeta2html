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
//console.log(doc);



//build html
function buildIndex() {
	var title = doc.getElementsByTagName('carpeta_titulo')[0].childNodes[0].nodeValue;

	//var autor_nombre = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;
	//var autor_bio = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;
	
	var introduccion = doc.getElementsByTagName('introduccion')[0];

	var unidades = doc.getElementsByTagName('unidad');

	var mainIndex = generarIndicieUnidades(unidades);

	var head = '<head><meta charset="utf8"/><title>'+title+'</title></head>';
	var header = '<header>' + title + '</header>';
	var body = '<body>'+ mainIndex+introduccion+'</body>';
	var footer = 'Dmd / UVQ';

	return '<!DOCTYPE html><html>'+head+header+body+footer+'</html>';
};

///WRITE HTML
var fileName = 'output/index.html';
var stream = fs.createWriteStream(fileName);

stream.once('open', function(fd) {
	var html = buildIndex();
	stream.end(html);
});


function generarIndicieUnidades(unidades){
	//UNIDADES ITERATOR
	var indiceUnidades = '<ol>';
	for (var i=0; i < unidades.length; i++) {

		var unidad_titulo = unidades[i].getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue;
		var unidadUrl = 'unidad-'+(i+1);
		generarPaginaUnidad(unidades[i], unidadUrl);
		
		///APARTADOS
		var apartados = unidades[i].getElementsByTagName('apartado');
		var indiceApartados = '';
		if(apartados.length > 0){
			indiceApartados = '<ol>';
			for (var e=0; e < apartados.length; e++) {
				
					var apartado_titulo = apartados[e].getElementsByTagName('apartado_titulo')[0].childNodes[0].nodeValue;
			
						///SUBAPARTADOS
						var subapartados = apartados[e].getElementsByTagName('subapartado');
						var indiceSubapartado = '';
						if(subapartados.length > 0){
							indiceSubapartado = '<ol>';
							for (var o=0; o < subapartados.length; o++) {
								
									var subapartado_titulo = subapartados[o].getElementsByTagName('subapartado_titulo')[0].childNodes[0].nodeValue;

									var itemSubapartado = '<li>'+subapartado_titulo+'</li>';
									indiceSubapartado = indiceSubapartado+itemSubapartado;
								
							}
							indiceSubapartado=indiceSubapartado+'</ol>';

						}////TERMINA SUBAPARTADOS 

					var itemApartado = '<li>'+apartado_titulo+indiceSubapartado+'</li>';
					indiceApartados = indiceApartados+itemApartado;
				
			}
			indiceApartados=indiceApartados+'</ol>';

		}////TERMINA APARTADOS 

		var itemUnidad = '<li>'+unidad_titulo+indiceApartados+'</li>';
		
		indiceUnidades=indiceUnidades+itemUnidad;
	}///TERMINA UNIDAD
	return indiceUnidades=indiceUnidades+'</ol>';
}


function generarPaginaUnidad(unidad,fileName){
	var streamUni = fs.createWriteStream('output/'+fileName+'.html');

	streamUni.once('open', function(fd) {
		var html = fileName;
		streamUni.end(html);
	});

}
