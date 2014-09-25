var fs = require('fs');

var DOMParser = require('xmldom').DOMParser;

//var inspect = require('eyes').inspector({maxLength: false})


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

	console.log(doc);
	
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

		var unidadTitulo = unidades[i].getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue;
		var unidadUrl = 'unidad-'+(i+1)+'.html';
		var unidadLink = '<a href="'+unidadUrl+'">'+unidadTitulo+'</a>';
		
		generarPaginaUnidad(unidades[i], unidadUrl);

		///APARTADOS
		var apartados = unidades[i].getElementsByTagName('apartado');
		var indiceApartados = '';
		if(apartados.length > 0){
			indiceApartados = '<ol>';
			for (var e=0; e < apartados.length; e++) {
					if(apartados[e].getElementsByTagName('apartado_titulo')[0]){
						var apartadoTitulo = apartados[e].getElementsByTagName('apartado_titulo')[0].childNodes[0].nodeValue;
						var apartadoUrl = encodeURIComponent(apartadoTitulo).replace(/%20/g,'-');
						var apartadoLink = '<a href="'+unidadUrl+'#'+apartadoUrl+'">'+apartadoTitulo+'</a>';


							///SUBAPARTADOS
							var subapartados = apartados[e].getElementsByTagName('subapartado');
							var indiceSubapartado = indexFromElements(subapartados, 'subapartado_titulo',unidadUrl);
							
	
						var itemApartado = '<li>'+apartadoLink+indiceSubapartado+'</li>';
						indiceApartados = indiceApartados+itemApartado;
					}
				
			}
			indiceApartados=indiceApartados+'</ol>';

		}////TERMINA APARTADOS 

		var itemUnidad = '<li>'+unidadLink+indiceApartados+'</li>';
		
		indiceUnidades=indiceUnidades+itemUnidad;
	}///TERMINA UNIDAD
	return indiceUnidades=indiceUnidades+'</ol>';
}


function generarPaginaUnidad(unidad,fileName){
	var streamUni = fs.createWriteStream('output/'+fileName);

	streamUni.once('open', function(fd) {
		var html = fileName;
		streamUni.end(html);
	});

}

function indexFromElements(elementos,what_to_get,baseLink,child_to_get){
	var output = '';
	if(elementos.length > 0){
		output = '<ol>';
		for (var o=0; o < elementos.length; o++) {
			if(elementos[o].getElementsByTagName(what_to_get)[0]){
				var elementoTitulo = elementos[o].getElementsByTagName(what_to_get)[0].childNodes[0].nodeValue;

				var elementoUrl = encodeURIComponent(elementoTitulo).replace(/%20/g,'-');
				var elementoLink = '<a href="'+baseLink+'#'+elementoUrl+'">'+elementoTitulo+'</a>';
				/*
				var childIndex = '';
				if(child_to_get !== null){
					var childElements = apartados[e].getElementsByTagName('child_to_get');
					var childIndex = indexFromElements(childElements,'subapartado_titulo',baseLink);
				}
				*/
				var itemElemento = '<li>'+elementoLink+'</li>';
				output = output+itemElemento;
			}
			
		}
		output=output+'</ol>';

	}////TERMINA SUBAPARTADOS 
	return output;
}