/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
  Global header view.

  Global header element, used across all pages.

  Related Sass files:
    - layouts/global/_header.scss
*/
define([
  // Libs.
  'jquery',
  'underscore',
  'backbone',

  // Base views.
  'baseviews/hpBaseView'
], function ($, _, Backbone, HpBaseView) {
  'use strict';

  return HpBaseView.extend({
    // Track if the about link has been moved into the primary nav.
    aboutLinkMoved: false,
    
    /**
     * Initialize.
     */
    initialize: function () {
      // Set up responsive callbacks.
      // window.area53.notifier.setCallbacks({
      //   desktop: _.bind(this.resetAboutLink, this),
      //   tablet: _.bind(this.moveAboutLink, this),
      //   phone: _.bind(this.moveAboutLink, this)
      // });
    },

    events: {
      'click .primary-navigation a' : 'pushStateNav',
      'click a.global-logo' : 'pushStateNav',
    },

    /**
     * Render.
     *
     * Returns this.
     */
    render: function () {
      // Turn on the tooltip.
      this.tooltip('.global-logo');
      
      return this;
    },
    
    /**
     * Move the about link into the primary navigation.
     *
     * Returns this.
     */
    moveAboutLink: function () {
      var $navList = this.$el.find('.primary-navigation ul'),
        $about = this.$el.find('.about-link');
        
      if (this.aboutLinkMoved) {
        return this;
      }
      
      // Wrap the link in an li.
      $about = $about.css('visibility', 'visible').wrap('<li />').parent();
      
      $navList.append($about);
      
      this.aboutLinkMoved = true;
      
      return this;
    },
    
    /**
     * Move the about link out of the primary nav.
     *
     * Returns this.
     */
    resetAboutLink: function () {
      var $about = this.$el.find('.about-link'),
        $content = this.$el.find('.header-content');
      
      if (!this.aboutLinkMoved) {
        return this;
      }
      
      $content.append($about.unwrap());
      
      this.aboutLinkMoved = false;
      
      return this;
    }
  });
});