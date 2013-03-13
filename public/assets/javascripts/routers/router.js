/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global console, require, define */

/*
  Main application router.
*/
define([
  // Exports
  'exports',

  // Libs
  'jquery',
  'underscore',
  'backbone',

  // Views
  'global/headerView',
  'platform/groupPhotosView'
], function (exports, $, _, Backbone, HeaderView, GroupPhotosView) {
  'use strict';

  return Backbone.Router.extend({
    routes: {
      // Group photos page needs routing.
      'group-photos': 'groupPhotosPage',
      'group-photos/:album': 'showGroupAlbum',
      'group-photos/:album/:photo': 'showGroupAlbumPhoto',

      'home' : 'viewHome',

      'profile' : 'viewProfile',
      'profile/:id' : 'viewProfile',

      'list-gifs' : 'viewListGifs',

      'group' : 'viewGroup',
      'group/:id' : 'viewGroup',

      // Routes.
      ':all': 'allRoutes',
      '*splat' : 'allRoutes'
    },

    /**
     * Test function.
     */
    test: function (route) {
      console.log('test callback', route);
    },

    /**
     * Initialize.
     */
    initialize: function () {
      // Get the section name from the global config object.
      this.sectionName = window.area53.config.sectionName;

      // Init the global views.
      this.headerView = new HeaderView({el: '.global-header'});
      this.headerView.render();

      // Export the navigate function.
      exports.navigate = this.navigate;

      // Support non-pushState enabled browsers, since we're not allowing
      // those browsers to fallback to use hash fragments.
      if (!window.history.pushState) {
        this.ieFallback();
      }
    },

    /**
     * IE fallback routing.
     *
     * Returns this.
     */
    ieFallback: function () {
      var pathname = window.location.pathname.slice(1),
        regex,
        callbackKey;

      // Get the regex for this route.
      regex = _.find(Backbone.history.handlers, function (value, index) {
        callbackKey = _.keys(this.routes)[index];
        return value.route.test(pathname) ? value : false;
      }, this).route;

      // Run the callback for this route.
      this[this.routes[callbackKey]].apply(this, regex.exec(pathname).slice(1));
      return this;
    },

    /**
     * Group photos page.
     * Renders the albums belonging to a group.
     *
     * Returns this.
     */
    groupPhotosPage: function () {
      if (!this.groupPhotosView) {
        this.groupPhotosView = new GroupPhotosView({el: 'body'});
      }

      this.groupPhotosView.getData('renderAlbumList');
      return this;
    },

    /**
     * Render the contents of a group album.
     *
     * album  - Matched route. Expects an album id.
     *
     * Returns this.
     */
    showGroupAlbum: function (album) {
      if (!this.groupPhotosView) {
        this.groupPhotosView = new GroupPhotosView({el: 'body'});
      }

      this.groupPhotosView.getData('renderSingleAlbum', {album: album});
      return this;
    },

    /**
     * Render a single photos in an album.
     *
     * album  - Album id from the route.
     * photo  - Photo id from the route.
     *
     * Returns this.
     */
    showGroupAlbumPhoto: function (album, photo) {
      if (!this.groupPhotosView) {
        this.groupPhotosView = new GroupPhotosView({el: 'body'});
      }

      this.groupPhotosView.getData('renderPhoto', {album: album, photo: photo});
      return this;
    },

    /**
     * Handler for all application routes. Determines which view file to
     * load up.
     *
     * route - Route name passed from the Backbone routes object.
     *
     * Returns nothing.
     */
    allRoutes: function (route) {
      var camelCaseName = this.camelCase(route),
        scriptName = this.sectionName + '/' + camelCaseName + 'View';
        console.log(scriptName);
      //require([scriptName], function (View) {
        require(['platform/homeView'], function (View) {
        var view = new View({el: 'body'});
        view.render();
      });
    },

    viewHome: function () {
        require(['platform/homeView'], function (View) {
        var view = new View({el: 'body'});
        view.render();
      });
    },
    viewProfile: function (id) {
        require(['platform/profileView'], function (View) {
        var view = new View({el: 'body'});
        view.profileId = id;
        view.render();
      });
    },
    viewGroup: function (id) {
        require(['platform/groupView'], function (View) {
        var view = new View({el: 'body'});
        view.groupId = id;
        view.render();
      });
    },
    viewListGifs: function () {
        require(['platform/listGifView'], function (View) {
        var view = new View({el: 'body'});
        view.render();
      });
    },

    /**
     * Public: Camel case a string.
     *
     * string - String to convert to camel case.
     *
     * Returns the camelCase version of a string.
     */
    camelCase: function (string) {
      var split = string.split(/[\-_]/),
        camelCase = '';

      // Get the first item.
      camelCase += split.shift().toLowerCase();

      _.each(split, function (part) {
        // Strip out any query strings.
        if (_.indexOf(part, '?') > -1) {
          part = part.substring(0, part.indexOf('?'));
        }

        camelCase += part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      }, this);

      return camelCase;
    }
  });
});