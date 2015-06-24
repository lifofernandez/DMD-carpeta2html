// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

/* global ZeroClipboard */

!function ($) {
  'use strict';

  $(function () {

    // Scrollspy
    var $window = $(window)
    var $body   = $(document.body)

    var $height = $window.height()
   
    var regularMargins = 20;
    
    var mainOffset = 65 + regularMargins;
 
    

    var pathname = window.location.pathname;
    var fileNameUrl = pathname.substring(pathname.lastIndexOf('/')+1);

    $('.dmd-nav-main a').each(function() {
     var esteUrl = $(this).attr("href");
      if(fileNameUrl === esteUrl) $(this).parent().addClass("active");
      if(fileNameUrl !== esteUrl) $(this).parent().removeClass("active");
    });

    $body.scrollspy({
      target: '.dmd-sidebar',
      offset: mainOffset,
    })

    $window.on('load', function () {
      $body.scrollspy('refresh')
    })
    




      
    $('.dmd-sidebar').on('activate.bs.scrollspy', function () {
      $body.scrollspy('refresh')
    })

    //custom spy para intro

    $(window).scroll(function() {
      if ($body.is('.index')) { //if is index/home
        var elemTop = $('#intro').offset().top;
        var elemBottom = elemTop + $('#intro').height();

        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        //console.log(docViewTop);

        if (elemTop >= docViewTop)$('#intro-trigger').parent().removeClass('active');
        if (elemTop <= docViewTop)$('#intro-trigger').parent().addClass('active');
        if (elemBottom <= docViewBottom)$('#intro-trigger').parent().removeClass('active');
      }
    });

    if ($body.is('.index')) {
     $('#intro-trigger').addClass('smooth-trigger');
    }


    $(".smooth-trigger").on('click', function(e) {

       // prevent default anchor click behavior
       e.preventDefault();

       // store hash
       var hash = this.hash;

       // animate
       $body.animate({
           scrollTop: $(this.hash).offset().top - mainOffset
         }, 500, function(){

           // when done, add hash to url
           // (default click behaviour)
           e.preventDefault();
           //window.location.hash = hash;
         });
     });
    
    // Sidenav affixing
    setTimeout(function () {
      var $sideBar = $('.dmd-sidebar')

      $sideBar.affix({
        offset: {
          top: function () {
            var offsetTop      = $sideBar.offset().top
            var offsetTop      = 0

            var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
            var navOuterHeight = $('.dmd-nav').height()

            return (this.top = offsetTop - navOuterHeight - sideBarMargin)
            //return 70
          },
         // bottom: function () { return (this.bottom = $('.dmd-footer').outerHeight(true))}
        }
      })
    }, 100)
    

    ///home relative
    var $indexHeader = $('.index .navbar')
    setTimeout(function () {
          $indexHeader.affix({offset: {top: $height}})
    }, 100)

    $indexHeader.on('affixed.bs.affix', function () {
      //alert('oo');
      $('#intro-indice').addClass('pushed');
    })  
    $indexHeader.on('affixed-top.bs.affix', function () {
      //alert('oo');
      $('#intro-indice').removeClass('pushed');
    })  


    $window.resize(function() {
      $height = $window.height();
      $indexHeader.affix({offset: {top: $height}})
      //alert($height);
    });


  //indice
  $('.show-menu').each(function() {
        
    $(this).on('click',function(e){ 
      e.preventDefault();
      //$(this).parent().parent().toggleClass('displayed');
      $(this).parent().siblings(".nav-list").collapse('toggle');
    });

  });


  //TOOLTIPS
   $('.bloque').tooltip();

    ///PASTILLAS POPOVERS
    
    /*<u type="button" class="dmd-popover" data-toggle="popover" data-content="Contneido"> bibliografía</u>*/
   
    $('.dmd-popover').popover({
      selector: '[data-toggle="popover"]',
      //container: false,
      title:'N',
      placement:'bottom',
      trigger:'manual',
      html:true,
      //viewport: 'body',
      delay: { "show": 200, "hide": 100 },
    }).on('click',function(){ $(this).popover('toggle'); });

    
    $(window).scroll(function(){
      $('.dmd-popover').each(function() {
        
        var tmpState = isScrolledIntoView(this);
        var change = (tmpState !== $(this).hasClass('on-screen'));
        //console.log(change);
        
        if(tmpState && change)$(this).addClass('on-screen');
        if(!tmpState && change)$(this).removeClass('on-screen');

        if($(this).hasClass('on-screen') && change)$(this).popover('show').on('click',function(){ $(this).popover('toggle') });
        if(!$(this).hasClass('on-screen') && change)$(this).popover('hide').on('click',function(){ $(this).popover('toggle') });
  
      });
      
    });
    

    ///COLLAPSES
    $(' .bloque').each(function() {
      $(this).children('.bloque-contenido').addClass('collapse in');
      //$(this).children('.bloque-contenido').collapse('hide');
      //$(this).children('.tipo').children('.collapse-indicator').addClass('rotate');

      $(this).children('.bloque-header').children('.collapse-indicator').on('click',function(){
        $(this).toggleClass('rotate');
        $(this).parent().parent().tooltip('toggle');
        $(this).parent().siblings(".bloque-contenido").collapse('toggle');

      });

    });


    
    /*
    $('.para_ampliar, .lectura_recomendada, .para_reflexionar').each(function() {
     	$(this).children('.bloque-contenido').addClass('collapse');
        //$(this).children('.bloque-contenido').collapse('hide');
       
        $(this).children('.tipo').on('click',function(){
          $(this).children('.collapse-indicator').toggleClass('rotate');
          $(this).parent().tooltip('toggle');
          $(this).siblings(".bloque-contenido").collapse('toggle');


        });

    });


    $(' .lectura_obligatoria').each(function() {
      $(this).children('.bloque-contenido').addClass('collapse in');
        //$(this).children('.bloque-contenido').collapse('hide');
      //$(this).children('.tipo').children('.collapse-indicator').addClass('rotate');

        $(this).children('.tipo').on('click',function(){
          $(this).children('.collapse-indicator').toggleClass('rotate');
          $(this).parent().tooltip('toggle');
          $(this).siblings(".bloque-contenido").collapse('toggle');

        });

    });
    
*/

    //BLOQUES & iconos
/*
    $('.leer_con_atencion').each(function() {
      var element = $(this).children('.tipo').wrapInner('<div class="leyenda"/>');
      //$(this).prepend(element);
      element.prepend('<div class="icono">L</div>');
    });

    $('.para_reflexionar').each(function() {
      var element = $(this).children('.tipo').wrapInner('<div class="leyenda"/>');
      //$(this).prepend(element);
      element.prepend('<div class="icono">P</div>');
      element.append('<div class="collapse-indicator">+</div>');
    });

    $('.para_ampliar').each(function() {
      var element = $(this).children('.tipo').wrapInner('<div class="leyenda"/>');
      //$(this).prepend(element);
      element.prepend('<div class="icono">A</div>');
      element.append('<div class="collapse-indicator">+</div>');
    });

    //texto aparte
    $('.texto_aparte').each(function() {
      //$(this).children('.bloque-contenido').addClass('collapse');
      var childs = $(this).children('.bloque-contenido').children()
      
      $(this).children('.bloque-contenido').children().slice( 2, childs.length ).wrapAll('<div class="leer_mas collapse"/>');
      $(this).children('.bloque-contenido').append( '<div class="footer"><div class="suspensivos">...</div><div class="collapse-indicator">+</div></div>' );
      $(this).on('click',function(){
        $(this).tooltip('toggle');
        $(this).children('.bloque-contenido').children(".leer_mas").collapse('toggle');
        $(this).children('.bloque-contenido').children(".footer").children(".suspensivos").toggle();
        $(this).children('.bloque-contenido').children(".footer").children(".collapse-indicator").toggleClass('rotate');
      });
    });

    $('.cita').each(function() {
      //var element = $(this).children('.bloque-contenido');
      //$(this).prepend(element);
      $(this).prepend('<div class="icono">C</div>');
    });
    $('.ejemplo').each(function() {
      //var element = $(this).children('.bloque-contenido');
      //$(this).prepend(element);
      $(this).prepend('<div class="icono">X</div>');
    });

    $('.lectura_obligatoria').each(function() {
      var element = $(this).children('.tipo').wrapInner('<div class="leyenda"/>');
      //$(this).prepend(element);
      element.prepend('<div class="icono">O</div>');
      element.append('<div class="collapse-indicator rotate">+</div>');
    });
    $('.lectura_recomendada').each(function() {
      var element = $(this).children('.tipo').wrapInner('<div class="leyenda"/>');
      //$(this).prepend(element);
      element.prepend('<div class="icono">O</div>');
      element.append('<div class="collapse-indicator">+</div>');
    });

    //Actividad
    $('.actividad').each(function() {
      var element = $(this).children('.bloque-contenido').children(".delta").detach();
      $(this).prepend(element);
      $(this).append('<div class="icono">K</div>');
    });

    $('.audio').each(function() {
      var element = $(this).children('.bloque-contenido').children("p").children("a");
      // $(this).prepend(element);
      element.parent().parent().parent().prepend('<div class="icono">S</div>');
    });

    $('.audiovisual').each(function() {
      var element = $(this).children('.bloque-contenido').children("p").children("img").wrap('<div class="insideblock"/>');
      //$(this).prepend(element);
      element.parent().append('<div class="icono">E</div>');
    });

    $('.web').each(function() {
      var element = $(this).children('.bloque-contenido').children("p").children("a").parent().wrap('<div class="insideblock"/>');
      //$(this).prepend(element);
      element.parent().prepend('<div class="icono">W</div>');
    });
*/

    //UTILES & ADDS
    function isScrolledIntoView(elem){
      var margins = 100;
      var docViewTop = $(window).scrollTop()+margins;
      var docViewBottom = docViewTop + ($(window).height()/2);

      var elemTop = $(elem).offset().top;
      var elemBottom = elemTop + $(elem).height();

      return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }


  })///cierre

}(jQuery)
