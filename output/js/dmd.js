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
    
    var mainOfset = 70;
    var pathname = window.location.pathname;
    var fileNameUrl = pathname.substring(pathname.lastIndexOf('/')+1);
    //alert(fileNameUrl);

    $('.dmd-nav-main a').each(function() {
     var esteUrl = $(this).attr("href");
      if(fileNameUrl === esteUrl) $(this).parent().addClass( "active" );
      if(fileNameUrl !== esteUrl) $(this).parent().removeClass( "active" );

    });

    $body.scrollspy({
      target: '.dmd-sidebar',
      offset: mainOfset
    })
    $window.on('load', function () {
      $body.scrollspy('refresh')
    })
    /*
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this).scrollspy('refresh')
    })
  */

  $('.dmd-sidebar').on('activate.bs.scrollspy', function () {
    //alert('this');
    $body.scrollspy('refresh')
  })  





    $(".smooth-trigger").on('click', function(e) {

       // prevent default anchor click behavior
       e.preventDefault();

       // store hash
       var hash = this.hash;

       // animate
       $('html, body').animate({
           scrollTop: $(this.hash).offset().top - mainOfset
         }, 300, function(){

           // when done, add hash to url
           // (default click behaviour)
           window.location.hash = hash;
         });
     });
    
    // Kill links
    $('.dmd-container [href=#]').click(function (e) {
      e.preventDefault()
    })

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
          bottom: function () {
            return (this.bottom = $('.dmd-footer').outerHeight(true))
          }
        }
      })
    }, 100)

    setTimeout(function () {
      $('.bs-top').affix()
    }, 100)


    /*
    // theme toggler
    ;(function () {
      var stylesheetLink = $('#bs-theme-stylesheet')
      var themeBtn = $('.dmd-theme-toggle')

      var activateTheme = function () {
        stylesheetLink.attr('href', stylesheetLink.attr('data-href'))
        themeBtn.text('Disable theme preview')
        localStorage.setItem('previewTheme', true)
      }

      if (localStorage.getItem('previewTheme')) {
        activateTheme()
      }

      themeBtn.click(function () {
        var href = stylesheetLink.attr('href')
        if (!href || href.indexOf('data') === 0) {
          activateTheme()
        } else {
          stylesheetLink.attr('href', '')
          themeBtn.text('Preview theme')
          localStorage.removeItem('previewTheme')
        }
      })
    })();
    */
    /*
    // Tooltip and popover demos
    $('.tooltip-demo').tooltip({
      selector: '[data-toggle="tooltip"]',
      container: 'body'
    })
    $('.popover-demo').popover({
      selector: '[data-toggle="popover"]',
      container: 'body'
    })
    */
    

     /*
    // Demos within modals
    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    // Popover demos
    $('.dmd-popover').popover()

    // Button state demo
    $('#loading-example-btn').click(function () {
      var btn = $(this)
      btn.button('loading')
      setTimeout(function () {
        btn.button('reset')
      }, 3000)
    })
    */

    /*
    // Config ZeroClipboard
    ZeroClipboard.config({
      moviePath: '/assets/flash/ZeroClipboard.swf',
      hoverClass: 'btn-clipboard-hover'
    })

    // Insert copy to clipboard button before .highlight or .bs-example
    $('.highlight').each(function () {
      var highlight = $(this)
      var previous = highlight.prev()
      var btnHtml = '<div class="zero-clipboard"><span class="btn-clipboard">Copy</span></div>'

      if (previous.hasClass('bs-example')) {
        previous.before(btnHtml.replace(/btn-clipboard/, 'btn-clipboard with-example'))
      } else {
        highlight.before(btnHtml)
      }
    })
    var zeroClipboard = new ZeroClipboard($('.btn-clipboard'))
    var htmlBridge = $('#global-zeroclipboard-html-bridge')

    // Handlers for ZeroClipboard
    zeroClipboard.on('load', function () {
      htmlBridge
        .data('placement', 'top')
        .attr('title', 'Copy to clipboard')
        .tooltip()
    })

    // Copy to clipboard
    zeroClipboard.on('dataRequested', function (client) {
      var highlight = $(this).parent().nextAll('.highlight').first()
      client.setText(highlight.text())
    })

    // Notify copy success and reset tooltip title
    zeroClipboard.on('complete', function () {
      htmlBridge
        .attr('title', 'Copied!')
        .tooltip('fixTitle')
        .tooltip('show')
        .attr('title', 'Copy to clipboard')
        .tooltip('fixTitle')
    })

    // Notify copy failure
    zeroClipboard.on('noflash wrongflash', function () {
      htmlBridge
        .attr('title', 'Flash required')
        .tooltip('fixTitle')
        .tooltip('show')
    })
*/
  })

}(jQuery)
