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
    
    var mainOfset = 70;
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


    $(".unidad .smooth-trigger").on('click', function(e) {

       // prevent default anchor click behavior
       e.preventDefault();

       // store hash
       var hash = this.hash;

       // animate
       $body.animate({
           scrollTop: $(this.hash).offset().top
         }, 300, function(){

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
            var offsetTop      = $sideBar.offset().top + mainOfset
            var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
            var navOuterHeight = $('.dmd-nav').height()

            return (this.top = offsetTop - navOuterHeight - sideBarMargin)
            //return 70
          },
         // bottom: function () { return (this.bottom = $('.dmd-footer').outerHeight(true))}
        }
      })
    }, 100)
    
    var $indexHeader = $('.index .navbar')
    setTimeout(function () {
      
          $indexHeader.affix({offset: {top: $height}})
    }, 100)

  
    //TOOLTIPS
   $('.bloque').tooltip();

    ///PASTILLAS POPOVERS
    
    /*<u type="button"class="dmd-popover"data-toggle="popover"data-content="Contneido"> bibliografía</u>*/
   
    $('.dmd-popover').popover({
      selector: '[data-toggle="popover"]',
      container: false,
      title:'Pastilla',
      placement:'top',
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
     $('.texto_aparte, .para_ampliar, .lectura_recomendada').each(function() {
     	$(this).children('.bloque-contenido').addClass('collapse');
        //$(this).children('.bloque-contenido').collapse('hide');
       
        $(this).children('.tipo').on('click',function(){
          $(this).siblings(".bloque-contenido").collapse('toggle');
          $(this).parent().tooltip('toggle');
        });



    });



    //UTILES & ADDS
    function isScrolledIntoView(elem){
      var margins = 100;
      var docViewTop = $(window).scrollTop()+margins;
      var docViewBottom = docViewTop + ($(window).height()/4);

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
