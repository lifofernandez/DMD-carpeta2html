var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;

///load 
var xmlFile = fs.readFileSync(__dirname + '/contents.xml', "utf8");

//parse
var doc = new DOMParser().parseFromString(xmlFile, 'text/xml');

var mainHtml = new Object();;
//build html
function buildIndex() {
	
	var title = doc.getElementsByTagName('carpeta_titulo')[0].childNodes[0].nodeValue;
	mainHtml.open = '<!DOCTYPE html><html>';
	mainHtml.head = '<head><meta charset="utf8"/><title>'+title+'</title></head>';
	mainHtml.header = '<header>'+title +'</header>';
	mainHtml.footer = '<footer>DMD / UVQ</footer>';
	mainHtml.close = '</html>';

	//var autor_nombre = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;
	//var autor_bio = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;

	
	var introduccion = doc.getElementsByTagName('introduccion')[0];

	var unidades = doc.getElementsByTagName('unidad');
	var unidedIndex = generarUnidades(unidades);

	var anexos = doc.getElementsByTagName('anexo');
	var axenosIndex = generarAnexos(anexos);

	
	var body = '<body>'+ unidedIndex+axenosIndex+introduccion+'</body>';
	

	return mainHtml.open+mainHtml.head+mainHtml.header+body+mainHtml.footer+mainHtml.close;
};

///WRITE HTML
var fileName = 'output/index.html';
var stream = fs.createWriteStream(fileName);

stream.once('open', function(fd) {
	var html = buildIndex();
	stream.end(html);
});




function generarUnidades(unidades){
	var indiceUnidades = '<ul>';
	for (var i=0; i < unidades.length; i++) {

		var unidadTitulo = unidades[i].getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue;
		var unidadNumeral = (i+1);
		var unidadUrl = 'unidad-'+(i+1)+'.html';
		var unidadLink = '<a href="'+unidadUrl+'">'+unidadNumeral+' '+unidadTitulo+'</a>';
		
		generarPaginaUnidad(unidades[i], unidadUrl,(i+1));

		var apartados = unidades[i].getElementsByTagName('apartado');
		var indiceApartados = indexFromElements(apartados,'apartado_titulo',unidadUrl,unidadNumeral,'subapartado', 'subapartado_titulo');

		var itemUnidad = '<li>'+unidadLink+indiceApartados+'</li>';
		
		indiceUnidades=indiceUnidades+itemUnidad;
	}///TERMINA UNIDAD
	return indiceUnidades=indiceUnidades+'</ul>';
}

function generarAnexos(anexos){
	var indiceAnexos = '<ul>';
	for (var i=0; i < anexos.length; i++) {

		var anexoTitulo = 'Anexo';
		var anexoUrl = 'anexo-'+(i+1)+'.html';
		var anexoLink = '<a href="'+anexoUrl+'">'+anexoTitulo+'</a>';
		
		//generarPaginaUnidad(anexos[i], anexoUrl);

		var apartados = anexos[i].getElementsByTagName('apartado');
		var indiceApartados = indexFromElements(apartados,'apartado_titulo',anexoUrl,'subapartado', 'subapartado_titulo');

		var itemAnexo = '<li>'+anexoLink+indiceApartados+'</li>';
		
		indiceAnexos=indiceAnexos+itemAnexo;
	}///TERMINA UNIDAD
	return indiceAnexos=indiceAnexos+'</ul>';
}


function generarPaginaUnidad(unidad,fileName,numeral){

	var unidadTitulo = unidad.getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue;
	var apartados = unidad.getElementsByTagName('apartado');
	var indiceApartados = indexFromElements(apartados,'apartado_titulo','',numeral,'subapartado', 'subapartado_titulo');




	var streamUni = fs.createWriteStream('output/'+fileName);
	streamUni.once('open', function(fd) {
		var html = mainHtml.open+mainHtml.head+mainHtml.header+unidadTitulo+indiceApartados+mainHtml.footer+mainHtml.close;
		streamUni.end(html);
	});

}




function indexFromElements(elementos,what_to_get,baseLink,parent_n,child_to_get,what_inChild_to_get){
	var output = '';
	if(elementos.length > 0){
		output = '<ul>';
		for (var i=0; i < elementos.length; i++) {
			if(elementos[i].getElementsByTagName(what_to_get)[0]){
				//if(parent_n !== null)parent_n = '';
				var elementoNumeral = parent_n+'.'+(i+1);
				var elementoTitulo = elementos[i].getElementsByTagName(what_to_get)[0].childNodes[0].nodeValue;

				var elementoUrl = encodeURIComponent(elementoTitulo).replace(/%20/g,'-');
				var elementoLink = '<a href="'+baseLink+'#'+elementoUrl+'">'+elementoNumeral+' '+elementoTitulo+'</a>';
				
				var childIndex = '';
				var childElements;
				if(elementos[i].getElementsByTagName(child_to_get)[0]){
					if(child_to_get !== null){
						childElements = elementos[i].getElementsByTagName(child_to_get);
						childIndex = indexFromElements(childElements,what_inChild_to_get,baseLink,elementoNumeral);
					}
				}
				var itemElemento = '<li>'+elementoLink+childIndex+'</li>';
				output = output+itemElemento;
			}
			
		}
		output=output+'</ul>';

	}////TERMINA SUBAPARTADOS 
	return output;
}

