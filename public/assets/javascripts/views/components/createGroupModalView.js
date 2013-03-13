/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Create Group modal view.
*/
define([
  // Libs
  'jquery',

  // Base views.
  'baseviews/hpBaseView',

  // Components.
  'components/sliderView'
], function ($, HpBaseView, SliderView) {
  'use strict';

  return HpBaseView.extend({
    events: {
      'click .previous-step': 'prev',
      'click .next-step': 'next'
    },

    /**
     * Initialize.
     */
    initialize: function () {
      this.newGroupSlider = new SliderView();

      // Watch for update events from the slider.
      this.newGroupSlider.on('updated', this.update, this);
    },

    /**
     * Render.
     *
     * Returns this.
     */
    render: function () {
      // Render child views.
      this.assign({
          '.welcome-slider': this.newGroupSlider
      });

      // Show the modal on render.
      this.$el.find('#newgroup-modal').modal('show');

      // Something weird is preventing the slider from rendering on show.
      this.newGroupSlider.render();

      return this;
    },

    /**
     * Go to previous slide.
     *
     * event  - Event object from the click.
     *
     * Returns this.
     */
    prev: function (event) {
      event.preventDefault();
      this.newGroupSlider.slider.prev();
      return this;
    },

    /**
     * Go to the next slide.
     *
     * event  - Event object from the click.
     *
     * Returns this.
     */
    next: function (event) {
      event.preventDefault();
      this.newGroupSlider.slider.next();
      return this;
    },

    /**
     * Update callback for the slider.
     *
     * index  - Index of the current slide.
     *
     * Returns this.
     */
    update: function (index) {
      var $current = this.$el.find('.current'),
        $submit = this.$el.find('.submit'),
        fn = index + 1 === 6 ? 'removeClass' : 'addClass';

      // Update the step.
      $current.text(index + 1);

      // Update the submit button.
      $submit[fn].call($submit, 'disabled');

      return this;
    }
  });
});