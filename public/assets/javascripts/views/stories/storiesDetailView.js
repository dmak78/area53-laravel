/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Story detail page.
*/
define([
  // Base views.
  'baseviews/hpBaseView',
  
  // Components.
  'components/sliderView',
  'components/newsfeedView'
], function (HpBaseView, SliderView, NewsfeedView) {
  'use strict';
  
  return HpBaseView.extend({
    events: {
      'click .remove-tag': 'removeUserTag'
    },
    
    /**
     * Initialize.
     */
    initialize: function () {
      this.slider = new SliderView();
      this.newsfeed = new NewsfeedView();
    },
    
    /**
     * Render.
     *
     * Returns this.
     */
    render: function () {
      this.assign({
        '.story-detail-slider': this.slider,
        '.newsfeed': this.newsfeed
      });
      
      return this;
    },
    
    /**
     * Remove a user from the list of tags.
     */
    removeUserTag: function (event) {
      var $target = $(event.target);
      
      event.preventDefault();
      
      if (confirm('Are you sure you want to untag yourself from this story?')) {
        $target.closest('li').fadeOut(function () {
          $(this).remove();
        });
      }
    }
  });
});