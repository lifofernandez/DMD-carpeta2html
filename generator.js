var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;

///load 
var xmlFile = fs.readFileSync(__dirname + '/contents.xml', "utf8");

//parse
var doc = new DOMParser().parseFromString(xmlFile, 'text/xml');

var mainHtml = {};
//build html
var mainNav = [];

function buildIndex() {
	
	var title = doc.getElementsByTagName('carpeta_titulo')[0].childNodes[0].nodeValue;
	var introduccion = doc.getElementsByTagName('introduccion')[0];

	var unidades = doc.getElementsByTagName('unidad');
	var anexos = doc.getElementsByTagName('anexo');

	
	//construct nav
	var unidadesBtns = '';
	[].forEach.call(unidades, function (element, index) {
	  	unidadesBtns=unidadesBtns+'<li><a href=unidad-'+(index+1)+'.html>Unidad '+(index+1)+'</a></li>';
	});

	var anexosBtns = '';
	[].forEach.call(anexos, function (element, index) {
		anexosBtns=anexosBtns+'<li><a href=anexo-'+(index+1)+'.html>Anexo '+romanize(index+1)+'</a></li>';
	});

	mainNav.open='<div class="container">';
    mainNav.header='<div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="index.html">'+title+'</a></div>';
    mainNav.collapse ='<nav class="navbar-collapse collapse" role="navigation"><ul class="nav navbar-nav">'+unidadesBtns+anexosBtns+'</ul></nav><!--/.nav-collapse -->';
	mainNav.close='</div>';

	//concat nav
	var nab = mainNav.open+mainNav.header+mainNav.collapse+mainNav.close;


	mainHtml.open = '<!DOCTYPE html><html>';
	
	mainHtml.head = '<head><meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta name="description" content=""> <meta name="keywords" content=""> <meta name="author" content="DMD/UVQ"> <link rel="icon" href="/favicon.ico"> <title>'+title+'</title> <!-- Bootstrap core CSS --> <link href="css/bootstrap.css" rel="stylesheet"><!-- Documentation extras --><link href="css/docs.css" rel="stylesheet"><!-- Custom styles for this template --> <link href="css/navbar-fixed-top.css" rel="stylesheet"><!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries --> <!--[if lt IE 9]> <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script> <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script> <![endif]--> </head><body>';
	
	mainHtml.header = '<header class="navbar navbar-default navbar-fixed-top" id="top" role="banner">'+nab+'</header>';
	

	mainHtml.footer = '<footer>DMD / UVQ</footer>';
	mainHtml.close = '<!-- Bootstrap core JavaScript --> <!-- Placed at the end of the document so the pages load faster --> <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> <script src="js/bootstrap.js"></script> <script src="js/holder.js"></script> <script src="js/application.js"></script><script src="js/ZeroClipboard.min.js"></script><!-- IE10 viewport hack for Surface/desktop Windows 8 bug --> <script src="/js/ie10-viewport-bug-workaround.js"></script></body></html>';

	//var autor_nombre = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;
	//var autor_bio = doc.getElementsByTagName('autor')[0].childNodes[0].nodeValue;
	

	var unidedIndex = generarUnidades(unidades);
	var anexosIndex = generarAnexos(anexos);

	
	var content = '<div class="container"><section>'+introduccion+'</section><section>'+unidedIndex+anexosIndex+'</section></div>';
	

	return mainHtml.open+mainHtml.head+mainHtml.header+content+mainHtml.footer+mainHtml.close;
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
		var unidadDelta = (i+1);
		var unidadUrl = 'unidad-'+(i+1)+'.html';
		var unidadLink = '<a href="'+unidadUrl+'">'+unidadDelta+' '+unidadTitulo+'</a>';
		
		generarPaginaUnidad(unidades[i], unidadUrl,(i+1));

		var apartados = unidades[i].getElementsByTagName('apartado');
		var indiceApartados = indexFromElements(apartados,'apartado_titulo',unidadUrl,unidadDelta,'subapartado', 'subapartado_titulo');

		var itemUnidad = '<li>'+unidadLink+indiceApartados+'</li>';
		
		indiceUnidades=indiceUnidades+itemUnidad;
	}///TERMINA UNIDAD
	return indiceUnidades=indiceUnidades+'</ul>';
}

function generarAnexos(anexos){
	var indiceAnexos = '<ul>';
	for (var i=0; i < anexos.length; i++) {

		var anexoTitulo = 'Anexo';
		var anexoNumeral = romanize(i+1);

		var anexoUrl = 'anexo-'+(i+1)+'.html';
		var anexoLink = '<a href="'+anexoUrl+'">'+anexoTitulo+' '+anexoNumeral+'</a>';
		
		//generarPaginaUnidad(anexos[i], anexoUrl);

		var apartados = anexos[i].getElementsByTagName('apartado');
		var indiceApartados = indexFromElements(apartados,'apartado_titulo',anexoUrl,'','subapartado', 'subapartado_titulo');

		var itemAnexo = '<li>'+anexoLink+indiceApartados+'</li>';
		
		indiceAnexos=indiceAnexos+itemAnexo;
	}///TERMINA UNIDAD
	return indiceAnexos=indiceAnexos+'</ul>';
}


function generarPaginaUnidad(unidad,fileName,delta){

	var unidadTitulo = unidad.getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue;
	var apartados = unidad.getElementsByTagName('apartado');
	
	var indiceApartados = '<div class="col-md-3"><div class="bs-docs-sidebar hidden-print hidden-xs hidden-sm affix-top" role="complementary">'+indexFromElements(apartados,'apartado_titulo','',delta,'subapartado', 'subapartado_titulo')+'</div></div>';


	var	content = '<div class="col-md-9" role="main">'+parseUnidad(unidad,delta)+'</div>';

	var body = '<div class="container"><div class="row">'+indiceApartados+content+'</div></div>';

	var streamUni = fs.createWriteStream('output/'+fileName);
	streamUni.once('open', function(fd) {
		var html = mainHtml.open+mainHtml.head+mainHtml.header+body+mainHtml.footer+mainHtml.close;
		streamUni.end(html);
	});

}

//GENERATE MAIN INDEX
function indexFromElements(elementos,what_to_get,base_link,parent_delta,child_to_get,what_inChild_to_get){
	var output = '';
	if(elementos.length > 0){
		if(child_to_get !== 'subapartado')output = '<ul class="nav bs-docs-nav">';
		if(child_to_get === 'subapartado')output = '<ul class="nav">';

		for (var i=0; i < elementos.length; i++) {
			if(elementos[i].getElementsByTagName(what_to_get)[0]){
				if(parent_delta !== '')var elementoDelta = parent_delta+'.'+(i+1);
				if(parent_delta === '')var elementoDelta = '';
				var elementoTitulo = elementos[i].getElementsByTagName(what_to_get)[0].childNodes[0].nodeValue;

				var elementoUrl = makeUrl(elementoTitulo);
				var elementoLink = '<a href="'+base_link+'#'+elementoUrl+'">'+elementoDelta+' '+elementoTitulo+'</a>';
				
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



///PARSEO DE UNIDADES Y FUNCIONES PARA CONTENIDO
function parseUnidad(elementGroup, delta){
	var output = '<div class="article unidad unidad-'+delta+'">';

	if(elementGroup.childNodes){
		//var elementos = elementGroup.childNodes;
		var unidadDelta = '<div class="delta">'+delta+'</div>';
		var titulo = '<h2>'+elementGroup.getElementsByTagName('unidad_titulo')[0].childNodes[0].nodeValue+'</h2>';
		
		var objetivos = getPreliminares(elementGroup, 'unidad_objetivos');
		var intro = getPreliminares(elementGroup, 'unidad_introduccion');
		
		var apartados = getParts(elementGroup, 'apartado',delta);

		var unidadHeader = '<header>'+unidadDelta+titulo+'</header>'
		output = unidadHeader+objetivos+intro+apartados; 
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
			var bloqueTipo =  bloques[i].getAttribute('tipo').replace('recurso_','');
			var bloqueContent = getContent(bloques[i]);
			var op=op+'<div class="bloque '+bloqueTipo+'"><div class="tipo">'+bloqueTipo+'</div>'+bloqueContent+'</div>';
		
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
function makeUrl(input){
	return input.latinize().replace(/ /g,'-').toLowerCase();
}

var Latinise={};Latinise.latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
String.prototype.latinise=function(){return this.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return Latinise.latin_map[a]||a})};
String.prototype.latinize=String.prototype.latinise;
String.prototype.isLatin=function(){return this==this.latinise()}

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

