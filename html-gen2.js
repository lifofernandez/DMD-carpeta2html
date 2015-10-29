/**
 * carpeta2html (ajustes para Debo)
 * convierte carpetas descargadas de materiales.uvq.edu.ar a HTML
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
console.log('##### cargando: carpeta.xml #####');
//parse
var doc = new DOMParser().parseFromString(xmlFile, 'text/xml');


//lesgou
var mainHtml = {};
var mainNav = {};

var carpeta = {};

carpeta.preliminares = {};

//GETSS
carpeta.titulo = doc.getElementsByTagName('carpeta_titulo')[0].childNodes[0].nodeValue;
console.log('carpeta: '+carpeta.titulo);



carpeta.preliminares.autor = doc.getElementsByTagName('autor')[0];

carpeta.preliminares.introduccion = doc.getElementsByTagName('introduccion')[0];
carpeta.preliminares.problematica = doc.getElementsByTagName('problematica_del_campo')[0];
carpeta.preliminares.reflexiones = doc.getElementsByTagName('reflexiones')[0];
carpeta.preliminares.objetivos = doc.getElementsByTagName('objetivos_del_curso')[0];
carpeta.preliminares.mapa = doc.getElementsByTagName('mapa_conceptual')[0];
//console.log(carpeta.preliminares.mapa);



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

  

    
  mainNav.collapse ='<nav class="navbar-collapse collapse" role="navigation"><ul class="nav navbar-nav dmd-unidades-nav"><li class="active"><a id="intro-trigger" href="index.html">'+carpeta.titulo+'</a></li>'+unidadesBtns+anexosBtns+'</ul></nav><!--/.nav-collapse -->';
	
	mainNav.header='<div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-­‐brand" href="index.html">V</a><a class="navbar-brand" href="index.html">U</a></div><div class="materia"><h4>'+carpeta.titulo+'</h4></div>';

	mainNav.close='</div>';

	//concat nav
	mainNav.render = mainNav.open+mainNav.header+mainNav.collapse+mainNav.close;


	mainHtml.open = '<!DOCTYPE html><html>';
	
	mainHtml.head = '<head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta name="description" content=""> <meta name="keywords" content=""><meta name="author" content="DMD/UVQ"> <link rel="icon" href="/favicon.ico"><title>'+carpeta.titulo+' / Inicio</title> <!-- DMD core CSS --> <link href="piel/css/bootstrap-DMD-theme.min.css" rel="stylesheet"><!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries --> <!--[if lt IE 9]> <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script> <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script> <![endif]--></head>';
	
	//mainHtml.cover = '<div id="top" class="cover"><div class="container"><h1 class="main-logo">U</h1><div class="footer">'+carpeta.titulo+' - DIRECCIÓN DE MATERIALES DIDÁCTICOS</div></div></div>';

	mainHtml.header = '<header class="navbar navbar-inverse navbar-fixed-top" role="banner">'+mainNav.render+'</header>';

	mainHtml.footer = '<footer class="footer dmd-footer"><div class="container"><div class="row"><div id="titulo" class="col-md-5"><p>'+carpeta.titulo+'</p></div><div id="bottom-to-top" class="col-md-2"><a class="smooth-trigger back-to-top-arrow rotate" href="#top">Z</a></div><div id="copy"class="col-md-5"><p>Dirección de Materiales Didácticos</p></div></div></div></footer>';

	mainHtml.close = '<!-- Bootstrap core JavaScript --><!-- Placed at the end of the document so the pages load faster --> <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script> <script src="piel/js/bootstrap.js"></script>  <script src="piel/js/dmd.js"></script> <!-- IE10 viewport hack for Surface/desktop Windows 8 bug --> <script src="piel/js/ie10-viewport-bug-workaround.js"></script>';

	//var autor_nombre = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;
	//var autor_bio = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;

	var unidadesIndice = generarIndiceUnidades(carpeta.unidades);
	var anexosIndice = generarIndiceAnexos(carpeta.anexos);

	//var indiceGeneral = '<div class="indice-general"><div class="row index-row"><div class="col-md-9 col-md-offset-3 menu-container intro-container"><div class="menu-header"><a class="smooth-trigger big-link" href="index.html">Introducción</a></div></div></div>'+unidadesIndice+anexosIndice+'</div>';
	var titulo = '<div class="row"><div class="col-md-12"><h1>'+carpeta.titulo+'</h1></div></div>';

	var indiceGeneral = '<div id="indice" class="indice-general"><ul class="nav nav-list lvl-unidad"><h3 id="titulo-indice">Indice General</h3>'+unidadesIndice+anexosIndice+'<ul></div>';

	

	//preliminares
	var preliminares = '<div class="col-md-8">'+titulo;
		

	if(carpeta.preliminares.introduccion !== undefined){
		var introduccionContents = getContent(carpeta.preliminares.introduccion);
		var introduccion = '<div id="introduccion" class"contenidos-preliminares"><h2>Introducción</h2>'+introduccionContents+'</div>';
		preliminares +=introduccion;
	}
	if(carpeta.preliminares.problematica !== undefined){
		var problematicaContents = getContent(carpeta.preliminares.problematica);	
		var problematica = '<div id="problematica" class="contenidos-preliminares"><h2>Problemática del campo</h2>'+problematicaContents+'</div>';
		preliminares +=problematica;
	}
	if(carpeta.preliminares.reflexiones !== undefined){
		var reflexionesContents = getContent(carpeta.preliminares.reflexiones);	
		var reflexiones = '<div id="reflexiones" class="contenidos-preliminares"><h2>Reflexiones sobre el aprendizaje de la asignatura en el entorno virtual</h2>'+reflexionesContents+'</div>';
		preliminares +=reflexiones;
	}
	if(carpeta.preliminares.objetivos !== undefined){
		var objetivosContents = getContent(carpeta.preliminares.objetivos);	
		var objetivos = '<div id="objetivos" class="contenidos-preliminares"><h2>Objetivos del curso</h2>'+objetivosContents+'</div>';
		preliminares +=objetivos;
	}

	//console.log(carpeta.preliminares.mapa);
	if(carpeta.preliminares.mapa !== undefined){
		var mapaContents = getContent(carpeta.preliminares.mapa);	
		var mapa = '<div id="mapa" class="contenidos-preliminares"><h2>Mapa conceptual / Diagrama de contenidos</h2>'+mapaContents+'</div>';
		preliminares +=mapa;
	}
	preliminares+='</div>';

	//autor
	var autorNombre = carpeta.preliminares.autor.getElementsByTagName('autor_nombre')[0].childNodes[0].nodeValue;

	console.log('autor: '+autorNombre);

	var autorBio = carpeta.preliminares.autor.getElementsByTagName('autor_biografia')[0].childNodes[0].nodeValue;
	var autorFoto = carpeta.preliminares.autor.getElementsByTagName('autor_foto')[0];
	var autorFotoImg = getContent(autorFoto);

	var autorFotoConMascara = '<div id="autor-foto">'+autorFotoImg+'</div>';

	var autor = '<div class="col-md-4"><div id="autor" class="well">'+autorFotoConMascara+'<h5>'+autorNombre+'</h5>'+autorBio+'</div>'+indiceGeneral+'</div>';



	var intro ='<section id="preliminares"><div class="row">'+autor+preliminares+'</div></section>';

	
	
	var content = '<div class="container main-container" id="main-preliminares">'+intro+'</div>';
	
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

function generarPreliminares(){



}

function generarIndiceUnidades(unidades_in){
	var indiceUnidades = '';

	for (var i=0; i < unidades_in.length; i++) {

		var unidadTitulo = unidades_in[i].getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue;
		var unidadDelta = (i+1);
		var unidadUrl = 'unidad-'+(i+1)+'.html';
		
		var unidadHeader = '<a class="indice-link menu-header" href="'+unidadUrl+'"><span class="delta">'+unidadDelta+'. </span>'+unidadTitulo+'</a>';
		
		

		var apartados = unidades_in[i].getElementsByTagName('apartado');

		var indiceApartados = indexFromElements(apartados,'apartado_titulo',unidadUrl,unidadDelta,'subapartado', 'subapartado_titulo');
	
		
		var itemUnidad = '<li class="unidad unidad-'+unidadDelta+'">'+unidadHeader+indiceApartados+'</li>';
		
		indiceUnidades+=itemUnidad;

	}
	return indiceUnidades;
}

function generarIndiceAnexos(anexos_in){
	var indiceAnexos = '';

	for (var i=0; i < anexos_in.length; i++) {

		var anexoTitulo = 'Anexo';
		var anexoDelta = romanize(i+1);

		var anexoUrl = 'anexo-'+(i+1)+'.html';
		
		var anexoHeader = '<a class="indice-link menu-header" href="'+anexoUrl+'">'+anexoTitulo+' '+anexoDelta+'</a>';
		
		var apartados = anexos_in[i].getElementsByTagName('apartado');
		var indiceApartados = indexFromElements(apartados,'apartado_titulo',anexoUrl,'','subapartado', 'subapartado_titulo');


		

	

		var itemAnexo = '<li class="anexo anexo-'+(i+1)+'">'+anexoHeader+indiceApartados+'</li>';

		
		indiceAnexos=indiceAnexos+itemAnexo;
	}
	return indiceAnexos=indiceAnexos+'';
}



// >apartados>subapartados Walker para indicie general
function indexFromElements(items,what_to_get,base_link,parent_delta,child_to_get,what_inChild_to_get){
	var output = '';
	if(items.length > 0){

		output = '<ul class="nav nav-list lvl-subapartado">';
		if(child_to_get)output = '<ul class="nav nav-list lvl-apartado">';
		
		for (var i=0; i < items.length; i++) {
			if(items[i].getElementsByTagName(what_to_get)[0]){
				if(parent_delta !== '')var itemDelta = parent_delta+'.'+(i+1);
				if(parent_delta === '')var itemDelta = '';
				var itemTitulo = items[i].getElementsByTagName(what_to_get)[0].childNodes[0].nodeValue;

				var itemUrl = makeUrl(itemDelta+'_'+itemTitulo);
				var itemLink = '<a class="indice-link apart-link" href="'+base_link+'#'+itemUrl+'"><span class="delta">'+itemDelta+'. </span> '+itemTitulo+'</a>';
				
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
	

	var headPagina = '<head><meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta name="description" content=""> <meta name="keywords" content=""> <meta name="author" content="DMD/UVQ"> <link rel="icon" href="/favicon.ico"> <title>'+carpeta.titulo+' / '+paginaTitulo+'</title> <!-- DMD core CSS --> <link href="piel/css/bootstrap-DMD-theme.min.css" rel="stylesheet"><!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries --> <!--[if lt IE 9]> <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script> <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script> <![endif]--> </head>';
	
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

				var elementoUrl = makeUrl(elementoDelta+'_'+elementoTitulo);
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
		var elementTitulo = '<h1 id="'+paginaAnchor+'" class="titulo-pagina">'+paginaTitulo+'</h1>';

		var elementObjetivos = getPreliminares(element_group, 'unidad_objetivos');
		var elementIntro = getPreliminares(element_group, 'unidad_introduccion');
		}

		if(elementTipe === 'anexo'){
			var elementDelta = '<div class="delta '+elementTipe+'-delta">'+romanize(delta)+'</div>';
			var elementTitulo = '<h1 id="titulo-anexo" class="titulo-pagina">Anexo</h1>';
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
		var partTitulo = '';

		if(what_to_get === 'unidad_objetivos')partTitulo = '<h3 class="preliminares-title" >Objetivos de la Unidad</h3>';
		if(what_to_get === 'unidad_introduccion')partTitulo = '<h3 class="preliminares-title" >Introducción a la Unidad</h3>';

		op = op+'<div class="preliminares '+what_to_get+'">'+partTitulo+getContent(obj)+'</div>';
	}

	return op;

}

// Parsear artados y sub apartados
function getParts(element, what_to_get,parent_delta){
	var op = '';
	var titleLvl = 2;
	if(what_to_get==='subapartado')titleLvl = 3;

	if(element.getElementsByTagName(what_to_get)){
		var parts = element.getElementsByTagName(what_to_get);
		if(parts.length > 0)op = '<div class="'+what_to_get+'s">';
		

		for (var i=0; i < parts.length; i++) {

			if(parts[i].getElementsByTagName(what_to_get+'_titulo')[0]){
				var partDelta = parent_delta+'.'+(i+1);
			
				var unidadDelta = '<span class="delta '+what_to_get+'-delta">'+partDelta+'.</span>';

				var partTitRaw = makeUrl(parts[i].getElementsByTagName(what_to_get+'_titulo')[0].childNodes[0].nodeValue);

				var partId = makeUrl(partDelta+'_'+partTitRaw);
				var partTitulo = '<h'+titleLvl+' class="part-title">'+unidadDelta+' '+parts[i].getElementsByTagName(what_to_get+'_titulo')[0].childNodes[0].nodeValue+'</h'+titleLvl+'>';
				
			}
			var bloques = getBloques(parts[i]);
			var subapartados = getParts(parts[i], 'subapartado',partDelta);

			op = op+'<div id="'+partId+'" class="'+what_to_get+' '+what_to_get+'-'+i+'">'+partTitulo+bloques+subapartados+'</div>';
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

				var bloqueContent = '<div class="bloque-contenido collapse in">'+getContent(bloques[i])+'</div>';
				
				var tooltipStr = '';

				var collapseStr = '<div class="collapse-indicator rotate">+</div>';

				var iconoStr = '<div class="icono"></div>';
				switch (bloqueTipo){
					case "actividad": 
					iconoStr = '<div class="icono">K</div>';
					break;

					case "cita": 
					iconoStr = '<div class="icono">C</div>';
					break;

					case "leer_con_atencion": 
					iconoStr = '<div class="icono">L</div>';
					break;

					case "pastilla": 
					iconoStr = '';
					bloqueContent = '<a href="#myModal" data-toggle="modal" class="icono">N</a>
					<div id="myModal" class="modal">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<div class="icono">N</div>
							<div class="modal-title">Pastilla</div>
						</div>
						<div class="modal-body">
							<p>'+getContent(bloques[i])+'</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
						</div>
					</div><!-- /.modal -->';
					collapseStr = '';
					iconoStr = '';
					break;

					case "ejemplo": 
					iconoStr = '<div class="icono">X</div>';
					break;

					case "para_ampliar": 
					//bloqueContent = '<div class="bloque-contenido collapse">'+getContent(bloques[i])+'</div>';
					//collapseStr = '<div class="collapse-indicator">+</div>';
					iconoStr = '<div class="icono">A</div>';
					break;

					case "para_reflexionar": 
					iconoStr = '<div class="icono">P</div>';
					bloqueContent = '<div class="bloque-contenido collapse">'+getContent(bloques[i])+'</div>';
					collapseStr = '<div class="collapse-indicator">+</div>';
					iconoStr = '<div class="icono">A</div>';
					break;

					case "texto_aparte": 
					iconoStr = '<div class="icono"></div>';
					bloqueContent = '<div class="bloque-contenido collapse">'+getContent(bloques[i])+'</div>';
					collapseStr = '<div class="collapse-indicator">+</div>';
					iconoStr = '<div class="icono">A</div>';
					break;

					case "lectura_obligatoria": 
					iconoStr = '<div class="icono">O</div>';
					break;

					case "lectura_recomendada": 
					iconoStr = '<div class="icono">O</div>';
					bloqueContent = '<div class="bloque-contenido collapse">'+getContent(bloques[i])+'</div>';
					collapseStr = '<div class="collapse-indicator">+</div>';
					iconoStr = '<div class="icono">A</div>';
					break;

					case "audio": 
					iconoStr = '<div class="icono">S</div>';
					break;

					case "audiovisual": 
					iconoStr = '<div class="icono">E</div>';
					bloqueContent = '<div class="bloque-contenido collapse in">'+getContent(bloques[i])+'<div class="row"><div class="col-­sm­‐8"><iframe >LINK</iframe></div></div></div>';

					break;

					case "imagen": 
					iconoStr = '<div class="icono"></div>';
					break;

					case "web": 
					iconoStr = '<div class="icono">W</div>';
					break;



					default:
					
				}

				

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

