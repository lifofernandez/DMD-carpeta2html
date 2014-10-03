var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
var html = require("html");
var S = require('string');

///load 
var xmlFile = fs.readFileSync(__dirname + '/contents.xml', "utf8");

//parse
var doc = new DOMParser().parseFromString(xmlFile, 'text/xml');

var mainHtml = {};
var mainNav = {};

var carpeta = {};
//GETSS
carpeta.titulo = doc.getElementsByTagName('carpeta_titulo')[0].childNodes[0].nodeValue;
carpeta.introduccion = doc.getElementsByTagName('introduccion')[0];
carpeta.unidades = doc.getElementsByTagName('unidad');
carpeta.anexos = doc.getElementsByTagName('anexo');

buildIndex();

function buildIndex() {

	//construct nav
	var unidadesBtns = '';
	[].forEach.call(carpeta.unidades, function (element, index) {
		unidadesBtns=unidadesBtns+'<li><a href=unidad-'+(index+1)+'.html>Unidad '+(index+1)+'</a></li>';
	});

	var anexosBtns = '';
	[].forEach.call(carpeta.anexos, function (element, index) {
		anexosBtns=anexosBtns+'<li><a href=anexo-'+(index+1)+'.html>Anexo '+romanize(index+1)+'</a></li>';
	});

	mainNav.open='<div class="container dmd-nav-main">';
    mainNav.header='<div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="index.html">'+carpeta.titulo+'</a></div>';
    mainNav.collapse ='<nav class="navbar-collapse collapse" role="navigation"><ul class="nav navbar-nav dmd-unidades-nav navbar-right">'+unidadesBtns+anexosBtns+'</ul></nav><!--/.nav-collapse -->';
	mainNav.close='</div>';

	//concat nav
	mainNav.render = mainNav.open+mainNav.header+mainNav.collapse+mainNav.close;


	mainHtml.open = '<!DOCTYPE html><html>';
	
	mainHtml.head = '<head><meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta name="description" content=""> <meta name="keywords" content=""> <meta name="author" content="DMD/UVQ"> <link rel="icon" href="/favicon.ico"> <title>'+carpeta.titulo+' / Inicio</title> <!-- DMD core CSS --> <link href="css/style.css" rel="stylesheet"><!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries --> <!--[if lt IE 9]> <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script> <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script> <![endif]--></head>';
	mainHtml.cover = '<div class="cover"><h1>'+carpeta.titulo+'</h1></div>'
	mainHtml.header = '<body class="index">'+mainHtml.cover+'<header class="navbar navbar-default affix-top"  role="banner">'+mainNav.render+'</header>';

	mainHtml.footer = '<div class="footer dmd-footer"><div class="container"><p class="text-muted">Dirección de Materiales Didáctivos / Universidad Virtual de Quilmes</p></div></div>';
	mainHtml.close = '<!-- Bootstrap core JavaScript --> <!-- Placed at the end of the document so the pages load faster --> <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> <script src="js/bootstrap.js"></script>  <script src="js/dmd.js"></script> <!-- IE10 viewport hack for Surface/desktop Windows 8 bug --> <script src="/js/ie10-viewport-bug-workaround.js"></script></body></html>';

	//var autor_nombre = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;
	//var autor_bio = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;

	var unidadesIndice = generarIndiceUnidades(carpeta.unidades);
	var anexosIndice = generarIndiceAnexos(carpeta.anexos);

	var indiceGeneral = '<div class="indice-general">'+unidadesIndice+anexosIndice+'</div>';
	
	var content = '<div class="container"><section>'+carpeta.introduccion+'</section><section>'+indiceGeneral+'</section></div>';
	
	mainHtml.indexCocat = mainHtml.open+mainHtml.head+mainHtml.header+content+mainHtml.footer+mainHtml.close;


	var fileName = 'output/index.html';
	var stream = fs.createWriteStream(fileName);

	stream.once('open', function(fd) {
		var data = mainHtml.indexCocat;
		var prettyData = prettify(data);
		stream.end(prettyData);
	});
};

///WRITE HTML





function generarIndiceUnidades(unidades_in){
	var indiceUnidades = '<ol class="main-index-nav unidades-index">';
	for (var i=0; i < unidades_in.length; i++) {

		var unidadTitulo = unidades_in[i].getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue;
		var unidadDelta = (i+1);
		var unidadUrl = 'unidad-'+(i+1)+'.html';
		var unidadLink = '<a href="'+unidadUrl+'">'+unidadTitulo+'</a>';
		
		

		var apartados = unidades_in[i].getElementsByTagName('apartado');
		var indiceApartados = indexFromElements(apartados,'apartado_titulo',unidadUrl,unidadDelta,'subapartado', 'subapartado_titulo');

		var itemUnidad = '<li>'+unidadLink+indiceApartados+'</li>';
		
		indiceUnidades=indiceUnidades+itemUnidad;

		//sacar de aca
		generarPaginaUnidad(unidades_in[i], unidadUrl,(i+1));
	}
	return indiceUnidades=indiceUnidades+'</ol>';
}

function generarIndiceAnexos(anexos_in){
	var indiceAnexos = '<ul class="main-index-nav anexos-index">';
	for (var i=0; i < anexos_in.length; i++) {

		var anexoTitulo = 'Anexo';
		var anexoDelta = romanize(i+1);

		var anexoUrl = 'anexo-'+(i+1)+'.html';
		var anexoLink = '<a href="'+anexoUrl+'">'+anexoTitulo+' '+anexoDelta+'</a>';
		
		

		var apartados = anexos_in[i].getElementsByTagName('apartado');
		var indiceApartados = indexFromElements(apartados,'apartado_titulo',anexoUrl,'','subapartado', 'subapartado_titulo');

		var itemAnexo = '<li>'+anexoLink+indiceApartados+'</li>';
		
		indiceAnexos=indiceAnexos+itemAnexo;
		
		//sacar de aca
		//generarPaginaUnidad(anexos_in[i], anexoUrl);
	}
	return indiceAnexos=indiceAnexos+'</ul>';
}

//GENERATE MAIN INDEX
function indexFromElements(elementos,what_to_get,base_link,parent_delta,child_to_get,what_inChild_to_get,titulo_unidad){
	var output = '';
	if(elementos.length > 0){
		
		output = '<ul class="nav nav-list">';
		
		if(titulo_unidad)output = '<ul class="nav dmd-sidenav"><li class="nav-title"><a class="smooth-trigger" href="#top">'+parent_delta+' '+titulo_unidad+'</a></li>';
		

		if(!child_to_get)output = '<ul class="nav nav-list">';

		for (var i=0; i < elementos.length; i++) {
			if(elementos[i].getElementsByTagName(what_to_get)[0]){
				if(parent_delta !== '')var elementoDelta = parent_delta+'.'+(i+1);
				if(parent_delta === '')var elementoDelta = '';
				var elementoTitulo = elementos[i].getElementsByTagName(what_to_get)[0].childNodes[0].nodeValue;

				var elementoUrl = makeUrl(elementoTitulo);
				var elementoLink = '<a class="smooth-trigger" href="'+base_link+'#'+elementoUrl+'">'+elementoDelta+' '+elementoTitulo+'</a>';
				
				var childIndex = '';
				var childElements;
				if(elementos[i].getElementsByTagName(child_to_get)[0]){
					if(child_to_get !== null){
						childElements = elementos[i].getElementsByTagName(child_to_get);
						childIndex = indexFromElements(childElements,what_inChild_to_get,base_link,elementoDelta);
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


//GENERAR PAGINAS INDIVIDUALES DE CADA UNIDAD
function generarPaginaUnidad(unidad_in,fileName,delta){

	var unidadTitulo = unidad_in.getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue;
	var apartados = unidad_in.getElementsByTagName('apartado');
	var headUnidad = '<head><meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta name="description" content=""> <meta name="keywords" content=""> <meta name="author" content="DMD/UVQ"> <link rel="icon" href="/favicon.ico"> <title>'+carpeta.titulo+' / '+unidadTitulo+'</title> <!-- DMD core CSS --> <link href="css/style.css" rel="stylesheet"><!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries --> <!--[if lt IE 9]> <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script> <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script> <![endif]--> </head>';
	var headerUnidad = '<body class="unidad"><header class="navbar navbar-default navbar-fixed-top" role="banner">'+mainNav.render+'</header>';

	var indiceApartados = '<div class="col-md-3"><div class="dmd-sidebar hidden-print hidden-xs hidden-sm affix-top" role="complementary">'+indexFromElements(apartados,'apartado_titulo','',delta,'subapartado', 'subapartado_titulo',unidadTitulo)+'</div></div>';


	var	content = '<div class="col-md-9" role="main">'+parseUnidad(unidad_in,delta)+'</div>';

	var body = '<div class="container"><div class="row">'+indiceApartados+content+'</div></div>';

	var streamUni = fs.createWriteStream('output/'+fileName);
	streamUni.once('open', function(fd) {
		var data = mainHtml.open+headUnidad+headerUnidad+body+mainHtml.footer+mainHtml.close;
		var prettyData = prettify(data);
		
		streamUni.end(prettyData);
	});
}





///PARSEO DE UNIDADES Y FUNCIONES PARA CONTENIDO

function parseUnidad(elementGroup, delta){
	var output = '<div id="top" class="article unidad-content unidad-'+delta+'">';

	if(elementGroup.childNodes){
		//var elementos = elementGroup.childNodes;
		var unidadDelta = '<div class="delta unidad-delta">'+delta+'</div>';
		var titulo = '<h2>'+elementGroup.getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue+'</h2>';
		
		var objetivos = getPreliminares(elementGroup, 'unidad_objetivos');
		var intro = getPreliminares(elementGroup, 'unidad_introduccion');
		
		var apartados = getParts(elementGroup, 'apartado',delta);

		var unidadHeader = '<header>'+unidadDelta+titulo+'</header>'
		output += unidadHeader+objetivos+intro+apartados; 
	}
	return output+'</div>';
}

function getPreliminares(element, what_to_get){
	var op = '';

	if(element.getElementsByTagName(what_to_get)[0]){
		var obj = element.getElementsByTagName(what_to_get)[0];
		op = op+'<div class="preliminares '+what_to_get+'">'+getContent(obj)+'</div>';
	}

	return op;

}

//funicion extraeer artados y sub apartados
function getParts(element, what_to_get,parent_delta){
	var op = '';
	var titleLvl = 3;
	if(what_to_get==='subapartado')titleLvl = 4;

	if(element.getElementsByTagName(what_to_get)){

		op = '<div class="'+what_to_get+'s">';
		var parts = element.getElementsByTagName(what_to_get);

		for (var i=0; i < parts.length; i++) {

			if(parts[i].getElementsByTagName(what_to_get+'_titulo')[0]){
			var partDelta = parent_delta+'.'+(i+1);
			var unidadDelta = '<div class="delta">'+partDelta+'</div>';

				var partId = makeUrl(parts[i].getElementsByTagName(what_to_get+'_titulo')[0].childNodes[0].nodeValue);

				var partTitulo = '<h'+titleLvl+'>'+parts[i].getElementsByTagName(what_to_get+'_titulo')[0].childNodes[0].nodeValue+'</h'+titleLvl+'>';
				
			}
			var bloques = getBloques(parts[i]);
			var subapartados = getParts(parts[i], 'subapartado',partDelta);

			op = op+'<div id="'+partId+'" class="'+what_to_get+' '+what_to_get+'-'+i+'">'+unidadDelta+partTitulo+bloques+subapartados+'</div>';
		}
	}
	return op+'</div>';
}



function getBloques(element){
	var op = '';
	if(element.getElementsByTagName('bloque')){
		var bloques = element.getElementsByTagName('bloque');
		for (var i=0; i < bloques.length; i++) {
			//console.log(bloques[i].parentNode.tagName);
			if(element.tagName === bloques[i].parentNode.tagName){ //to get only direct childs
				var bloqueTipo =  bloques[i].getAttribute('tipo').replace('recurso_','');
				var bloqueTipoName =  S(bloqueTipo).humanize().capitalize().s;

				var bloqueContent = '<div class="bloque-contenido">'+getContent(bloques[i])+'</div>';
				
				var tooltip = '';
				
				if(bloqueTipo !== 'texto')tooltip = 'data-toggle="tooltip" data-placement="bottom" title="'+bloqueTipoName+'"';
				if(bloqueTipo === 'actividad')tooltip = 'data-toggle="tooltip" data-placement="top" title="'+bloqueTipoName+'"';

				var op=op+'<div '+tooltip+' class="bloque '+bloqueTipo+'"><div class="tipo">'+bloqueTipoName+'</div>'+bloqueContent+'</div>';
			}
		}

	}
	return op;
}

function getContent(element){
	var op = '';
	if(element.childNodes){
		var contentChilds = element.childNodes;
		for (var i=0; i < contentChilds.length; i++) {
			op = op+contentChilds[i];
		}
	}
	return op;
}






////ADDS & UTILS////////////////////////////////////////////

function prettify(str) {
  return html.prettyPrint(str, {jslint_happy:true,indent_size: 1,keep_array_indentation:true,unformatted:''})
}


function makeUrl(input){
	return S(input).slugify().s;
}


function romanize(num) {
    if (!+num)
        return false;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM","","X","XX","XXX","XL","L","LX","LXX","LXXX","XC","","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

