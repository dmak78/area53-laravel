/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global requirejs, require, define */

(function () {
  'use strict';

  // Set up Area53 global namespace.
  window.area53 = window.area53 || {};
  window.area53.supports = window.area53.supports || {};

  /*
    Configure RequireJS
  */
  require.config({
    appDir: '/assets/javascripts',
    baseUrl: '/assets/javascripts',
    paths: {
      // Libs
      'jquery': 'libs/jquery',
      'underscore': 'libs/underscore',
      'backbone': 'libs/backbone',
      'modernizr': 'libs/modernizr',
      'text': 'libs/text',
      'swipe': 'libs/swipe',
      'moment': 'libs/moment',
      'masonry': 'libs/masonry',
      'live-validation': 'libs/live-validation',

      // View directories.
      'global': 'views/global',
      'baseviews': 'views/base',
      'components': 'views/components',
      'widgets': 'views/components/widgets',
      'platform': 'views/platform',
      'stories': 'views/stories',

      // Templates
      'templates': '../templates'
    },
    shim: {
      'underscore': {
        exports: '_',
        init: function () {
          this._.templateSettings.variable = 'data';
        }
      },
      'backbone': {
        deps: ['jquery', 'underscore'],
        exports: 'Backbone'
      },
      'modernizr': {
        exports: 'Modernizr',
        init: function () {
          // Shim from http://modernizr.com/docs/#prefixed
          this.Modernizr.transEndEventName = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
          }[this.Modernizr.prefixed('transition')];
        }
      },
      'swipe': {
        exports: 'Swipe'
      },
      'masonry': {
        exports: 'Masonry'
      },
      'live-validation': {
        exports: 'LiveValidation'
      },
      // Plugins.
      // These files don't return an object you can work with, they attach
      // themselves to the jQuery object.
      'libs/jquery.ui': ['jquery'],
      'libs/jquery.ui.timepicker': ['libs/jquery.ui', 'jquery'],
      'libs/bootstrap-wysihtml5': ['jquery', 'libs/wysihtml5-0.3.0',
                                   'libs/advanced-parser'],
      'libs/jquery.timeago' :     ['jquery'],                       
      'libs/tag-it': ['jquery'],
      'libs/bootstrap': ['jquery']
    }
  });
}());

/*
  Main module.
*/
define([
  // Libs
  'jquery',
  'backbone',
  'libs/notifier',
  'libs/dialogs',
  'modernizr',

  // Routers
  'routers/router',

  // jQuery plugins.
  'libs/bootstrap',
  'libs/jquery.ui',
   'libs/jquery.timeago'
], function ($, Backbone, Notifier, DialogManager, Modernizr, Router) {
  'use strict';

  // Detect if the browser does't support transitions.
  window.area53.supports.transition = Modernizr.prefixed('transition');

  // Set up the breakpoint notifier.
  window.area53.notifier = new Notifier({
    phone: {max: 480},
    tablet: {max: 800, min: 481},
    desktop: {min: 801}
  });

  // Set up the modal dialog manager.
  window.area53.dialogs = new DialogManager();

  // Doc-ready
  $(function () {
    var router;

    // Start it up.
    router = new Router();
    Backbone.history.start({pushState: true, hashChange: false});

    // Fire the first set of callbacks.
    window.area53.notifier.fireCallbacks();
  });
});