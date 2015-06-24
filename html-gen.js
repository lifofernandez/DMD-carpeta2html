/*
 * carpeta2html
 * convierte carpetas descargadas de aca: materiales.uvq.edu.ar a HTML
 *
 * Este script fue echo para uso propio y se provee "asi como es" 
 * forma parte del prototipo de solucion para la autoria de materiales digitales.
 * 
 * Lisandro Fernandez 
 * 2015
 *
 */

var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
var html = require("html");

var S = require('string');

// Prefs
var destFolder = 'output-HTML/';




///load 
var xmlFile = fs.readFileSync(__dirname + '/carpeta.xml', "utf8");

//parse
var doc = new DOMParser().parseFromString(xmlFile, 'text/xml');


//lesgou
var mainHtml = {};
var mainNav = {};

var carpeta = {};

//GETSS
carpeta.titulo = doc.getElementsByTagName('carpeta_titulo')[0].childNodes[0].nodeValue;
carpeta.introduccion = doc.getElementsByTagName('introduccion')[0];
carpeta.unidades = doc.getElementsByTagName('unidad');
carpeta.anexos = doc.getElementsByTagName('anexo');



var nBloques = 0;



////////////////////////////////////////////
////GENERAR INDICE/////////////////////////
////////////////////////////////////////////
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
    mainNav.header='<div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="index.html">U</a></div>';
    mainNav.collapse ='<nav class="navbar-collapse collapse" role="navigation"><ul class="nav navbar-nav dmd-unidades-nav navbar-right"><li><a id="intro-trigger" href="/#intro">Introducción</a></li>'+unidadesBtns+anexosBtns+'</ul></nav><!--/.nav-collapse -->';
	mainNav.close='</div>';

	//concat nav
	mainNav.render = mainNav.open+mainNav.header+mainNav.collapse+mainNav.close;


	mainHtml.open = '<!DOCTYPE html><html>';
	
	mainHtml.head = '<head><meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta name="description" content=""> <meta name="keywords" content=""><meta name="author" content="DMD/UVQ"> <link rel="icon" href="/favicon.ico"><title>'+carpeta.titulo+' / Inicio</title> <!-- DMD core CSS --> <link href="piel/css/bootstrap.min.css" rel="stylesheet"><!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries --> <!--[if lt IE 9]> <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script> <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script> <![endif]--></head>';
	
	mainHtml.cover = '<div id="top" class="cover"><div class="container"><h1 class="main-logo">U</h1><div class="footer">'+carpeta.titulo+' - DIRECCIÓN DE MATERIALES DIDÁCTICOS</div></div></div>';

	mainHtml.header = '<header class="navbar navbar-inverse affix-top" role="banner">'+mainNav.render+'</header>';

	mainHtml.footer = '<footer class="footer dmd-footer"><div class="container"><div class="row"><div id="titulo" class="col-md-5"><p>'+carpeta.titulo+'</p></div><div id="bottom-to-top" class="col-md-2"><a class="smooth-trigger back-to-top-arrow rotate" href="#top">Z</a></div><div id="copy"class="col-md-5"><p>Dirección de Materiales Didáctivos</p></div></div></div></footer>';

	mainHtml.close = '<!-- Bootstrap core JavaScript --><!-- Placed at the end of the document so the pages load faster --> <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> <script src="piel/js/bootstrap.min.js"></script>  <script src="piel/js/dmd.js"></script> <!-- IE10 viewport hack for Surface/desktop Windows 8 bug --> <script src="piel/js/ie10-viewport-bug-workaround.js"></script>';

	//var autor_nombre = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;
	//var autor_bio = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;

	var unidadesIndice = generarIndiceUnidades(carpeta.unidades);
	var anexosIndice = generarIndiceAnexos(carpeta.anexos);

	var indiceGeneral = '<div class="indice-general"><div class="row index-row"><div class="col-md-9 col-md-offset-3 menu-container intro-container"><div class="menu-header"><a class="smooth-trigger big-link" href="#intro">Introducción</a></div></div></div>'+unidadesIndice+anexosIndice+'</div>';
	
	var content = '<div class="container" id="intro-indice"><section id="intro"><div class="row"><div class="col-md-9 col-md-offset-3"><h1>Introducción</h1>'+carpeta.introduccion+'</div></div></section><section id="indice">'+indiceGeneral+'</section></div>';
	
	//mainHtml.indexConcat = mainHtml.open+mainHtml.head+'<body class="index">'+mainHtml.cover+mainHtml.header+content+mainHtml.footer+mainHtml.close+'</body></html>';
	mainHtml.indexConcat = mainHtml.open+mainHtml.head+'<body id="top" class="index">'+mainHtml.header+content+mainHtml.footer+mainHtml.close+'</body></html>';

	
	var fileName = destFolder+'index.html';
	var stream = fs.createWriteStream(fileName);

	stream.once('open', function(fd) {
		var data = mainHtml.indexConcat;
		var prettyData = prettify(data);
		stream.end(prettyData);
	});
};

function generarIndiceUnidades(unidades_in){
	var indiceUnidades = '<div class="main-index-nav unidades-index">';
	for (var i=0; i < unidades_in.length; i++) {

		var unidadTitulo = unidades_in[i].getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue;
		var unidadDelta = (i+1);
		var unidadUrl = 'unidad-'+(i+1)+'.html';
		
		var unidadHeader = '<div class="menu-header"><a class="big-link" href="'+unidadUrl+'">'+unidadTitulo+'</a><a class="show-menu collapse-indicator" href="#">Z</a></div>';
		
		

		var apartados = unidades_in[i].getElementsByTagName('apartado');
		var indiceApartados = indexFromElements(apartados,'apartado_titulo',unidadUrl,unidadDelta,'subapartado', 'subapartado_titulo');
		var deltaCol = '<div class="col-md-3 delta-container"><div class="delta unidad-delta">'+unidadDelta+'</div></div>';
		var unidadCol = '<div class="col-md-9 menu-container">'+unidadHeader+indiceApartados+'</div>';

		var itemUnidad = '<div class="row index-row unidad unidad-'+unidadDelta+'">'+deltaCol+unidadCol+'</div>';
		
		indiceUnidades=indiceUnidades+itemUnidad;

	}
	return indiceUnidades=indiceUnidades+'</div>';
}

function generarIndiceAnexos(anexos_in){
	var indiceAnexos = '<div class="main-index-nav anexos-index">';

	for (var i=0; i < anexos_in.length; i++) {

		var anexoTitulo = 'Anexo';
		var anexoDelta = romanize(i+1);

		var anexoUrl = 'anexo-'+(i+1)+'.html';
		
		var anexoHeader = '<div class="menu-header"><a class="big-link" href="'+anexoUrl+'">'+anexoTitulo+' '+anexoDelta+'</a><a class="show-menu collapse-indicator" href="#">Z</a></div>';
		
		var apartados = anexos_in[i].getElementsByTagName('apartado');
		var indiceApartados = indexFromElements(apartados,'apartado_titulo',anexoUrl,'','subapartado', 'subapartado_titulo');

		var deltaCol = '<div class="col-md-3 delta-container"><div class="delta anexo-delta">'+anexoDelta+'</div></div>';
		var anexoCol = '<div class="col-md-9 menu-container">'+anexoHeader+indiceApartados+'</div>';

		var itemAnexo = '<div class="row index-row anexo anexo-'+(i+1)+'">'+deltaCol+anexoCol+'</div>';
		
		indiceAnexos=indiceAnexos+itemAnexo;
	}
	return indiceAnexos=indiceAnexos+'</div>';
}



// >apartados>subapartados Walker para indicie general
function indexFromElements(items,what_to_get,base_link,parent_delta,child_to_get,what_inChild_to_get){
	var output = '';
	if(items.length > 0){

		output = '<ul class="nav nav-list lvl-subapartado">';
		if(child_to_get)output = '<ul class="nav nav-list lvl-apartado collapse">';
		
		for (var i=0; i < items.length; i++) {
			if(items[i].getElementsByTagName(what_to_get)[0]){
				if(parent_delta !== '')var itemDelta = parent_delta+'.'+(i+1);
				if(parent_delta === '')var itemDelta = '';
				var itemTitulo = items[i].getElementsByTagName(what_to_get)[0].childNodes[0].nodeValue;

				var itemUrl = makeUrl(itemTitulo);
				var itemLink = '<a class="indice-link" href="'+base_link+'#'+itemUrl+'"><span class="delta">'+itemDelta+'. </span> '+itemTitulo+'</a>';
				
				var childIndex = '';
				var childElements;
				if(items[i].getElementsByTagName(child_to_get)[0]){
					if(child_to_get !== null){
						childElements = items[i].getElementsByTagName(child_to_get);
						childIndex = indexFromElements(childElements,what_inChild_to_get,base_link,itemDelta);
					}
				}
				var itemElemento = '<li>'+itemLink+childIndex+'</li>';
				output = output+itemElemento;
			}
			
		}
		output=output+'</ul>';

	}////TERMINA SUBAPARTADOS 
	return output;
}


////////////////////////////////////////////
////GENERAR PAGINAS/////////////////////////
////////////////////////////////////////////

paginasWalker(carpeta.unidades);
paginasWalker(carpeta.anexos);

function paginasWalker(element_group){
	for (var i=0; i < element_group.length; i++) {
		generarPaginas(element_group[i],i+1);
	}
}

/*
 * Generar Paginas Individuales De Cada Unidad o Anexo
 */
function generarPaginas(element_group,delta){
	
	var elementTipe = element_group.tagName;
	var paginaFileName = elementTipe+'-'+delta+'.html';

	if(elementTipe === 'unidad'){
		var paginaTitulo = element_group.getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue;
		var elementDelta = delta;
	}

	if(elementTipe === 'anexo'){
		var elementDelta = '';
		var paginaTitulo = 'Anexo '+romanize(delta);
	}
	
	var apartados = element_group.getElementsByTagName('apartado');
	

	var headPagina = '<head><meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta name="description" content=""> <meta name="keywords" content=""> <meta name="author" content="DMD/UVQ"> <link rel="icon" href="/favicon.ico"> <title>'+carpeta.titulo+' / '+paginaTitulo+'</title> <!-- DMD core CSS --> <link href="piel/css/bootstrap.min.css" rel="stylesheet"><!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries --> <!--[if lt IE 9]> <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script> <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script> <![endif]--> </head>';
	
	var headerPagina = '<body class="page '+elementTipe+' '+elementTipe+'-'+delta+'"><header class="navbar navbar-inverse navbar-fixed-top" role="banner">'+mainNav.render+'</header>';

	var indiceApartados = '<div class="col-md-3"><div class="dmd-sidebar hidden-print hidden-xs hidden-sm affix-top" role="complementary">'+sideNavFromElements(apartados,'apartado_titulo','',elementDelta,'subapartado', 'subapartado_titulo',paginaTitulo)+'</div></div>';


	var	content = '<div class="col-md-9" role="main">'+parseContent(element_group,delta)+'</div>';

	var body = '<div class="container main-container"><div class="row">'+indiceApartados+content+'</div></div>';

	var streamUni = fs.createWriteStream(destFolder+paginaFileName);
	streamUni.once('open', function(fd) {

		var data = mainHtml.open+headPagina+headerPagina+body+mainHtml.footer+mainHtml.close;
		var prettyData = prettify(data);
		
		streamUni.end(prettyData);
	});
}

// Element Walker para indicie de cada pagina/unidad
function sideNavFromElements(elementos,what_to_get,base_link,parent_delta,child_to_get,what_inChild_to_get,titulo_pagina){

	var output = '';

	if(elementos.length > 0){
		output = '<ul class="nav dmd-sidenav"><li class="nav-title"><a class="smooth-trigger" href="#top"><span class="delta">'+parent_delta+'.</span> '+titulo_pagina+'</a></li>';
		if(!child_to_get)output = '<ul class="nav nav-list">';

		for (var i=0; i < elementos.length; i++) {
			if(elementos[i].getElementsByTagName(what_to_get)[0]){
				if(parent_delta !== '')var elementoDelta = parent_delta+'.'+(i+1);
				if(parent_delta === '')var elementoDelta = (i+1);
				var elementoTitulo = elementos[i].getElementsByTagName(what_to_get)[0].childNodes[0].nodeValue;

				var elementoUrl = makeUrl(elementoTitulo);
				var elementoLink = '<a class="smooth-trigger" href="'+base_link+'#'+elementoUrl+'"><span class="delta">'+elementoDelta+'.</span> '+elementoTitulo+'</a>';
				
				var childIndex = '';
				var childElements;
				if(elementos[i].getElementsByTagName(child_to_get)[0]){
					if(child_to_get !== null){
						childElements = elementos[i].getElementsByTagName(child_to_get);
						childIndex = sideNavFromElements(childElements,what_inChild_to_get,base_link,elementoDelta);
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

// Parsear contenido unidad/apartado
function parseContent(element_group, delta){
	var elementTipe = element_group.tagName;

	console.log('html-gen -> ['+elementTipe+delta+']'); 

	var output = '<div id="top" class="article '+elementTipe+'-content '+elementTipe+'-content-'+delta+'">';

	var paginaTitulo = element_group.getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue;
	var paginaAnchor = makeUrl(element_group.getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue);
	
	if(element_group.childNodes){

		var elementDelta = '<div class="delta '+elementTipe+'-delta">'+delta+'</div>';
		if(elementTipe === 'unidad'){
		var elementDelta = '<div class="delta '+elementTipe+'-delta">'+delta+'</div>';
		var elementTitulo = '<h2 id="'+paginaAnchor+'" class="titulo-pagina">'+paginaTitulo+'</h2>';

		var elementObjetivos = getPreliminares(element_group, 'unidad_objetivos');
		var elementIntro = getPreliminares(element_group, 'unidad_introduccion');
		}

		if(elementTipe === 'anexo'){
			var elementDelta = '<div class="delta '+elementTipe+'-delta">'+romanize(delta)+'</div>';
			var elementTitulo = '<h2 id="titulo-anexo" class="titulo-pagina">Anexo</h2>';
			var elementObjetivos = '';
			var elementIntro = '';
		}

		var elementApartados = getParts(element_group, 'apartado',delta);

		var elementHeader = '<header>'+elementDelta+elementTitulo+'</header>'
		
		output += elementHeader+elementObjetivos+elementIntro+elementApartados; 
	}
	return output+'</div>';
}
// Parsear preliminares
function getPreliminares(element, what_to_get){
	var op = '';

	if(element.getElementsByTagName(what_to_get)[0]){
		var obj = element.getElementsByTagName(what_to_get)[0];
		op = op+'<div class="preliminares '+what_to_get+'">'+getContent(obj)+'</div>';
	}

	return op;

}

// Parsear artados y sub apartados
function getParts(element, what_to_get,parent_delta){
	var op = '';
	var titleLvl = 3;
	if(what_to_get==='subapartado')titleLvl = 4;

	if(element.getElementsByTagName(what_to_get)){
		var parts = element.getElementsByTagName(what_to_get);
		if(parts.length > 0)op = '<div class="'+what_to_get+'s">';
		

		for (var i=0; i < parts.length; i++) {

			if(parts[i].getElementsByTagName(what_to_get+'_titulo')[0]){
			var partDelta = parent_delta+'.'+(i+1);
			var unidadDelta = '<div class="delta '+what_to_get+'-delta">'+partDelta+'</div>';

				var partId = makeUrl(parts[i].getElementsByTagName(what_to_get+'_titulo')[0].childNodes[0].nodeValue);

				var partTitulo = '<h'+titleLvl+' class="part-title">'+parts[i].getElementsByTagName(what_to_get+'_titulo')[0].childNodes[0].nodeValue+'</h'+titleLvl+'>';
				
			}
			var bloques = getBloques(parts[i]);
			var subapartados = getParts(parts[i], 'subapartado',partDelta);

			op = op+'<div id="'+partId+'" class="'+what_to_get+' '+what_to_get+'-'+i+'">'+unidadDelta+partTitulo+bloques+subapartados+'</div>';
		}

		if(parts.length > 0)op += '</div>';
	}

	return op;
}


// Parsear bloques
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
				
				var tooltipStr = 'data-toggle="tooltip" data-placement="right" title="'+bloqueTipoName+'"';

				var iconoStr = '<div class="icono">L</div>';
				var collapseStr = '<div class="collapse-indicator">+</div>';

				var bloqueHeader = '<div class="bloque-header">'+iconoStr+'<div class="tipo">'+bloqueTipoName+'</div>'+collapseStr+'</div>';

				if(bloqueTipo === 'texto'){
					bloqueHeader = '<div class="bloque-header">'+'<div class="tipo">'+bloqueTipoName+'</div>'+'</div>';
					tooltipStr = '';

			}
				//if(bloqueTipo === 'actividad')tooltipStr = 'data-toggle="tooltip" data-placement="top" title="'+bloqueTipoName+'"';
					

				var op=op+'<div '+tooltipStr+' id="bloque-'+nBloques+'"class="bloque '+bloqueTipo+'">'+bloqueHeader+bloqueContent+'</div>';
			}

			nBloques++;
		}

	}
	return op;
}

// Parsear contenido
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



////////////////////////////////////////////
////ADDS & UTILS////////////////////////////
////////////////////////////////////////////

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

