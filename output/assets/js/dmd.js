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
    
    var mainOfset = 120;
    var regularMargins = 50;
    

    var pathname = window.location.pathname;
    var fileNameUrl = pathname.substring(pathname.lastIndexOf('/')+1);

    $('.dmd-nav-main a').each(function() {
     var esteUrl = $(this).attr("href");
      if(fileNameUrl === esteUrl) $(this).parent().addClass("active");
      if(fileNameUrl !== esteUrl) $(this).parent().removeClass("active");
    });

    $body.scrollspy({
      target: '.dmd-sidebar',
      offset: mainOfset+regularMargins,
    })

    $window.on('load', function () {
      $body.scrollspy('refresh')
    })
    

    $('.dmd-sidebar').on('activate.bs.scrollspy', function () {
      $body.scrollspy('refresh')
    })  


    $(".smooth-trigger").on('click', function(e) {

       // prevent default anchor click behavior
       e.preventDefault();

       // store hash
       var hash = this.hash;

       // animate
       $body.animate({
           scrollTop: $(this.hash).offset().top
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


  //indice
  $('.show-menu').each(function() {
        
       

        $(this).on('click',function(e){ 
          e.preventDefault();
         // $(this).parent().parent().toggleClass('displayed');
          $(this).parent().siblings(".nav-list").collapse('toggle');
        });
        

  
      });


    //TOOLTIPS
   $('.bloque').tooltip();

    ///PASTILLAS POPOVERS
    
    /*<u type="button" class="dmd-popover" data-toggle="popover" data-content="Contneido"> bibliografía</u>*/
   
    $('.dmd-popover').popover({
      selector: '[data-toggle="popover"]',
      container: false,
      title:'P',
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
    $('.para_ampliar, .lectura_recomendada, .para_reflexionar').each(function() {
     	$(this).children('.bloque-contenido').addClass('collapse');
        //$(this).children('.bloque-contenido').collapse('hide');
       
        $(this).children('.tipo').on('click',function(){
         $(this).parent().tooltip('toggle');
         $(this).siblings(".bloque-contenido").collapse('toggle');

        });

    });

    //texto aparte
    $('.texto_aparte').each(function() {
      //$(this).children('.bloque-contenido').addClass('collapse');
      var childs = $(this).children('.bloque-contenido').children()
      
      $(this).children('.bloque-contenido').children().slice( 2, childs.length ).wrapAll('<div class="leer_mas collapse"/>');
      $(this).children('.bloque-contenido').append( '<p class="suspensivos">...</p>' );
      
      $(this).on('click',function(){
        $(this).tooltip('toggle');
        $(this).children('.bloque-contenido').children(".leer_mas").collapse('toggle');
        $(this).children('.bloque-contenido').children(".suspensivos").toggle();
      });


    });



    //UTILES & ADDS
    function isScrolledIntoView(elem){
      var margins = 100;
      var docViewTop = $(window).scrollTop()+margins;
      var docViewBottom = docViewTop + ($(window).height()/2);

      var elemTop = $(elem).offset().top;
      var elemBottom = elemTop + $(elem).height();

      return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    $window.resize(function() {
      $height = $window.height();
      $indexHeader.affix({offset: {top: $height}})
      //alert($height);
    });

  })///cierre

}(jQuery)
