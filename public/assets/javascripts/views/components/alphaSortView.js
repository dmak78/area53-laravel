/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Alpha sort view.
  
  Uses the Bootstrap pagination styles. Turns the A-Z sort
  into a select box on mobile breakpoints.
*/
define([
  // Libs
  'jquery',
  'underscore',
  
  // Base views.
  'baseviews/hpBaseView'
], function ($, _, HpBaseView) {
  'use strict';
  
  return HpBaseView.extend({
    events: {
      'change select': function () {
        this.trigger('updated');
      }
    },
    
    // Track if the select box has been converted yet.
    converted: false,
    
    /**
     * Initialize.
     */
    initialize: function () {
    },
    
    /**
     * Render.
     */
    render: function () {
      // Register responsive callbacks.
      window.area53.notifier.setCallbacks({
        tablet: _.bind(function (current, previous) {
          if (previous === 'phone') {
            this.resetAlphaSort();
          }
        }, this),
        phone: _.bind(this.convertAlphaSort, this)
      });

      return this;
    },
    
    /**
     * Turn the alpha sort into a select box.
     *
     * Returns this.
     */
    convertAlphaSort: function () {
      var options = '<option>A &dash; Z</option>',
        contents;
      
      if (this.converted) {
        return this;
      }
      
      // List.
      this.$list = this.$el.find('.nav');
      contents = this.$list.find('a').text();
      
      // Select box.
      this.$select = $('<select class="pagination alpha-pagination" />');
        
      // Strip out 'All' if it exists.
      if (contents.indexOf('All') > -1) {
        contents = contents.slice(3);
      }
      
      // Convert the letters to options.
      _.times(contents.length, function (index) {
        options += '<option value="' + contents[index] + '">' + contents[index] + '</option>';
      });
        
      // Insert the select box.
      this.$select.html(options);
      
      this.$el.append(this.$select);
      this.$list.hide();
      
      this.converted = true;

      return this;
    },

    /**
     * Turn the alpha sort back from the select box into the pagination style.
     *
     * Returns this.
     */
    resetAlphaSort: function () {
      this.$select.remove();
      this.$list.show();
      
      this.converted = true;
      
      return this;
    }
  });
});